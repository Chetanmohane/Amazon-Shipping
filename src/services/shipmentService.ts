import { getSupabaseClient } from '../lib/supabase';
import { Shipment, StatusType, TrackingCheckpoint } from '../types/shipping';
import { initialShipments, loadShipmentsFromStorage, saveShipmentsToStorage } from '../data/mockData';

export async function fetchAllShipments(): Promise<Shipment[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: rows, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && rows && rows.length > 0) {
        // Fetch checkpoints for these shipments
        const { data: cpRows } = await supabase.from('checkpoints').select('*');

        const shipments: Shipment[] = rows.map((r: any) => {
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

        // Cache to localStorage
        saveShipmentsToStorage(shipments);
        return shipments;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  // Local storage fallback
  return loadShipmentsFromStorage();
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
  return updated;
}
