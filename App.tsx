import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';

// Retailer
import { RetailerDashboard } from './pages/retailer/RetailerDashboard';
import { NewSale } from './pages/retailer/NewSale';
import { RetailerInventory } from './pages/retailer/RetailerInventory';
import { DarkstoreOrder } from './pages/retailer/DarkstoreOrder';
import { PartScanner } from './pages/garage/PartScanner';

// Garage
import { GarageHome } from './pages/garage/GarageHome';
import { StoreLocator } from './pages/garage/StoreLocator';
import { PartSearch } from './pages/garage/PartSearch';
import { GarageCart } from './pages/garage/GarageCart';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Retailer Routes */}
            <Route path="/retailer" element={<Navigate to="/retailer/new-sale" replace />} />
            <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
            <Route path="/retailer/new-sale" element={<NewSale />} />
            <Route path="/retailer/inventory" element={<RetailerInventory />} />
            <Route path="/retailer/darkstore" element={<DarkstoreOrder />} />
            <Route path="/retailer/scanner" element={<PartScanner />} />

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