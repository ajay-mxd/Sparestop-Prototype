import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle } from 'lucide-react';

export const RetailerInventory: React.FC = () => {
  const { inventory, partsCatalog } = useApp();
  // Assume we are "r1"
  const myInventory = inventory.find(r => r.id === 'r1')?.inventory || [];

  const inventoryWithDetails = myInventory.map(item => {
    const part = partsCatalog.find(p => p.id === item.partId);
    return { ...item, part };
  }).filter(i => i.part !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">My Inventory</h1>
        {/* Order Stock link removed */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventoryWithDetails.map(item => (
          <div key={item.partId} className="bg-surface p-4 rounded-xl shadow-sm border border-border">
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-textPrimary">{item.part!.name}</h3>
                 <p className="text-xs text-textSecondary">{item.part!.sku}</p>
               </div>
               <span className={`px-2 py-1 rounded text-xs font-bold ${item.quantity < 3 ? 'bg-red-500/20 text-error' : 'bg-green-500/20 text-success'}`}>
                 {item.quantity} In Stock
               </span>
            </div>
            
            <div className="mt-4 flex justify-between items-end">
              <div>
                <div className="text-xs text-textSecondary">Selling Price</div>
                <div className="font-bold text-primary">₹{item.part!.price}</div>
              </div>
              {item.quantity < 3 && (
                <div className="flex items-center text-xs text-warning">
                  <AlertTriangle size={12} className="mr-1" /> Low Stock
                </div>
              )}
            </div>
          </div>
        ))}
        {inventoryWithDetails.length === 0 && (
          <div className="col-span-full py-12 text-center text-textSecondary bg-surface rounded-xl border border-dashed border-border">
            No items in inventory.
          </div>
        )}
      </div>
    </div>
  );
};