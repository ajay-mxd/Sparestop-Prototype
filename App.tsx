import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';

// Wholesaler
import { WholesalerDashboard } from './pages/wholesaler/WholesalerDashboard';
import { WholesalerInventory } from './pages/wholesaler/WholesalerInventory';
import { RetailerNetwork } from './pages/wholesaler/RetailerNetwork';
import { WholesalerSales } from './pages/wholesaler/WholesalerSales';
import { WholesalerAnalytics } from './pages/wholesaler/WholesalerAnalytics';

// Retailer
import { RetailerDashboard } from './pages/retailer/RetailerDashboard';
import { NewSale } from './pages/retailer/NewSale';
import { RetailerInventory } from './pages/retailer/RetailerInventory';
import { WarehouseOrder } from './pages/retailer/WarehouseOrder';
import { RetailerPayments } from './pages/retailer/RetailerPayments';

// Garage
import { GarageHome } from './pages/garage/GarageHome';
import { StoreLocator } from './pages/garage/StoreLocator';
import { PartSearch } from './pages/garage/PartSearch';
import { PartScanner } from './pages/garage/PartScanner';
import { GarageCart } from './pages/garage/GarageCart';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Wholesaler Routes */}
            <Route path="/wholesaler" element={<WholesalerDashboard />} />
            <Route path="/wholesaler/inventory" element={<WholesalerInventory />} />
            <Route path="/wholesaler/retailers" element={<RetailerNetwork />} />
            <Route path="/wholesaler/sales" element={<WholesalerSales />} />
            <Route path="/wholesaler/analytics" element={<WholesalerAnalytics />} />

            {/* Retailer Routes */}
            <Route path="/retailer" element={<RetailerDashboard />} />
            <Route path="/retailer/new-sale" element={<NewSale />} />
            <Route path="/retailer/inventory" element={<RetailerInventory />} />
            <Route path="/retailer/order" element={<WarehouseOrder />} />
            <Route path="/retailer/payments" element={<RetailerPayments />} />

            {/* Garage Routes */}
            <Route path="/garage" element={<GarageHome />} />
            <Route path="/garage/search" element={<PartSearch />} />
            <Route path="/garage/stores" element={<StoreLocator />} />
            <Route path="/garage/scanner" element={<PartScanner />} />
            <Route path="/garage/cart" element={<GarageCart />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;