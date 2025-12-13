import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Navigation } from 'lucide-react';

export const StoreLocator: React.FC = () => {
  const { inventory: retailers } = useApp();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-textPrimary">Nearby Stores</h1>
      
      {/* Mock Map Visual */}
      <div className="bg-blue-50 h-48 rounded-xl border border-blue-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#2563EB 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        <div className="z-10 text-center">
          <MapPin size={32} className="text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-primary">Map View (Simulated)</p>
        </div>
      </div>

      <div className="space-y-3">
        {retailers.sort((a,b) => a.distance - b.distance).map(store => (
          <div key={store.id} className="bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-textPrimary">{store.name}</h3>
                <p className="text-sm text-textSecondary">{store.address}</p>
              </div>
              <span className="bg-gray-100 text-xs font-bold px-2 py-1 rounded text-textSecondary">{store.distance} km</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-textSecondary mb-3">
              <Phone size={14} />
              <span>{store.phone}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
                <Navigation size={14} className="mr-2" /> Directions
              </button>
              <button className="flex-1 border border-primary text-primary py-2 rounded-lg text-sm font-medium">
                Call Store
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};