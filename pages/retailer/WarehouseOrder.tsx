import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Part } from '../../types';
import { Search, ShoppingCart, Plus, Minus, Truck } from 'lucide-react';

export const WarehouseOrder: React.FC = () => {
  const { partsCatalog, placeWarehouseOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderCart, setOrderCart] = useState<{ part: Part; quantity: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const filteredParts = partsCatalog.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    part.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (part: Part) => {
    setOrderCart(prev => {
      const existing = prev.find(item => item.part.id === part.id);
      if (existing) {
        return prev.map(item => item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { part, quantity: 1 }];
    });
  };

  const updateQuantity = (partId: string, delta: number) => {
    setOrderCart(prev => prev.map(item => {
      if (item.part.id === partId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    await placeWarehouseOrder(orderCart);
    setSuccessMsg('Warehouse order placed successfully! Invoice generated.');
    setOrderCart([]);
    setIsSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const totalEstimate = orderCart.reduce((acc, item) => acc + (item.part.price * 0.7 * item.quantity), 0); // 70% of MRP

  return (
    <div className="space-y-6 h-auto md:h-[calc(100vh-100px)] flex flex-col pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-2xl font-bold text-textPrimary">Restock Inventory</h1>
        <div className="text-sm text-textSecondary bg-blue-50 px-3 py-1 rounded w-fit">
          Wholesale Rate: 70% of MRP
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center">
          <Truck size={20} className="mr-2" /> {successMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        {/* Catalog */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-border overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
              <input 
                type="text" 
                placeholder="Search catalog..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredParts.map(part => (
              <div key={part.id} className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium text-textPrimary">{part.name}</div>
                  <div className="text-xs text-textSecondary">SKU: {part.sku} • Stock: {part.warehouseStock}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-textSecondary line-through">MRP ₹{part.price}</div>
                    <div className="font-bold text-primary">₹{(part.price * 0.7).toFixed(0)}</div>
                  </div>
                  <button 
                    onClick={() => addToOrder(part)}
                    className="p-2 bg-blue-50 text-primary rounded-full hover:bg-blue-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-border flex flex-col overflow-hidden min-h-[300px] md:min-h-0">
          <div className="p-4 bg-gray-50 border-b border-border font-bold flex items-center gap-2">
            <ShoppingCart size={18} /> Order Manifest
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderCart.length === 0 ? (
              <div className="text-center text-textSecondary py-10">Cart is empty</div>
            ) : (
              orderCart.map(item => (
                <div key={item.part.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <div className="font-medium truncate w-32">{item.part.name}</div>
                    <div className="text-xs text-textSecondary">₹{(item.part.price * 0.7).toFixed(0)} x {item.quantity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.part.id, -1)} className="p-1 hover:bg-gray-100 rounded"><Minus size={14} /></button>
                    <span className="w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.part.id, 1)} className="p-1 hover:bg-gray-100 rounded"><Plus size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-border bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-textSecondary">Estimated Total</span>
              <span className="font-bold text-lg">₹{totalEstimate.toFixed(0)}</span>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={orderCart.length === 0 || isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Placing Order...' : 'Submit Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};