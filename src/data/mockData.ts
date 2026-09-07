import { Shipment } from '../types/shipping';

// Default initial shipments set to empty array for 100% clean live database mode
export const initialShipments: Shipment[] = [];

export const STORAGE_KEY = "amazon_tracking_shipments_v2";

export function loadShipmentsFromStorage(): Shipment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("Error loading shipments from storage", err);
  }
  return initialShipments;
}

export function saveShipmentsToStorage(shipments: Shipment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
  } catch (err) {
    console.error("Error saving shipments to storage", err);
  }
}
