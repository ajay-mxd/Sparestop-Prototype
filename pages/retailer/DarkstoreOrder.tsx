import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Part, DarkstoreOrder as DarkstoreOrderType } from '../../types';
import { vehicles } from '../../data/vehicles';
import { Search, ShoppingBag, Plus, Minus, MapPin, Bike, Clock, CheckCircle, Navigation, ArrowRight, ChevronLeft, Filter, CarFront, Calendar, Layers, Phone, Factory, Package } from 'lucide-react';

export const DarkstoreOrder: React.FC = () => {
  const { partsCatalog, placeDarkstoreOrder, darkstoreOrders } = useApp();
  const [activeTab, setActiveTab] = useState<'new' | 'track'>('new');
  
  // New Order State
  const [searchTerm, setSearchTerm] = useState('');
  const [vMake, setVMake] = useState('');
  const [vModel, setVModel] = useState('');
  const [vYear, setVYear] = useState('');
  const [vVariant, setVVariant] = useState('');
  
  const [orderCart, setOrderCart] = useState<{ part: Part; quantity: number }[]>([]);
  const [deliveryType, setDeliveryType] = useState<'store' | 'garage'>('store');
  const [customAddress, setCustomAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedId, setOrderPlacedId] = useState('');

  // Tracking State
  const [selectedOrder, setSelectedOrder] = useState<DarkstoreOrderType | null>(null);

  // Filter Parts Logic
  const filteredParts = partsCatalog.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          part.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesVehicle = true;
    if (vModel) {
      const vehicle = vehicles.find(v => v.make === vMake && v.model === vModel);
      if (vehicle) {
        matchesVehicle = part.compatibility.includes(vehicle.id) || part.compatibility.includes('Universal');
      }
    }

    return matchesSearch && matchesVehicle;
  });

  const addToOrder = (part: Part) => {
    setOrderCart(prev => {
      const existing = prev.find(item => item.part.id === part.id);
      if (existing) {
        return prev.map(item => item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { part, quantity: 1 }];
    });
  };

  const updateQuantity = (partId: string, delta: number) => {
    setOrderCart(prev => prev.map(item => {
      if (item.part.id === partId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    const address = deliveryType === 'store' ? 'My Retail Store (Connaught Place)' : customAddress;
    const id = await placeDarkstoreOrder(orderCart, deliveryType, address);
    setOrderPlacedId(id);
    setOrderCart([]);
    setIsSubmitting(false);
    setTimeout(() => {
        setOrderPlacedId('');
        setActiveTab('track');
        // Auto-select the new order for tracking
        const newOrder = darkstoreOrders.find(o => o.id === id); 
        if (newOrder) setSelectedOrder(newOrder); 
    }, 2000);
  };

  const totalEstimate = orderCart.reduce((acc, item) => acc + (item.part.price * item.quantity), 0);

  // Helper to handle back button in mobile tracking view
  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="pb-24 space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-1 shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
             Darkstore Express
           </h1>
           <p className="text-xs text-textSecondary">Rapid delivery from central warehouse</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface rounded-xl border border-border w-full md:w-fit mb-2 shrink-0 shadow-sm">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:bg-background'}`}
        >
          New Order
        </button>
        <button 
          onClick={() => setActiveTab('track')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'track' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:bg-background'}`}
        >
          Track ({darkstoreOrders.length})
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Catalog Section */}
           <div className="flex-1 space-y-4">
              <div className="bg-surface p-4 rounded-xl border border-border space-y-3 shadow-sm">
                {/* Text Search */}
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search parts by name or SKU..."
                     className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>

                {/* Vehicle Filter Grid - Optimized for Mobile */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative col-span-2 sm:col-span-1">
                        <select 
                            className="w-full p-2.5 pl-3 text-sm border border-border rounded-lg bg-background appearance-none focus:ring-2 focus:ring-primary outline-none"
                            value={vMake}
                            onChange={(e) => { setVMake(e.target.value); setVModel(''); setVVariant(''); }}
                        >
                            <option value="">Select Make</option>
                            {Array.from(new Set(vehicles.map(v => v.make))).map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </select>
                        <CarFront size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
                    </div>
                    <div className="relative col-span-2 sm:col-span-1">
                        <select 
                            className="w-full p-2.5 pl-3 text-sm border border-border rounded-lg bg-background appearance-none disabled:opacity-50 focus:ring-2 focus:ring-primary outline-none"
                            value={vModel}
                            onChange={(e) => setVModel(e.target.value)}
                            disabled={!vMake}
                        >
                            <option value="">Select Model</option>
                            {vehicles.filter(v => v.make === vMake).map(v => (
                                <option key={v.model} value={v.model}>{v.model}</option>
                            ))}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select 
                            className="w-full p-2.5 pl-3 text-sm border border-border rounded-lg bg-background appearance-none disabled:opacity-50 focus:ring-2 focus:ring-primary outline-none"
                            value={vYear}
                            onChange={(e) => setVYear(e.target.value)}
                            disabled={!vModel}
                        >
                            <option value="">Year</option>
                            {Array.from({length: 15}, (_, i) => 2024 - i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select 
                            className="w-full p-2.5 pl-3 text-sm border border-border rounded-lg bg-background appearance-none disabled:opacity-50 focus:ring-2 focus:ring-primary outline-none"
                            value={vVariant}
                            onChange={(e) => setVVariant(e.target.value)}
                            disabled={!vModel}
                        >
                            <option value="">Variant</option>
                            {vMake && vModel && vehicles.find(v => v.make === vMake && v.model === vModel)?.variants.map(v => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                        <Layers size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
                    </div>
                </div>
                
                {(vModel || vYear || vVariant) && (
                    <div className="text-xs text-primary font-medium flex items-center gap-1 bg-primary/5 px-2 py-1.5 rounded w-fit border border-primary/10">
                        <CheckCircle size={10} /> {vMake} {vModel} {vVariant} {vYear}
                    </div>
                )}
              </div>

              {orderPlacedId ? (
                  <div className="bg-green-500/20 text-green-500 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold">Order Confirmed!</h3>
                    <p className="text-sm opacity-80 mt-1">Order #{orderPlacedId} has been sent to the darkstore.</p>
                    <p className="text-xs mt-4">Redirecting to tracking...</p>
                  </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-24 md:pb-0">
                    {filteredParts.slice(0, 8).map(part => (
                    <div key={part.id} className="bg-surface p-3 rounded-xl border border-border flex justify-between items-center group hover:border-primary/50 transition-colors shadow-sm active:scale-[0.99]">
                        <div>
                        <div className="font-bold text-sm text-textPrimary">{part.name}</div>
                        <div className="text-xs text-textSecondary">{part.sku}</div>
                        <div className="font-bold text-primary mt-1">₹{part.price}</div>
                        </div>
                        <button 
                        onClick={() => addToOrder(part)}
                        className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                        >
                        <Plus size={20} />
                        </button>
                    </div>
                    ))}
                    {filteredParts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-textSecondary">
                            No parts found matching your criteria.
                        </div>
                    )}
                </div>
              )}
           </div>

           {/* Checkout Sidebar / Bottom Sheet on Mobile */}
           {orderCart.length > 0 && !orderPlacedId && (
              <div className="fixed bottom-[65px] left-0 right-0 md:static md:w-96 bg-surface p-4 md:rounded-2xl border-t md:border border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)] md:shadow-lg flex flex-col h-fit z-40 rounded-t-2xl">
                  {/* Pull bar for mobile feel */}
                  <div className="md:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  
                  <div className="flex items-center gap-2 font-bold text-lg border-b border-border pb-3 mb-3 text-textPrimary">
                      <ShoppingBag size={20} /> <span className="md:inline">Order Summary</span>
                      <span className="md:hidden ml-auto text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full">{orderCart.length} Items</span>
                  </div>
                  
                  <div className="hidden md:block space-y-3 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                      {orderCart.map(item => (
                          <div key={item.part.id} className="flex justify-between items-center">
                              <span className="text-sm text-textPrimary flex-1 truncate pr-2">{item.part.name}</span>
                              <div className="flex items-center gap-1.5">
                                  <button onClick={() => updateQuantity(item.part.id, -1)} className="text-textSecondary hover:bg-background p-1 rounded"><Minus size={14}/></button>
                                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.part.id, 1)} className="text-textSecondary hover:bg-background p-1 rounded"><Plus size={14}/></button>
                              </div>
                              <span className="text-sm font-bold text-primary w-14 text-right">₹{item.part.price * item.quantity}</span>
                          </div>
                      ))}
                  </div>

                  <div className="bg-background p-3 rounded-xl border border-border mb-3">
                      <div className="flex gap-2 mb-2">
                          <button 
                            onClick={() => setDeliveryType('store')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${deliveryType === 'store' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-textSecondary'}`}
                          >
                             My Store
                          </button>
                          <button 
                            onClick={() => setDeliveryType('garage')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${deliveryType === 'garage' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-textSecondary'}`}
                          >
                             Garage
                          </button>
                      </div>
                      
                      {deliveryType === 'store' ? (
                          <div className="text-xs text-textSecondary flex items-center justify-center py-1">
                              <MapPin size={12} className="mr-1" /> Connaught Place, Delhi
                          </div>
                      ) : (
                          <input 
                            type="text"
                            placeholder="Enter Garage Address..."
                            className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface outline-none focus:border-primary"
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                          />
                      )}
                  </div>

                  <div className="flex justify-between items-center mb-4 pt-2 border-t border-border">
                      <span className="text-textSecondary text-sm">Total Payable</span>
                      <span className="text-xl font-bold text-textPrimary">₹{totalEstimate}</span>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || (deliveryType === 'garage' && !customAddress)}
                    className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                      {isSubmitting ? (
                          <>Placing...</>
                      ) : (
                          <>Confirm Order <ArrowRight size={18}/></>
                      )}
                  </button>
              </div>
           )}
        </div>
      ) : (
        /* TRACKING TAB - Mobile Optimized */
        <div className="relative h-[calc(100vh-160px)] md:h-[600px] flex flex-col lg:grid lg:grid-cols-3 gap-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            
            {/* Orders List (Hidden on Mobile if order selected) */}
            <div className={`lg:col-span-1 space-y-3 overflow-y-auto p-4 pr-2 pb-24 lg:pb-0 ${selectedOrder ? 'hidden lg:block' : 'block'}`}>
                {darkstoreOrders.length === 0 && (
                    <div className="text-center py-10 text-textSecondary">No active orders</div>
                )}
                {darkstoreOrders.map(order => (
                    <div 
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${selectedOrder?.id === order.id ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-surface border-border hover:border-primary/50'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-mono text-textSecondary">{order.id}</span>
                                <h3 className="font-bold text-textPrimary">{order.items.length} Items • ₹{order.total}</h3>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                order.status === 'out-for-delivery' ? 'bg-orange-500/10 text-orange-500' :
                                'bg-blue-500/10 text-blue-500'
                            }`}>
                                {order.status.replace(/-/g, ' ')}
                            </span>
                        </div>
                        <div className="flex items-center text-xs text-textSecondary gap-2 mt-2">
                             <Clock size={12} /> {order.eta} ETA
                             <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                             <MapPin size={12} /> {order.deliveryType === 'store' ? 'Store' : 'Garage'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Tracking Map View (Full screen on mobile if selected) */}
            <div className={`lg:col-span-2 bg-surface flex flex-col absolute inset-0 lg:static z-20 ${!selectedOrder ? 'translate-x-full lg:translate-x-0 lg:opacity-50 lg:pointer-events-none' : 'translate-x-0'} transition-transform duration-300 lg:transition-none`}>
                {selectedOrder ? (
                    <>
                        {/* Mobile Header for Map */}
                        <div className="lg:hidden absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={handleBackToList} className="w-10 h-10 bg-surface/90 backdrop-blur rounded-full border border-border flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                                    <ChevronLeft size={20} className="text-textPrimary" />
                                </button>
                                <div className="bg-surface/90 backdrop-blur px-4 py-2 rounded-full border border-border shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-textPrimary text-sm">Order {selectedOrder.id}</h3>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${
                                                selectedOrder.status === 'delivered' ? 'bg-green-500' : 
                                                selectedOrder.status === 'out-for-delivery' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`}></span>
                                            <p className="text-xs text-textSecondary capitalize">{selectedOrder.status.replace(/-/g, ' ')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Map Visual */}
                        <div className="flex-1 bg-gray-100 dark:bg-[#0f1623] relative overflow-hidden group">
                             {/* Map Texture (Dotted Grid) */}
                             <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" 
                                  style={{ backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
                             </div>
                             
                             {/* Dashed Guide Lines */}
                             <div className="absolute top-0 bottom-0 left-[45%] w-px border-l-2 border-dashed border-gray-300 dark:border-gray-700 opacity-60"></div>
                             <div className="absolute left-0 right-0 top-1/3 h-px border-t-2 border-dashed border-gray-300 dark:border-gray-700 opacity-60"></div>
                             <div className="absolute left-0 right-0 bottom-1/3 h-px border-t-2 border-dashed border-gray-300 dark:border-gray-700 opacity-60"></div>

                             {/* Warehouse Marker (Start) */}
                             <div className="absolute top-[20%] left-[15%] flex flex-col items-center z-10">
                                 <div className="p-2.5 bg-gray-800/90 backdrop-blur text-white rounded-xl shadow-lg border-2 border-white/10">
                                     <Factory size={22} />
                                 </div>
                             </div>

                             {/* Destination Marker (End) */}
                             <div className="absolute top-[58%] right-[15%] flex flex-col items-center z-10">
                                 <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] border-[3px] border-white animate-bounce">
                                     <MapPin size={22} fill="currentColor" />
                                 </div>
                             </div>

                             {/* Animated Rider */}
                             <style>{`
                                @keyframes riderPath {
                                    0% { top: 20%; left: 15%; transform: translate(-50%, -50%) rotate(0deg); }
                                    30% { top: 20%; left: 45%; transform: translate(-50%, -50%) rotate(0deg); }
                                    35% { top: 20%; left: 45%; transform: translate(-50%, -50%) rotate(90deg); }
                                    60% { top: 58%; left: 45%; transform: translate(-50%, -50%) rotate(90deg); }
                                    65% { top: 58%; left: 45%; transform: translate(-50%, -50%) rotate(0deg); }
                                    100% { top: 58%; left: 85%; transform: translate(-50%, -50%) rotate(0deg); }
                                }
                             `}</style>
                             <div 
                                className="absolute w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] border-[3px] border-white z-20"
                                style={{ animation: 'riderPath 8s linear infinite' }}
                             >
                                 <Bike size={20} />
                             </div>
                        </div>
                        
                        {/* Order Details Footer Panel */}
                        <div className="bg-surface border-t border-border pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.1)] z-20 mb-[60px] md:mb-0">
                            {/* Rider & ETA Section */}
                            <div className="p-5 border-b border-border flex justify-between items-center">
                                <div className="text-sm text-textSecondary italic flex items-center gap-2">
                                   {selectedOrder.rider ? (
                                      <span className="text-textPrimary font-medium not-italic">{selectedOrder.rider.name} is on the way</span>
                                   ) : (
                                      "Searching for rider..."
                                   )}
                                </div>
                                
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary leading-none tracking-tight">{selectedOrder.eta.replace(' mins', '')} <span className="text-sm font-medium">mins</span></div>
                                    <div className="text-[9px] text-textSecondary uppercase font-black tracking-wider mt-1 opacity-70">Arrival Time</div>
                                </div>
                            </div>

                            {/* Order Items Horizontal Scroll */}
                            <div className="p-4 bg-background/30">
                                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                                    {selectedOrder.items.map(item => (
                                        <div key={item.part.id} className="flex items-center gap-3 bg-surface border border-border/60 p-1.5 pr-4 rounded-xl flex-shrink-0 shadow-sm min-w-[180px]">
                                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                              {item.quantity}
                                            </div>
                                            <span className="text-sm text-textPrimary font-medium truncate">{item.part.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-textSecondary h-full bg-surface">
                        <Navigation size={48} className="mb-4 opacity-20" />
                        <p>Select an order to track live delivery.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};