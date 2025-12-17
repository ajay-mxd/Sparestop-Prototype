import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { vehicles } from '../../data/vehicles';
import { AlertTriangle, Search, X, MapPin, Car, Info, Package } from 'lucide-react';
import { Part } from '../../types';

export const RetailerInventory: React.FC = () => {
  const { inventory, partsCatalog } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ part: Part; quantity: number } | null>(null);

  // Assume we are "r1"
  const myInventory = inventory.find(r => r.id === 'r1')?.inventory || [];

  const inventoryWithDetails = myInventory.map(item => {
    const part = partsCatalog.find(p => p.id === item.partId);
    return { ...item, part };
  }).filter((i): i is { part: Part; quantity: number; partId: string } => i.part !== undefined);

  const filteredInventory = inventoryWithDetails.filter(item => 
    item.part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.part.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to get vehicle names from compatibility IDs
  const getCompatibleVehicles = (part: Part) => {
    if (part.compatibility.includes('Universal')) return ['Universal Compatibility'];
    return part.compatibility.map(id => {
      const v = vehicles.find(veh => veh.id === id);
      return v ? `${v.make} ${v.model}` : id;
    });
  };

  // Mock location generator based on SKU
  const getStorageLocation = (sku: string) => {
    const aisle = (sku.charCodeAt(sku.length - 1) % 10) + 1;
    const shelf = String.fromCharCode(65 + (sku.charCodeAt(0) % 6)); // A-F
    return `Aisle ${aisle}, Shelf ${shelf}`;
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">My Inventory</h1>
        
        {/* Search Bar */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input 
                type="text" 
                placeholder="Search by part name or SKU..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-surface focus:ring-2 focus:ring-primary outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map(item => (
          <div 
            key={item.partId} 
            onClick={() => setSelectedItem(item)}
            className="bg-surface p-4 rounded-xl shadow-sm border border-border cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-textPrimary group-hover:text-primary transition-colors">{item.part.name}</h3>
                 <p className="text-xs text-textSecondary">{item.part.sku}</p>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-bold ${item.quantity < 3 ? 'bg-red-500/20 text-error' : 'bg-green-500/20 text-success'}`}>
                 {item.quantity} In Stock
               </span>
            </div>
            
            <div className="mt-4 flex justify-between items-end">
              <div>
                <div className="text-xs text-textSecondary">Selling Price</div>
                <div className="font-bold text-primary">₹{item.part.price}</div>
              </div>
              {item.quantity < 3 && (
                <div className="flex items-center text-xs text-warning">
                  <AlertTriangle size={12} className="mr-1" /> Low Stock
                </div>
              )}
            </div>
             <div className="mt-3 pt-3 border-t border-border flex items-center text-xs text-textSecondary">
                <MapPin size={12} className="mr-1" /> {getStorageLocation(item.part.sku)}
             </div>
          </div>
        ))}
        {filteredInventory.length === 0 && (
          <div className="col-span-full py-12 text-center text-textSecondary bg-surface rounded-xl border border-dashed border-border flex flex-col items-center">
            <Package size={48} className="opacity-20 mb-4" />
            <p>No items found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                  <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-surface z-10">
                      <div>
                          <h2 className="text-lg font-bold text-textPrimary">Product Details</h2>
                          <p className="text-xs text-textSecondary">Inventory SKU: {selectedItem.part.sku}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedItem(null)}
                        className="p-2 hover:bg-background rounded-full transition-colors"
                      >
                          <X size={24} className="text-textSecondary" />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-6">
                      {/* Basic Info */}
                      <div className="flex gap-4">
                          <div className="w-24 h-24 bg-background rounded-xl flex items-center justify-center text-textSecondary shrink-0 border border-border">
                              <Package size={32} />
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-textPrimary">{selectedItem.part.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">{selectedItem.part.category}</span>
                              </div>
                              <div className="mt-2 text-2xl font-bold text-textPrimary">₹{selectedItem.part.price}</div>
                          </div>
                      </div>

                      {/* Stock & Location */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-background p-3 rounded-xl border border-border">
                              <div className="text-xs text-textSecondary mb-1 flex items-center gap-1"><Package size={12}/> Stock Level</div>
                              <div className={`text-lg font-bold ${selectedItem.quantity < 3 ? 'text-red-500' : 'text-green-500'}`}>
                                  {selectedItem.quantity} Units
                              </div>
                          </div>
                          <div className="bg-background p-3 rounded-xl border border-border">
                              <div className="text-xs text-textSecondary mb-1 flex items-center gap-1"><MapPin size={12}/> Store Location</div>
                              <div className="text-lg font-bold text-textPrimary">
                                  {getStorageLocation(selectedItem.part.sku)}
                              </div>
                          </div>
                      </div>
                      
                       {/* Part Number / SKU */}
                       <div className="bg-background p-3 rounded-xl border border-border">
                           <div className="text-xs text-textSecondary mb-1 flex items-center gap-1 font-bold uppercase"><Info size={12}/> Part Number (SKU)</div>
                           <div className="text-lg font-mono font-bold text-textPrimary tracking-wide">
                               {selectedItem.part.sku}
                           </div>
                       </div>

                      {/* Compatibility */}
                      <div>
                          <h4 className="font-bold text-sm text-textPrimary mb-3 flex items-center gap-2">
                              <Car size={16} /> Compatible Vehicles
                          </h4>
                          <div className="bg-background rounded-xl p-3 border border-border">
                              <ul className="space-y-2">
                                  {getCompatibleVehicles(selectedItem.part).map((vehicle, idx) => (
                                      <li key={idx} className="text-sm text-textSecondary flex items-start gap-2">
                                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                                          {vehicle}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>

                      {/* Description */}
                      {selectedItem.part.description && (
                          <div>
                              <h4 className="font-bold text-sm text-textPrimary mb-2 flex items-center gap-2">
                                  <Info size={16} /> Description
                              </h4>
                              <p className="text-sm text-textSecondary leading-relaxed">
                                  {selectedItem.part.description}
                              </p>
                          </div>
                      )}
                  </div>
                  
                  <div className="p-4 border-t border-border bg-background/50 sticky bottom-0">
                      <button 
                        onClick={() => setSelectedItem(null)}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                      >
                          Done
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};