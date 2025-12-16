import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Scan, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PartScanner: React.FC = () => {
  const { partsCatalog, addToCart } = useApp();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedPart, setScannedPart] = useState<any>(null);
  
  // Simulate scanning process
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isScanning) {
      timeout = setTimeout(() => {
        // Randomly pick a part to "find"
        const randomPart = partsCatalog[Math.floor(Math.random() * partsCatalog.length)];
        setScannedPart(randomPart);
        setIsScanning(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isScanning, partsCatalog]);

  const handleRescan = () => {
    setScannedPart(null);
    setIsScanning(true);
  };

  return (
    <div className="h-full flex flex-col bg-black text-white relative rounded-xl overflow-hidden min-h-[500px]">
      {isScanning ? (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"></div>
          
          {/* Viewfinder */}
          <div className="w-64 h-64 border-2 border-primary rounded-2xl relative z-10 flex items-center justify-center bg-white/5">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.8)]" style={{ animation: 'scan 2s infinite linear' }}></div>
          </div>
          
          <p className="mt-8 text-lg font-medium animate-pulse">Align code within frame</p>
          <p className="text-sm text-gray-400 mt-2">Scanning for Part ID...</p>
          
          <style>{`
            @keyframes scan {
              0% { top: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
          <div className="bg-surface text-textPrimary p-6 rounded-2xl w-full max-w-sm border border-border shadow-lg">
            <div className="flex justify-center mb-4">
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                 <Scan size={32} className="text-green-500" />
               </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-1">Part Identified!</h2>
            <p className="text-center text-textSecondary text-sm mb-6">Barcode: {scannedPart.sku}</p>
            
            <div className="bg-background p-4 rounded-xl mb-6 border border-border">
              <h3 className="font-bold text-lg">{scannedPart.name}</h3>
              <p className="text-sm text-textSecondary mb-2">{scannedPart.category}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-primary text-xl">₹{scannedPart.price}</span>
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">In Stock</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => { addToCart(scannedPart); navigate('/garage/cart'); }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleRescan}
                className="w-full border border-border py-3 rounded-xl font-medium hover:bg-background transition-colors text-textPrimary"
              >
                Scan Another
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay Controls */}
      <button 
        onClick={() => navigate('/garage')}
        className="absolute top-4 right-4 bg-black/40 p-2 rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors"
      >
        <X size={24} className="text-white" />
      </button>
    </div>
  );
};