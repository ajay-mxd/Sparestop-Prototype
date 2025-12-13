import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GarageCart: React.FC = () => {
  const { cart, removeFromCart, inventory } = useApp();
  const [selectedStore, setSelectedStore] = useState('');
  const [step, setStep] = useState(1);

  const total = cart.reduce((acc, item) => acc + (item.part.price * item.quantity), 0);

  // Simple store selection logic: find stores that have stock of at least one item
  // For prototype, just listing nearby stores
  const nearbyStores = inventory.slice(0, 3);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Trash2 size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-textPrimary mb-2">Your Cart is Empty</h2>
        <p className="text-textSecondary mb-6">Find parts for your next repair job.</p>
        <Link to="/garage/search" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">
          Browse Parts
        </Link>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-green-100 p-6 rounded-full mb-4 animate-bounce">
          <MapPin size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Reservation Confirmed!</h2>
        <p className="text-textSecondary mb-6">Your parts are reserved at <strong>{inventory.find(s => s.id === selectedStore)?.name}</strong>.</p>
        <div className="bg-white p-4 rounded-xl border border-border w-full max-w-sm mb-6">
           <div className="text-xs text-textSecondary uppercase mb-1">Pickup Code</div>
           <div className="text-3xl font-mono font-bold tracking-widest text-primary">8829</div>
        </div>
        <Link to="/garage" className="text-primary font-medium">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-textPrimary">Your Cart</h1>
      
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.part.id} className="bg-white p-4 rounded-xl border border-border flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-textPrimary text-sm">{item.part.name}</h3>
                <button onClick={() => removeFromCart(item.part.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-xs text-textSecondary mb-2">{item.part.sku}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Qty: {item.quantity}</span>
                <span className="font-bold text-primary">₹{item.part.price * item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="font-bold text-lg mb-3">Select Pickup Store</h3>
        <div className="space-y-3">
          {nearbyStores.map(store => (
            <div 
              key={store.id} 
              onClick={() => setSelectedStore(store.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedStore === store.id ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-border bg-white'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{store.name}</span>
                <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded">{store.distance} km</span>
              </div>
              <p className="text-xs text-textSecondary mt-1">{store.address}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-border p-4 shadow-lg z-30">
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
          <div>
            <p className="text-xs text-textSecondary">Total Payable</p>
            <p className="text-xl font-bold">₹{total}</p>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!selectedStore}
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Reserve Now <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};