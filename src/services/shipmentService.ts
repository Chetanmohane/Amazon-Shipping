import { getSupabaseClient } from '../lib/supabase';
import { Shipment, StatusType, TrackingCheckpoint } from '../types/shipping';
import { initialShipments, loadShipmentsFromStorage, saveShipmentsToStorage } from '../data/mockData';

const GLOBAL_CLOUD_DB_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a07d327e6f3d90';

async function fetchFromGlobalCloud(): Promise<Shipment[] | null> {
  try {
    const res = await fetch(GLOBAL_CLOUD_DB_URL);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.shipments) && json.data.shipments.length > 0) {
        return json.data.shipments;
      }
    }
  } catch (err) {
    console.warn('Global Cloud fetch failed:', err);
  }
  return null;
}

async function saveToGlobalCloud(shipments: Shipment[]): Promise<void> {
  try {
    await fetch(GLOBAL_CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Amazon Shipping Global Live DB',
        data: { shipments }
      })
    });
  } catch (err) {
    console.warn('Global Cloud save failed:', err);
  }
}

export async function fetchAllShipments(): Promise<Shipment[]> {
  const supabase = getSupabaseClient();
  let resultShipments: Shipment[] = [];

  if (supabase) {
    try {
      const { data: rows, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && rows && rows.length > 0) {
        const { data: cpRows } = await supabase.from('checkpoints').select('*');

        resultShipments = rows.map((r: any) => {
          const matchedCp = cpRows
            ? cpRows
                .filter((cp: any) => cp.awb_number === r.awb_number)
                .map((cp: any) => ({
                  id: cp.id,
                  timestamp: cp.timestamp,
                  status: cp.status as StatusType,
                  location: cp.location,
                  description: cp.description,
                  isCompleted: cp.is_completed ?? true
                }))
            : [];

          return {
            awbNumber: r.awb_number,
            orderId: r.order_id,
            orderDate: r.order_date,
            estimatedDelivery: r.estimated_delivery,
            status: r.status as StatusType,
            paymentType: r.payment_type,
            totalAmount: Number(r.total_amount),
            weightKg: Number(r.weight_kg),
            dimensions: r.dimensions,
            carrierName: r.carrier_name,
            routingCode: r.routingCode || r.routing_code || 'HUB-01',
            zone: r.zone || 'Zone A',
            customer: r.customer_info,
            shipper: r.shipper_info,
            items: r.items,
            deliveryAgent: r.delivery_agent,
            checkpoints: matchedCp,
            createdAt: r.created_at
          };
        });
      }
    } catch (err) {
      console.warn('Supabase fetch failed:', err);
    }
  }

  // Fallback to Global Cloud Database if Supabase returned 0 rows
  if (resultShipments.length === 0) {
    const cloudShipments = await fetchFromGlobalCloud();
    if (cloudShipments && cloudShipments.length > 0) {
      resultShipments = cloudShipments;
    }
  }

  // If still empty, fallback to local storage or initial shipments
  if (resultShipments.length === 0) {
    resultShipments = loadShipmentsFromStorage();
  }

  if (resultShipments.length === 0) {
    resultShipments = [...initialShipments];
  }

  saveShipmentsToStorage(resultShipments);
  return resultShipments;
}

export async function saveNewShipment(newShipment: Shipment): Promise<Shipment[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { error: shipErr } = await supabase.from('shipments').insert({
        awb_number: newShipment.awbNumber,
        order_id: newShipment.orderId,
        order_date: newShipment.orderDate,
        estimated_delivery: newShipment.estimatedDelivery,
        status: newShipment.status,
        payment_type: newShipment.paymentType,
        total_amount: newShipment.totalAmount,
        weight_kg: newShipment.weightKg,
        dimensions: newShipment.dimensions,
        carrier_name: newShipment.carrierName,
        routing_code: newShipment.routingCode,
        zone: newShipment.zone,
        customer_info: newShipment.customer,
        shipper_info: newShipment.shipper,
        items: newShipment.items,
        delivery_agent: newShipment.deliveryAgent,
        created_at: newShipment.createdAt
      });

      if (shipErr) console.error('Supabase shipment insert error:', shipErr);

      if (newShipment.checkpoints.length > 0) {
        const cpInserts = newShipment.checkpoints.map(cp => ({
          id: cp.id,
          awb_number: newShipment.awbNumber,
          timestamp: cp.timestamp,
          status: cp.status,
          location: cp.location,
          description: cp.description,
          is_completed: cp.isCompleted
        }));
        await supabase.from('checkpoints').insert(cpInserts);
      }
    } catch (e) {
      console.error('Failed saving to Supabase:', e);
    }
  }

  // Update local storage
  const current = loadShipmentsFromStorage();
  const updated = [newShipment, ...current.filter(s => s.awbNumber !== newShipment.awbNumber)];
  saveShipmentsToStorage(updated);
  
  // Sync to Global Cloud DB
  saveToGlobalCloud(updated);
  return updated;
}

export async function updateShipmentStatusInDb(
  awbNumber: string,
  newStatus: StatusType,
  newCheckpoint: TrackingCheckpoint
): Promise<Shipment[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      await supabase
        .from('shipments')
        .update({ status: newStatus })
        .eq('awb_number', awbNumber);

      await supabase.from('checkpoints').insert({
        id: newCheckpoint.id,
        awb_number: awbNumber,
        timestamp: newCheckpoint.timestamp,
        status: newCheckpoint.status,
        location: newCheckpoint.location,
        description: newCheckpoint.description,
        is_completed: newCheckpoint.isCompleted
      });
    } catch (e) {
      console.error('Error updating status in Supabase:', e);
    }
  }

  // Local update
  const current = loadShipmentsFromStorage();
  const updated = current.map(s => {
    if (s.awbNumber === awbNumber) {
      return {
        ...s,
        status: newStatus,
        checkpoints: [...s.checkpoints, newCheckpoint]
      };
    }
    return s;
  });
  saveShipmentsToStorage(updated);
  
  // Sync to Global Cloud DB
  saveToGlobalCloud(updated);
  return updated;
}

export async function deleteShipmentFromDb(awbNumber: string): Promise<Shipment[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      await supabase.from('shipments').delete().eq('awb_number', awbNumber);
    } catch (e) {
      console.error('Error deleting from Supabase:', e);
    }
  }

  const current = loadShipmentsFromStorage();
  const updated = current.filter(s => s.awbNumber !== awbNumber);
  saveShipmentsToStorage(updated);
  
  // Sync to Global Cloud DB
  saveToGlobalCloud(updated);
  return updated;
}
