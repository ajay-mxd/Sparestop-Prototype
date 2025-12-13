import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Package } from 'lucide-react';

export const RetailerNetwork: React.FC = () => {
  const { inventory: retailers } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Retailer Network</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailers.map(retailer => (
          <div key={retailer.id} className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-textPrimary">{retailer.name}</h3>
                <span className="text-xs text-success bg-green-50 px-2 py-1 rounded mt-1 inline-block">Active Partner</span>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-secondary font-bold">
                {retailer.name.charAt(0)}
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-textSecondary">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>{retailer.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>{retailer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-primary" />
                <span>Stocking {retailer.inventory.length} distinct parts</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <div className="text-xs text-textSecondary">
                Last Order: <span className="text-textPrimary font-medium">2 days ago</span>
              </div>
              <button className="text-sm text-primary font-medium hover:underline">View History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};