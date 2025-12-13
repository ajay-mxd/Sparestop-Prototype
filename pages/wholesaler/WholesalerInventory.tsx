import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Edit2, Check, X } from 'lucide-react';

export const WholesalerInventory: React.FC = () => {
  const { partsCatalog, updatePartStock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const filteredParts = partsCatalog.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    part.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (id: string, currentStock: number) => {
    setEditingId(id);
    setEditValue(currentStock);
  };

  const saveEdit = (id: string) => {
    updatePartStock(id, editValue);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">Warehouse Inventory</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-border rounded-lg bg-white hover:bg-gray-50 text-textSecondary">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-border text-xs uppercase text-textSecondary font-semibold">
              <tr>
                <th className="px-6 py-4">Part Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Compatibility</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredParts.map(part => (
                <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                        {part.sku.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-textPrimary">{part.name}</div>
                        <div className="text-xs text-textSecondary">SKU: {part.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">{part.category}</td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {part.compatibility.includes('Universal') ? 'Universal' : `${part.compatibility.length} Vehicles`}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">₹{part.price}</td>
                  <td className="px-6 py-4">
                    {editingId === part.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          className="w-20 px-2 py-1 border border-border rounded text-sm"
                          value={editValue}
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${part.warehouseStock > 50 ? 'bg-green-500' : part.warehouseStock > 10 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                        <span className="text-sm">{part.warehouseStock} units</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === part.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => saveEdit(part.id)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><Check size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><X size={16} /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEdit(part.id, part.warehouseStock)}
                        className="text-primary hover:text-blue-700 text-sm font-medium inline-flex items-center"
                      >
                        <Edit2 size={14} className="mr-1" /> Adjust
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};