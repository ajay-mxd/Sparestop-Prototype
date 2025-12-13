import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { vehicles } from '../../data/vehicles';
import { partCategories } from '../../data/parts';
import { Part } from '../../types';
import { Search, ShoppingCart, Plus, Check, Truck, Box, Trash2, ArrowRight, Wrench } from 'lucide-react';
import * as Icons from 'lucide-react';

export const NewSale: React.FC = () => {
  const { partsCatalog, addToCart, removeFromCart, cart, processSale, inventory } = useApp();
  const [activeTab, setActiveTab] = useState<'vehicle' | 'part'>('vehicle');
  
  // Vehicle First State
  const [vMake, setVMake] = useState('');
  const [vModel, setVModel] = useState('');
  const [vYear, setVYear] = useState('');
  const [vVariant, setVVariant] = useState('');
  const [vVin, setVVin] = useState('');

  // Part First State
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedPartName, setSelectedPartName] = useState('');
  const [pMake, setPMake] = useState('');
  const [pModel, setPModel] = useState('');
  const [pYear, setPYear] = useState('');
  const [pVin, setPVin] = useState('');
  const [step, setStep] = useState<'cat' | 'form' | 'results'>('cat');

  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');

  // Helpers
  const myInventory = inventory.find(r => r.id === 'r1')?.inventory || [];

  const getStockStatus = (part: Part) => {
    const invItem = myInventory.find(i => i.partId === part.id);
    if (invItem && invItem.quantity > 0) {
      return { label: 'In Store', color: 'text-green-600 bg-green-50', icon: Box };
    }
    if (part.warehouseStock > 0) {
      return { label: 'Available in 5hrs', color: 'text-orange-600 bg-orange-50', icon: Truck };
    }
    return { label: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: null };
  };

  const handleVehicleSearch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const vehicle = vehicles.find(v => v.make === vMake && v.model === vModel);
      if (vehicle) {
        // Filter parts compatible with vehicle or universal
        const results = partsCatalog.filter(p => 
          p.compatibility.includes(vehicle.id) || p.compatibility.includes('Universal')
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsProcessing(false);
    }, 800);
  };

  const handlePartFirstSearch = () => {
    setIsProcessing(true);
    setTimeout(() => {
       const vehicle = vehicles.find(v => v.make === pMake && v.model === pModel);
       let results: Part[] = [];
       if (vehicle) {
          results = partsCatalog.filter(p => 
            (p.compatibility.includes(vehicle.id) || p.compatibility.includes('Universal')) &&
            p.category === selectedCat
          );
       }
       if (selectedPartName) {
          results = results.filter(p => p.name.includes(selectedPartName));
       }
       setSearchResults(results);
       setStep('results');
       setIsProcessing(false);
    }, 800);
  };

  const handleCompleteSale = async () => {
    setIsProcessing(true);
    await processSale(cart);
    setOrderSuccess('Sale recorded successfully! Inventory updated.');
    setIsProcessing(false);
    setTimeout(() => setOrderSuccess(''), 4000);
  };

  const resetPartSearch = () => {
    setStep('cat');
    setSelectedCat('');
    setSelectedPartName('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">New Sale</h1>
      </div>

      {orderSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center shadow-sm">
          <Check size={20} className="mr-2" /> {orderSuccess}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'vehicle' ? 'bg-blue-50 text-primary border-b-2 border-primary' : 'text-textSecondary hover:bg-gray-50'}`}
          >
            Vehicle-First Search
          </button>
          <button
            onClick={() => setActiveTab('part')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'part' ? 'bg-blue-50 text-primary border-b-2 border-primary' : 'text-textSecondary hover:bg-gray-50'}`}
          >
            Part-First Search
          </button>
        </div>

        <div className="p-6">
          {/* VEHICLE FIRST TAB */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Make */}
                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1">Make</label>
                  <select 
                    className="w-full p-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
                    value={vMake}
                    onChange={e => { setVMake(e.target.value); setVModel(''); }}
                  >
                    <option value="">Select Make</option>
                    {Array.from(new Set(vehicles.map(v => v.make))).map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                
                {/* Model */}
                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1">Model</label>
                  <select 
                    className="w-full p-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
                    value={vModel}
                    onChange={e => setVModel(e.target.value)}
                    disabled={!vMake}
                  >
                    <option value="">Select Model</option>
                    {vehicles.filter(v => v.make === vMake).map(v => (
                      <option key={v.model} value={v.model}>{v.model}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1">Year</label>
                  <select 
                    className="w-full p-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
                    value={vYear}
                    onChange={e => setVYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {Array.from({length: 10}, (_, i) => 2024 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Variant */}
                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1">Variant</label>
                  <select 
                    className="w-full p-3 border border-border rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
                    value={vVariant}
                    onChange={e => setVVariant(e.target.value)}
                    disabled={!vModel}
                  >
                    <option value="">Select Variant</option>
                    {vMake && vModel && vehicles.find(v => v.make === vMake && v.model === vModel)?.variants.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* VIN */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-textSecondary mb-1">VIN (Optional)</label>
                  <input 
                    type="text"
                    placeholder="Enter 17-character VIN"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase"
                    maxLength={17}
                    value={vVin}
                    onChange={e => setVVin(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleVehicleSearch}
                disabled={!vModel || isProcessing}
                className="w-full md:w-auto px-8 bg-primary text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isProcessing ? 'Checking Compatibility...' : <><Search size={20} className="mr-2" /> Find Compatible Parts</>}
              </button>

              {searchResults.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map(part => {
                    const status = getStockStatus(part);
                    const StatusIcon = status.icon;
                    return (
                      <div key={part.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
                        <div className="flex gap-4 mb-3">
                           <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                             <Box size={24} />
                           </div>
                           <div>
                             <h3 className="font-bold text-textPrimary leading-tight">{part.name}</h3>
                             <p className="text-xs text-textSecondary mt-1">{part.sku}</p>
                             <span className="text-xs text-textSecondary bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{part.category}</span>
                           </div>
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="block font-bold text-lg text-primary">₹{part.price}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${status.color}`}>
                              {StatusIcon && <StatusIcon size={10} />} {status.label}
                            </span>
                          </div>
                          <button 
                            onClick={() => addToCart(part)}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-sm"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PART FIRST TAB */}
          {activeTab === 'part' && (
            <div className="space-y-6">
              {step === 'cat' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {partCategories.map(cat => {
                    // @ts-ignore
                    const IconComponent = Icons[cat.icon] || Icons.Box;
                    return (
                      <button 
                        key={cat.id} 
                        onClick={() => { setSelectedCat(cat.name); setStep('form'); }}
                        className="flex flex-col items-center p-6 border border-border rounded-xl hover:border-primary hover:bg-blue-50 transition-all"
                      >
                        <IconComponent size={32} className="text-primary mb-3" />
                        <span className="font-bold text-textPrimary">{cat.name}</span>
                      </button>
                    );
                   })}
                </div>
              )}

              {step === 'form' && (
                <div className="max-w-2xl mx-auto">
                   <div className="mb-6 flex items-center gap-2 text-sm text-textSecondary">
                      <button onClick={resetPartSearch} className="hover:text-primary underline">Categories</button>
                      <span>/</span>
                      <span className="font-bold text-primary">{selectedCat}</span>
                   </div>

                   <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Wrench className="text-primary" />
                        <h3 className="font-bold text-lg">Smart Compatibility Check</h3>
                      </div>
                      <p className="text-sm text-textSecondary mb-6">
                        To ensure the {selectedCat} fits, please provide vehicle details below.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select 
                          className="w-full p-3 border border-border rounded-lg bg-white"
                          value={pMake}
                          onChange={e => { setPMake(e.target.value); setPModel(''); }}
                        >
                          <option value="">Select Make</option>
                          {Array.from(new Set(vehicles.map(v => v.make))).map(make => (
                            <option key={make} value={make}>{make}</option>
                          ))}
                        </select>
                        
                        <select 
                          className="w-full p-3 border border-border rounded-lg bg-white"
                          value={pModel}
                          onChange={e => setPModel(e.target.value)}
                          disabled={!pMake}
                        >
                          <option value="">Select Model</option>
                          {vehicles.filter(v => v.make === pMake).map(v => (
                            <option key={v.model} value={v.model}>{v.model}</option>
                          ))}
                        </select>

                        <select 
                          className="w-full p-3 border border-border rounded-lg bg-white"
                          value={pYear}
                          onChange={e => setPYear(e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {Array.from({length: 10}, (_, i) => 2024 - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>

                        {/* If we assume parts in certain categories are "complex", we might mandate VIN here */}
                        <input 
                           type="text"
                           placeholder="VIN (Optional for simple parts)"
                           className="w-full p-3 border border-border rounded-lg uppercase"
                           value={pVin}
                           onChange={e => setPVin(e.target.value)}
                        />
                      </div>
                      
                      <button
                        onClick={handlePartFirstSearch}
                        disabled={!pModel}
                        className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                      >
                        Check Compatibility & Show Parts
                      </button>
                   </div>
                </div>
              )}

              {step === 'results' && (
                <div>
                   <div className="mb-4 flex items-center justify-between">
                     <button onClick={() => setStep('form')} className="text-sm text-textSecondary hover:text-primary flex items-center">
                       <ArrowRight className="rotate-180 mr-1" size={14} /> Back to filters
                     </button>
                     <span className="text-sm font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                       Compatible with {pMake} {pModel}
                     </span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.length === 0 ? (
                      <div className="col-span-full text-center py-10 text-textSecondary">
                        No parts found in {selectedCat} for this vehicle.
                      </div>
                    ) : searchResults.map(part => {
                      const status = getStockStatus(part);
                      const StatusIcon = status.icon;
                      return (
                        <div key={part.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
                          <div className="flex gap-4 mb-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                              <Box size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-textPrimary leading-tight">{part.name}</h3>
                              <p className="text-xs text-textSecondary mt-1">{part.sku}</p>
                              <span className="text-xs text-textSecondary bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{part.category}</span>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
                            <div>
                              <span className="block font-bold text-lg text-primary">₹{part.price}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${status.color}`}>
                                {StatusIcon && <StatusIcon size={10} />} {status.label}
                              </span>
                            </div>
                            <button 
                              onClick={() => addToCart(part)}
                              className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700 shadow-sm"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer / Bottom Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30 pb-safe">
          <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
             {/* Cart Items Summary (Mobile optimized) */}
             <div className="w-full md:w-auto flex-1 max-h-32 overflow-y-auto hidden md:block">
                {cart.map(item => (
                  <div key={item.part.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                    <span className="truncate w-40">{item.part.name}</span>
                    <span className="mx-2 text-gray-400">x{item.quantity}</span>
                    <span className="font-bold">₹{item.part.price * item.quantity}</span>
                    <button onClick={() => removeFromCart(item.part.id)} className="ml-2 text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                  </div>
                ))}
             </div>
             
             <div className="w-full md:w-auto flex items-center justify-between gap-6">
               <div>
                 <p className="text-sm text-textSecondary">{cart.length} Items</p>
                 <p className="text-2xl font-bold text-primary">₹{cart.reduce((sum, i) => sum + (i.part.price * i.quantity), 0)}</p>
               </div>
               <button
                 onClick={handleCompleteSale}
                 disabled={isProcessing}
                 className="flex-1 md:flex-none bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 shadow-lg flex items-center justify-center min-w-[160px]"
               >
                 {isProcessing ? 'Processing...' : 'Complete Sale'}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};