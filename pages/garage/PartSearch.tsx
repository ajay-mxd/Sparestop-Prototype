import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const PartSearch: React.FC = () => {
  const { partsCatalog, addToCart } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  const categories = Array.from(new Set(partsCatalog.map(p => p.category)));

  const filteredParts = partsCatalog.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          part.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? part.category.toLowerCase().includes(selectedCategory.toLowerCase()) || part.id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-background z-10 pt-2 pb-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input 
              type="text" 
              placeholder="Search parts, SKUs..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white p-3 border border-border rounded-xl shadow-sm">
            <Filter size={20} className="text-textSecondary" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'bg-white border border-border text-textSecondary'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-white border border-border text-textSecondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredParts.map(part => (
          <div key={part.id} className="bg-white p-4 rounded-xl border border-border shadow-sm flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-textPrimary">{part.name}</h3>
                <p className="text-xs text-textSecondary">{part.category} • {part.sku}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {part.compatibility.slice(0, 2).map(c => (
                     <span key={c} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-textSecondary">{c}</span>
                  ))}
                  {part.compatibility.length > 2 && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-textSecondary">+{part.compatibility.length - 2}</span>}
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-lg text-primary">₹{part.price}</span>
                <button 
                  onClick={() => { addToCart(part); navigate('/garage/cart'); }}
                  className="bg-blue-50 text-primary px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"
                >
                  <ShoppingCart size={14} className="mr-1" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredParts.length === 0 && (
          <div className="text-center py-10 text-textSecondary">
            No parts found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};