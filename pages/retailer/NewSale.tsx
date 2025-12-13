import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { vehicles } from '../../data/vehicles';
import { Part } from '../../types';
import { Search, ShoppingCart, Plus, Check, AlertCircle } from 'lucide-react';

export const NewSale: React.FC = () => {
  const { partsCatalog, addToCart, cart, placeOrder } = useApp();
  const [activeTab, setActiveTab] = useState<'vehicle' | 'part'>('vehicle');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');

  const handleVehicleSearch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Find vehicle ID
      const vehicle = vehicles.find(v => v.make === selectedMake && v.model === selectedModel);
      if (vehicle) {
        const results = partsCatalog.filter(p => p.compatibility.includes(vehicle.id) || p.compatibility.includes('Universal'));
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsProcessing(false);
    }, 800);
  };

  const handleCompleteSale = async () => {
    setIsProcessing(true);
    await placeOrder({ retailerName: 'Current Store' });
    setOrderSuccess('Sale recorded successfully!');
    setIsProcessing(false);
    setTimeout(() => setOrderSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">New Sale</h1>
        {cart.length > 0 && (
          <div className="bg-blue-50 text-primary px-4 py-2 rounded-lg font-medium flex items-center">
            <ShoppingCart size={18} className="mr-2" />
            Total: ₹{cart.reduce((sum, i) => sum + (i.part.price * i.quantity), 0)}
          </div>
        )}
      </div>

      {orderSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center">
          <Check size={20} className="mr-2" /> {orderSuccess}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`flex-1 py-4 text-center font-medium ${activeTab === 'vehicle' ? 'bg-blue-50 text-primary border-b-2 border-primary' : 'text-textSecondary'}`}
          >
            Vehicle-First Search
          </button>
          <button
            onClick={() => setActiveTab('part')}
            className={`flex-1 py-4 text-center font-medium ${activeTab === 'part' ? 'bg-blue-50 text-primary border-b-2 border-primary' : 'text-textSecondary'}`}
          >
            Part-First Search
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'vehicle' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select 
                  className="w-full p-3 border border-border rounded-lg bg-white"
                  value={selectedMake}
                  onChange={e => setSelectedMake(e.target.value)}
                >
                  <option value="">Select Make</option>
                  {Array.from(new Set(vehicles.map(v => v.make))).map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                <select 
                  className="w-full p-3 border border-border rounded-lg bg-white"
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                >
                  <option value="">Select Model</option>
                  {vehicles.filter(v => v.make === selectedMake).map(v => (
                    <option key={v.model} value={v.model}>{v.model}</option>
                  ))}
                </select>
                <button
                  onClick={handleVehicleSearch}
                  disabled={!selectedModel || isProcessing}
                  className="bg-primary text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isProcessing ? 'Searching...' : <><Search size={20} className="mr-2" /> Find Parts</>}
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(part => (
                  <div key={part.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        Img
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${part.stockLevel === 'out' ? 'bg-red-100 text-error' : 'bg-green-100 text-success'}`}>
                        {part.stockLevel === 'out' ? 'Out of Stock' : 'In Stock'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-textPrimary">{part.name}</h3>
                    <p className="text-sm text-textSecondary">{part.sku}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="font-bold text-primary">₹{part.price}</span>
                      <button 
                        onClick={() => addToCart(part)}
                        className="p-2 bg-blue-50 text-primary rounded-full hover:bg-blue-100"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {searchResults.length === 0 && selectedModel && !isProcessing && (
                  <div className="col-span-full text-center py-8 text-textSecondary">
                    No parts found for this selection.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'part' && (
             <div className="text-center py-12 text-textSecondary">
               <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                 <Search size={32} />
               </div>
               <p>Search by part number or name coming in Phase 2</p>
             </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-border p-4 shadow-lg z-30">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-textSecondary">{cart.length} Items</p>
              <p className="text-xl font-bold">Total: ₹{cart.reduce((sum, i) => sum + (i.part.price * i.quantity), 0)}</p>
            </div>
            <button
              onClick={handleCompleteSale}
              disabled={isProcessing}
              className="bg-secondary text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};