import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { vehicles } from '../../data/vehicles';
import { partCategories } from '../../data/parts';
import { Part } from '../../types';
import { Search, Check, Truck, Box, ArrowRight, Wrench, CarFront, MapPin, X, Package, Info, Car, ShoppingBag, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';

export const NewSale: React.FC = () => {
  const { partsCatalog, inventory, placeDarkstoreOrder } = useApp();
  const [activeTab, setActiveTab] = useState<'vehicle' | 'part' | 'plate'>('vehicle');
  
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

  // Plate Search State
  const [plateNumber, setPlateNumber] = useState('');

  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderingPartId, setOrderingPartId] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState('');
  
  // Modal State
  const [selectedItem, setSelectedItem] = useState<{ part: Part; status: any } | null>(null);

  // Helpers
  const myInventory = inventory.find(r => r.id === 'r1')?.inventory || [];

  const getStockStatus = (part: Part) => {
    const invItem = myInventory.find(i => i.partId === part.id);
    if (invItem && invItem.quantity > 0) {
      return { label: 'In Store', color: 'text-green-500 bg-green-500/10', icon: Box, inStock: true, quantity: invItem.quantity };
    }
    if (part.warehouseStock > 0) {
      return { label: 'Warehouse', color: 'text-orange-500 bg-orange-500/10', icon: Truck, inStock: false, quantity: 0 };
    }
    return { label: 'Out of Stock', color: 'text-red-500 bg-red-500/10', icon: null, inStock: false, quantity: 0 };
  };

  // Mock location generator based on SKU (Consistent with Inventory)
  const getStorageLocation = (sku: string) => {
    const aisle = (sku.charCodeAt(sku.length - 1) % 10) + 1;
    const shelf = String.fromCharCode(65 + (sku.charCodeAt(0) % 6)); // A-F
    return `Aisle ${aisle}, Shelf ${shelf}`;
  };

  // Helper to get vehicle names from compatibility IDs
  const getCompatibleVehicles = (part: Part) => {
    if (part.compatibility.includes('Universal')) return ['Universal Compatibility'];
    return part.compatibility.map(id => {
      const v = vehicles.find(veh => veh.id === id);
      return v ? `${v.make} ${v.model}` : id;
    });
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

  const handlePlateSearch = () => {
    if (!plateNumber) return;
    setIsProcessing(true);
    // Simulate API lookup
    setTimeout(() => {
      // Mock: Always find a Maruti Swift for demo purposes
      const vehicle = vehicles.find(v => v.model === 'Swift') || vehicles[0];
      
      setVMake(vehicle.make);
      setVModel(vehicle.model);
      setVYear('2022');
      setVVariant(vehicle.variants[0]);
      
      // Filter parts
      const results = partsCatalog.filter(p => 
        p.compatibility.includes(vehicle.id) || p.compatibility.includes('Universal')
      );
      setSearchResults(results);
      
      // Switch to vehicle tab to show results
      setActiveTab('vehicle');
      setOrderSuccess(`Vehicle Identified: ${vehicle.make} ${vehicle.model} (${plateNumber.toUpperCase()})`);
      setIsProcessing(false);
      setTimeout(() => setOrderSuccess(''), 4000);
    }, 1500);
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

  const resetPartSearch = () => {
    setStep('cat');
    setSelectedCat('');
    setSelectedPartName('');
    setSearchResults([]);
  };

  const handleDarkstoreOrder = async (part: Part) => {
    setOrderingPartId(part.id);
    try {
      const orderId = await placeDarkstoreOrder(
        [{ part, quantity: 1 }], 
        'store', 
        'AutoParts Hub, CP (My Store)'
      );
      setOrderSuccess(`Darkstore order ${orderId} placed! Tracking in Darkstore tab.`);
      setTimeout(() => setOrderSuccess(''), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setOrderingPartId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">Part Locator</h1>
      </div>

      {orderSuccess && (
        <div className="bg-green-500/20 text-green-300 p-4 rounded-lg flex items-center shadow-sm border border-green-500/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check size={20} className="mr-2" /> {orderSuccess}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`flex-1 min-w-[100px] py-4 text-center font-medium transition-colors text-sm md:text-base whitespace-nowrap px-2 ${activeTab === 'vehicle' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-textSecondary hover:bg-white/5'}`}
          >
            Vehicle Search
          </button>
          <button
            onClick={() => setActiveTab('part')}
            className={`flex-1 min-w-[100px] py-4 text-center font-medium transition-colors text-sm md:text-base whitespace-nowrap px-2 ${activeTab === 'part' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-textSecondary hover:bg-white/5'}`}
          >
            Part Search
          </button>
          <button
            onClick={() => setActiveTab('plate')}
            className={`flex-1 min-w-[100px] py-4 text-center font-medium transition-colors text-sm md:text-base whitespace-nowrap px-2 ${activeTab === 'plate' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-textSecondary hover:bg-white/5'}`}
          >
            Number Plate
          </button>
        </div>

        <div className="p-4 md:p-6">
          {/* VEHICLE FIRST TAB */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Make */}
                <div>
                  <label className="block text-xs font-medium text-textSecondary mb-1">Make</label>
                  <select 
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
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
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
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
                <div className="grid grid-cols-2 gap-4 md:block">
                  <div className="md:w-full">
                    <label className="block text-xs font-medium text-textSecondary mb-1">Year</label>
                    <select 
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                        value={vYear}
                        onChange={e => setVYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {Array.from({length: 10}, (_, i) => 2024 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                  </div>
                  
                   {/* Variant - inside grid for mobile */}
                   <div className="md:hidden">
                    <label className="block text-xs font-medium text-textSecondary mb-1">Variant</label>
                    <select 
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                        value={vVariant}
                        onChange={e => setVVariant(e.target.value)}
                        disabled={!vModel}
                    >
                        <option value="">Select</option>
                        {vMake && vModel && vehicles.find(v => v.make === vMake && v.model === vModel)?.variants.map(v => (
                        <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                   </div>
                </div>

                {/* Variant Desktop */}
                <div className="hidden md:block">
                  <label className="block text-xs font-medium text-textSecondary mb-1">Variant</label>
                  <select 
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
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
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none uppercase bg-background"
                    maxLength={17}
                    value={vVin}
                    onChange={e => setVVin(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleVehicleSearch}
                disabled={!vModel || isProcessing}
                className="w-full md:w-auto px-8 bg-primary text-white p-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                {isProcessing ? 'Checking Compatibility...' : <><Search size={20} className="mr-2" /> Find Compatible Parts</>}
              </button>

              {searchResults.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {searchResults.map(part => {
                    const status = getStockStatus(part);
                    const StatusIcon = status.icon;
                    return (
                      <div key={part.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-surface flex flex-col h-full">
                        <div className="flex gap-4 mb-3">
                           <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center text-textSecondary border border-border">
                             <Box size={24} />
                           </div>
                           <div>
                             <h3 className="font-bold text-textPrimary leading-tight">{part.name}</h3>
                             <p className="text-xs text-textSecondary mt-1">Ref: {part.sku}</p>
                             <span className="text-xs text-textSecondary bg-background px-2 py-0.5 rounded mt-1 inline-block border border-border">{part.category}</span>
                           </div>
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-dashed border-border flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-primary">₹{part.price}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${status.color}`}>
                                    {StatusIcon && <StatusIcon size={10} />} {status.label}
                                </span>
                            </div>

                            {status.inStock ? (
                                <button 
                                    onClick={() => setSelectedItem({ part, status })}
                                    className="w-full py-2 bg-primary/10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm"
                                >
                                    <MapPin size={16} /> 
                                    Shelf {getStorageLocation(part.sku)}
                                </button>
                            ) : status.label === 'Warehouse' ? (
                                <button 
                                    onClick={() => handleDarkstoreOrder(part)}
                                    disabled={orderingPartId === part.id}
                                    className="w-full py-2 bg-orange-500/10 border border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm group"
                                >
                                    {orderingPartId === part.id ? (
                                      <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                      <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" /> 
                                    )}
                                    Order from Darkstore
                                </button>
                            ) : (
                                <button 
                                    disabled
                                    className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium border border-border"
                                >
                                    Not Available
                                </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* NUMBER PLATE TAB */}
          {activeTab === 'plate' && (
            <div className="max-w-xl mx-auto py-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CarFront size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-textPrimary">Search by Registration</h3>
                <p className="text-textSecondary text-sm mt-2">Enter the vehicle number to automatically find compatible parts.</p>
              </div>

              <div className="space-y-4">
                 <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 border-r border-gray-300 pr-2 mr-2">
                     <span className="text-xs font-bold text-blue-800">IND</span>
                   </div>
                   <input 
                      type="text"
                      placeholder="MH 02 AB 1234"
                      className="w-full pl-16 p-4 text-lg font-mono uppercase border-2 border-border rounded-xl focus:border-primary focus:ring-0 outline-none bg-background tracking-wider"
                      value={plateNumber}
                      onChange={e => setPlateNumber(e.target.value)}
                      maxLength={10}
                   />
                 </div>

                 <button
                    onClick={handlePlateSearch}
                    disabled={plateNumber.length < 4 || isProcessing}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center text-lg shadow-lg active:scale-95"
                 >
                    {isProcessing ? 'Identifying Vehicle...' : 'Identify Vehicle'}
                 </button>
              </div>
            </div>
          )}

          {/* PART FIRST TAB */}
          {activeTab === 'part' && (
            <div className="space-y-6">
              {step === 'cat' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                   {partCategories.map(cat => {
                    // @ts-ignore
                    const IconComponent = Icons[cat.icon] || Icons.Box;
                    return (
                      <button 
                        key={cat.id} 
                        onClick={() => { setSelectedCat(cat.name); setStep('form'); }}
                        className="flex flex-col items-center group w-full bg-surface p-3 rounded-xl border border-border hover:border-primary/50 transition-all active:scale-95"
                      >
                        <div className="w-12 h-12 bg-background rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                          <IconComponent size={20} className="text-primary" />
                        </div>
                        <span className="text-[10px] md:text-xs text-center text-textSecondary font-bold group-hover:text-primary transition-colors leading-tight">{cat.name}</span>
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

                   <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Wrench className="text-primary" />
                        <h3 className="font-bold text-lg text-textPrimary">Smart Compatibility Check</h3>
                      </div>
                      <p className="text-sm text-textSecondary mb-6">
                        To ensure the {selectedCat} fits, please provide vehicle details below.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select 
                          className="w-full p-3 border border-border rounded-lg bg-surface"
                          value={pMake}
                          onChange={e => { setPMake(e.target.value); setPModel(''); }}
                        >
                          <option value="">Select Make</option>
                          {Array.from(new Set(vehicles.map(v => v.make))).map(make => (
                            <option key={make} value={make}>{make}</option>
                          ))}
                        </select>
                        
                        <select 
                          className="w-full p-3 border border-border rounded-lg bg-surface"
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
                          className="w-full p-3 border border-border rounded-lg bg-surface"
                          value={pYear}
                          onChange={e => setPYear(e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {Array.from({length: 10}, (_, i) => 2024 - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <input 
                           type="text"
                           placeholder="VIN (Optional for simple parts)"
                           className="w-full p-3 border border-border rounded-lg uppercase bg-surface"
                           value={pVin}
                           onChange={e => setPVin(e.target.value)}
                        />
                      </div>
                      
                      <button
                        onClick={handlePartFirstSearch}
                        disabled={!pModel}
                        className="mt-6 w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 shadow-md active:scale-95 transition-all"
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
                     <span className="text-sm font-bold bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
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
                        <div key={part.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-surface flex flex-col h-full">
                          <div className="flex gap-4 mb-3">
                            <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center text-textSecondary border border-border">
                              <Box size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-textPrimary leading-tight">{part.name}</h3>
                              <p className="text-xs text-textSecondary mt-1">Ref: {part.sku}</p>
                              <span className="text-xs text-textSecondary bg-background px-2 py-0.5 rounded mt-1 inline-block border border-border">{part.category}</span>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-3 border-t border-dashed border-border flex flex-col gap-2">
                             <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-primary">₹{part.price}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${status.color}`}>
                                    {StatusIcon && <StatusIcon size={10} />} {status.label}
                                </span>
                             </div>

                             {status.inStock ? (
                                <button 
                                    onClick={() => setSelectedItem({ part, status })}
                                    className="w-full py-2 bg-primary/10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm"
                                >
                                    <MapPin size={16} /> 
                                    Shelf {getStorageLocation(part.sku)}
                                </button>
                             ) : status.label === 'Warehouse' ? (
                                <button 
                                    onClick={() => handleDarkstoreOrder(part)}
                                    disabled={orderingPartId === part.id}
                                    className="w-full py-2 bg-orange-500/10 border border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm group"
                                >
                                    {orderingPartId === part.id ? (
                                      <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                      <ShoppingBag size={16} className="group-hover:scale-110 transition-transform" /> 
                                    )}
                                    Order from Darkstore
                                </button>
                             ) : (
                                <button 
                                    disabled
                                    className="w-full py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium border border-border"
                                >
                                    Not Available
                                </button>
                             )}
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

       {/* Product Details Modal */}
       {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-300 border border-border">
                  <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-surface z-10">
                      <div>
                          <h2 className="text-lg font-bold text-textPrimary">Product Details</h2>
                          <p className="text-xs text-textSecondary">Part Locator</p>
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
                              <h3 className="text-xl font-bold text-textPrimary leading-tight">{selectedItem.part.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">{selectedItem.part.category}</span>
                              </div>
                              <div className="mt-2 text-2xl font-bold text-textPrimary">₹{selectedItem.part.price}</div>
                          </div>
                      </div>

                      {/* Store Location & SKU (Prominent) */}
                      <div className="grid grid-cols-2 gap-4">
                         {/* Location */}
                         <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 col-span-2 flex items-center justify-between">
                              <div>
                                 <div className="text-xs text-textSecondary mb-1 flex items-center gap-1 font-bold uppercase"><MapPin size={14} className="text-primary"/> Store Location</div>
                                 <div className="text-2xl font-bold text-textPrimary">
                                     {getStorageLocation(selectedItem.part.sku)}
                                 </div>
                              </div>
                              <div className="text-right">
                                  <div className="text-xs text-textSecondary mb-1 font-bold uppercase">Stock Level</div>
                                  <div className="text-xl font-bold text-green-600">
                                      {selectedItem.status.quantity} Units
                                  </div>
                              </div>
                         </div>
                         
                         {/* Part Number / SKU */}
                         <div className="bg-background p-3 rounded-xl border border-border col-span-2">
                             <div className="text-xs text-textSecondary mb-1 flex items-center gap-1 font-bold uppercase"><Info size={12}/> Part Number (SKU)</div>
                             <div className="text-lg font-mono font-bold text-textPrimary tracking-wide">
                                 {selectedItem.part.sku}
                             </div>
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