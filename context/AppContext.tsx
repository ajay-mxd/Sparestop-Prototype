import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Role, CartItem, Part, SalesRecord, Order, WarehouseOrder, Invoice, DarkstoreOrder } from '../types';
import { retailers as initialRetailers } from '../data/retailers';
import { parts as initialParts } from '../data/parts';

type Theme = 'light' | 'dark';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  cart: CartItem[];
  addToCart: (part: Part, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  clearCart: () => void;
  placeOrder: (details: any) => Promise<string>;
  processSale: (items: CartItem[], customerInfo?: string) => Promise<string>;
  sales: SalesRecord[];
  addSale: (sale: SalesRecord) => void;
  orders: Order[]; // Customer orders
  warehouseOrders: WarehouseOrder[]; // Retailer restocking orders (Legacy)
  darkstoreOrders: DarkstoreOrder[]; // New Darkstore orders
  placeDarkstoreOrder: (items: { part: Part; quantity: number }[], deliveryType: 'store' | 'garage', address: string) => Promise<string>;
  placeWarehouseOrder: (items: { part: Part; quantity: number }[]) => Promise<string>;
  invoices: Invoice[];
  payInvoice: (id: string) => void;
  inventory: typeof initialRetailers;
  partsCatalog: Part[];
  updatePartStock: (partId: string, newStock: number) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [sales, setSales] = useState<SalesRecord[]>([
     { id: 's1', date: '2023-11-20', partName: 'Oil Filter', sku: 'BP-2891', amount: 250, status: 'paid', customer: 'DL-3C-1234' },
     { id: 's2', date: '2023-11-21', partName: 'Brake Pads', sku: 'BP-FR-01', amount: 1500, status: 'pending', customer: 'UP-16-5678' }
  ]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState(initialRetailers);
  const [partsCatalog, setPartsCatalog] = useState(initialParts);
  
  // Legacy warehouse orders (kept for type compatibility but unused in UI now)
  const [warehouseOrders, setWarehouseOrders] = useState<WarehouseOrder[]>([]);

  // New Darkstore Orders
  const [darkstoreOrders, setDarkstoreOrders] = useState<DarkstoreOrder[]>([
    {
      id: 'DS-9021',
      date: new Date().toISOString().split('T')[0],
      items: [{ part: initialParts[2], quantity: 1 }],
      total: 800,
      status: 'out-for-delivery',
      deliveryType: 'garage',
      deliveryAddress: 'Speedy Garage, Sector 14, Gurgaon',
      eta: '12 mins',
      rider: {
        name: 'Rahul Kumar',
        vehicleNumber: 'DL-10-SA-4421',
        phone: '+91 98765 00000',
        coordinates: { lat: 60, lng: 40 } // Simulated progress (0-100)
      }
    }
  ]);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-2023-001', date: '2023-11-15', amount: 45000, dueDate: '2023-12-15', status: 'pending', orderId: 'WO-1001' },
    { id: 'INV-2023-002', date: '2023-10-01', amount: 12000, dueDate: '2023-11-01', status: 'paid', orderId: 'WO-0998' }
  ]);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToCart = (part: Part, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.part.id === part.id);
      if (existing) {
        return prev.map(item => item.part.id === part.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { part, quantity }];
    });
  };

  const removeFromCart = (partId: string) => {
    setCart(prev => prev.filter(item => item.part.id !== partId));
  };

  const clearCart = () => setCart([]);

  const addSale = (sale: SalesRecord) => {
    setSales(prev => [sale, ...prev]);
  };

  const placeOrder = async (details: any): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString().split('T')[0],
          items: [...cart],
          total: cart.reduce((sum, item) => sum + item.part.price * item.quantity, 0),
          status: 'processing',
          retailerName: details.retailerName,
          eta: '5-6 hours'
        };
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        resolve(newOrder.id);
      }, 1500);
    });
  };

  const processSale = async (items: CartItem[], customerInfo: string = 'Walk-in'): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1. Update Inventory for Retailer (Assuming current retailer is 'r1')
        setInventory(prevRetailers => {
          return prevRetailers.map(retailer => {
            if (retailer.id === 'r1') {
              const newInventory = [...retailer.inventory];
              items.forEach(item => {
                const invItemIndex = newInventory.findIndex(i => i.partId === item.part.id);
                if (invItemIndex >= 0) {
                  const currentQty = newInventory[invItemIndex].quantity;
                  newInventory[invItemIndex] = { 
                    ...newInventory[invItemIndex], 
                    quantity: Math.max(0, currentQty - item.quantity) 
                  };
                }
              });
              return { ...retailer, inventory: newInventory };
            }
            return retailer;
          });
        });

        const date = new Date().toISOString().split('T')[0];
        const newSales: SalesRecord[] = items.map(item => ({
          id: `SALE-${Math.floor(Math.random() * 100000)}`,
          date,
          partName: item.part.name,
          sku: item.part.sku,
          amount: item.part.price * item.quantity,
          status: 'paid',
          customer: customerInfo
        }));
        
        setSales(prev => [...newSales, ...prev]);
        clearCart();
        resolve('success');
      }, 1500);
    });
  };

  const placeWarehouseOrder = async (items: { part: Part; quantity: number }[]): Promise<string> => {
    // Kept for compatibility, but logic moved to Darkstore
    return 'deprecated';
  };

  const placeDarkstoreOrder = async (items: { part: Part; quantity: number }[], deliveryType: 'store' | 'garage', address: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = items.reduce((sum, item) => sum + (item.part.price * item.quantity), 0);
        const newOrder: DarkstoreOrder = {
          id: `DS-${Math.floor(Math.random() * 10000)}`,
          date: new Date().toISOString().split('T')[0],
          items,
          total,
          status: 'confirmed',
          deliveryType,
          deliveryAddress: address,
          eta: 'Searching for Rider...',
          // Rider will be assigned later in a real app
        };
        
        setDarkstoreOrders(prev => [newOrder, ...prev]);
        resolve(newOrder.id);
      }, 2000);
    });
  };

  const payInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
  };

  const updatePartStock = (partId: string, newStock: number) => {
    setPartsCatalog(prev => prev.map(p => p.id === partId ? { ...p, warehouseStock: newStock } : p));
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      processSale,
      sales,
      addSale,
      orders,
      warehouseOrders,
      placeWarehouseOrder,
      darkstoreOrders,
      placeDarkstoreOrder,
      invoices,
      payInvoice,
      inventory,
      partsCatalog,
      updatePartStock,
      theme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};