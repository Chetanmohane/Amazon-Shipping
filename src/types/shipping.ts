export type StatusType = 
  | 'ORDER_PLACED' 
  | 'DISPATCHED' 
  | 'IN_TRANSIT' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'ON_HOLD'
  | 'CANCELLED';

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export interface TrackingCheckpoint {
  id: string;
  timestamp: string;
  status: StatusType;
  location: string;
  description: string;
  isCompleted: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  sku: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface ShipperInfo {
  warehouseName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  hubCode: string;
  gstin: string;
}

export interface Shipment {
  awbNumber: string;
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  status: StatusType;
  paymentType: 'Prepaid' | 'COD';
  codAmount?: number;
  totalAmount: number;
  weightKg: number;
  dimensions: string;
  carrierName: string;
  routingCode: string;
  zone: string;
  deliveryAgent?: {
    name: string;
    phone: string;
    vehicleNo: string;
  };
  customer: CustomerInfo;
  shipper: ShipperInfo;
  items: PackageItem[];
  checkpoints: TrackingCheckpoint[];
  createdAt: string;
}
