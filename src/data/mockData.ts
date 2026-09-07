import { Shipment } from '../types/shipping';

export const initialShipments: Shipment[] = [
  {
    awbNumber: "AMZ-IN-483028585",
    orderId: "408-7294820-1948205",
    orderDate: "Sep 06, 2026",
    estimatedDelivery: "Tomorrow by 9 PM",
    status: "OUT_FOR_DELIVERY",
    paymentType: "Prepaid",
    totalAmount: 1499,
    weightKg: 0.85,
    dimensions: "18 x 12 x 8 cm",
    carrierName: "Amazon Transportation Services (ATS)",
    routingCode: "BOM5 / MAA1",
    zone: "WEST-Z1",
    deliveryAgent: {
      name: "Vikram Singh",
      phone: "+91 98765 43210",
      vehicleNo: "MH 04 AB 8920"
    },
    customer: {
      name: "Chetan Mohane",
      phone: "+91 98765 43210",
      email: "chetanmohane27@gmail.com",
      addressLine1: "Flat 402, Green Heights, Station Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      landmark: "Near Central Station"
    },
    shipper: {
      warehouseName: "Amazon FC BOM5 Main Hub",
      address: "Bhiwandi Logistic Park C3",
      city: "Thane",
      state: "Maharashtra",
      pincode: "421302",
      hubCode: "BOM5-FC",
      gstin: "27AAACA0583G1Z3"
    },
    items: [
      {
        id: "item-101",
        name: "Amazon Echo Dot (5th Gen) Smart Speaker",
        quantity: 1,
        price: 1499,
        image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80",
        sku: "SKU-ECH-5G"
      }
    ],
    checkpoints: [
      {
        id: "cp-1",
        timestamp: "Sep 06, 2026 - 10:00 AM",
        status: "ORDER_PLACED",
        location: "Bhiwandi FC, Thane",
        description: "Package prepared and ATS shipping label generated.",
        isCompleted: true
      },
      {
        id: "cp-2",
        timestamp: "Sep 06, 2026 - 04:30 PM",
        status: "DISPATCHED",
        location: "Mumbai Express Air Gateway",
        description: "Dispatched from warehouse and loaded on linehaul route.",
        isCompleted: true
      },
      {
        id: "cp-3",
        timestamp: "Sep 07, 2026 - 06:15 AM",
        status: "IN_TRANSIT",
        location: "Central Sorting Station, Mumbai",
        description: "Arrived at destination sorting hub and processed by automated sorter.",
        isCompleted: true
      },
      {
        id: "cp-4",
        timestamp: "Sep 07, 2026 - 09:30 AM",
        status: "OUT_FOR_DELIVERY",
        location: "Local Delivery Station, Mumbai",
        description: "Package assigned to delivery associate Vikram Singh for doorstep delivery.",
        isCompleted: true
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    awbNumber: "AMZ-IN-992014820",
    orderId: "408-1094820-8830192",
    orderDate: "Sep 07, 2026",
    estimatedDelivery: "Sep 09, 2026",
    status: "DISPATCHED",
    paymentType: "COD",
    codAmount: 2499,
    totalAmount: 2499,
    weightKg: 1.2,
    dimensions: "24 x 18 x 10 cm",
    carrierName: "Amazon Transportation Services (ATS)",
    routingCode: "DEL4 / BOM2",
    zone: "NORTH-Z2",
    customer: {
      name: "Ananya Roy",
      phone: "+91 98200 11223",
      email: "ananya.roy@example.com",
      addressLine1: "B-12, Green Park Main",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110016"
    },
    shipper: {
      warehouseName: "Amazon FC DEL4 Sorting Center",
      address: "Kundli Industrial Area",
      city: "Sonepat",
      state: "Haryana",
      pincode: "131028",
      hubCode: "DEL4-FC",
      gstin: "07AAACA0583G1Z1"
    },
    items: [
      {
        id: "item-102",
        name: "Wireless ANC Bluetooth Headphones",
        quantity: 1,
        price: 2499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        sku: "SKU-WHP-ANC"
      }
    ],
    checkpoints: [
      {
        id: "cp-201",
        timestamp: "Sep 07, 2026 - 11:00 AM",
        status: "ORDER_PLACED",
        location: "Amazon DEL4 Fulfillment Center",
        description: "Order packaged and shipping label generated.",
        isCompleted: true
      },
      {
        id: "cp-202",
        timestamp: "Sep 07, 2026 - 03:00 PM",
        status: "DISPATCHED",
        location: "Delhi Air Cargo Terminal",
        description: "Dispatched from facility and handed to express transit team.",
        isCompleted: true
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const STORAGE_KEY = "amazon_tracking_shipments_v2";

export function loadShipmentsFromStorage(): Shipment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
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
