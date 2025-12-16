import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Menu, X, Home, ShoppingCart, Package, Truck, IndianRupee, LogOut, Search, MapPin, Scan, Sun, Moon
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, setRole, cart, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  if (!role) return <>{children}</>;

  const getNavItems = () => {
    switch (role) {
      case 'retailer':
        return [
          { icon: Home, label: 'Dashboard', path: '/retailer/dashboard' },
          { icon: Package, label: 'Inventory', path: '/retailer/inventory' },
          { icon: ShoppingCart, label: 'New Sale', path: '/retailer/new-sale' },
          { icon: Truck, label: 'Restock', path: '/retailer/order' },
          { icon: IndianRupee, label: 'Payments', path: '/retailer/payments' },
        ];
      case 'garage':
        return [
          { icon: Home, label: 'Browse', path: '/garage' },
          { icon: Search, label: 'Search', path: '/garage/search' },
          { icon: MapPin, label: 'Stores', path: '/garage/stores' },
          { icon: Scan, label: 'Scanner', path: '/garage/scanner' },
          { icon: ShoppingCart, label: 'Cart', path: '/garage/cart', badge: cart.length },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-surface border-b border-border p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="font-bold text-xl text-primary">Sparestop</div>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded capitalize">{role}</span>
        </div>
        
        {/* Theme Toggle for Mobile */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-background text-textSecondary hover:text-primary transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Sidebar / Desktop Menu */}
      <div className={cn(
        "bg-surface border-r border-border md:w-64 fixed md:sticky md:top-0 h-full z-40 transition-transform duration-300 ease-in-out md:translate-x-0 w-64 shadow-xl md:shadow-none flex flex-col",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Sparestop</h1>
            <p className="text-sm text-textSecondary capitalize mt-1">{role} Portal</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-textSecondary hover:bg-background/50"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto bg-secondary text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
           <button 
            onClick={toggleTheme}
            className="flex items-center space-x-3 px-4 py-3 text-textSecondary w-full hover:bg-background/50 rounded-lg transition-colors hidden md:flex"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-error w-full hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Switch Role</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth pb-24 md:pb-8 bg-background">
        {children}
      </main>

      {/* Mobile Bottom Nav (Garage & Retailer) */}
      {(role === 'garage' || role === 'retailer') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around p-2 z-50 pb-safe">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg text-xs",
                  isActive ? "text-primary" : "text-textSecondary"
                )}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge ? (
                    <span className="absolute -top-1 -right-2 bg-secondary text-white text-xs px-1.5 rounded-full min-w-[16px] text-center">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};