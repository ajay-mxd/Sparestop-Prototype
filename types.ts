export type Role = 'retailer' | 'garage' | null;

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  yearRange: string;
  variants: string[];
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  compatibility: string[]; // Vehicle IDs or "Universal"
  stockLevel: 'high' | 'medium' | 'low' | 'out';
  warehouseStock: number;
  complexity: 'simple' | 'medium' | 'complex';
  description?: string;
}

export interface Retailer {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone: string;
  coordinates: { lat: number; lng: number };
  inventory: { partId: string; quantity: number }[];
}

export interface CartItem {
  part: Part;
  quantity: number;
}

export interface SalesRecord {
  id: string;
  date: string;
  partName: string;
  sku: string;
  amount: number;
  status: 'paid' | 'pending';
  customer?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'in-transit' | 'delivered';
  retailerName?: string;
  eta?: string;
}

export interface WarehouseOrder {
  id: string;
  date: string;
  items: { part: Part; quantity: number }[];
  total: number;
  status: 'pending' | 'approved' | 'shipped';
}

export interface DarkstoreOrder {
  id: string;
  date: string;
  items: { part: Part; quantity: number }[];
  total: number;
  status: 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  deliveryType: 'store' | 'garage';
  deliveryAddress: string;
  eta: string; // e.g. "45 mins"
  rider?: {
    name: string;
    vehicleNumber: string;
    phone: string;
    coordinates: { lat: number; lng: number }; // 0-100 scale for demo
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'overdue' | 'pending';
  orderId: string;
}