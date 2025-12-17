import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, ShoppingCart, Package, Truck, IndianRupee, LogOut, Search, MapPin, Scan, ChevronLeft, Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, setRole, cart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
          { icon: Zap, label: 'Darkstore', path: '/retailer/darkstore' },
          { icon: Scan, label: 'Scanner', path: '/retailer/scanner' },
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

  // Determine if we are on the main dashboard page for the role
  const dashboardPath = role === 'retailer' ? '/retailer/dashboard' : '/garage';
  const isDashboard = location.pathname === dashboardPath;

  const pageTitle = navItems.find(item => item.path === location.pathname)?.label || 'Sparestop';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Mobile Header (Apple Style) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border pt-safe transition-all duration-300">
        <div className="flex items-center justify-between h-[52px] px-4">
          {/* Left: Switch Role Button (Replaces Home/Back) */}
          <div className="flex-1 flex items-start">
            <button 
              onClick={handleLogout}
              className="flex items-center text-textSecondary -ml-2 px-2 py-1 active:opacity-50 transition-opacity group hover:text-error"
              aria-label="Switch Role"
            >
              <LogOut size={20} className="mr-1 group-active:scale-95 transition-transform" />
              <span className="text-sm font-medium">Switch</span>
            </button>
          </div>

          {/* Center: Title/Logo */}
          <div className="flex-[2] flex justify-center items-center">
             <span className="font-semibold text-lg text-textPrimary truncate">
               {isDashboard ? 'Sparestop' : pageTitle}
             </span>
          </div>

          {/* Right: Empty (Theme Toggle Removed) */}
          <div className="flex-1 flex justify-end">
            {/* Space reserved for balance */}
          </div>
        </div>
      </div>

      {/* Spacer for Fixed Header on Mobile */}
      <div className="md:hidden h-[52px] pt-safe w-full flex-shrink-0"></div>

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
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-error w-full hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Switch Role</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-[calc(100vh-52px)] md:h-screen scroll-smooth pb-24 md:pb-8 bg-background">
        {children}
      </main>

      {/* Mobile Bottom Nav (Garage & Retailer) */}
      {(role === 'garage' || role === 'retailer') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-border flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg text-xs w-full active:scale-95 transition-transform",
                  isActive ? "text-primary" : "text-textSecondary"
                )}
              >
                <div className="relative mb-1">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge ? (
                    <span className="absolute -top-1 -right-2 bg-secondary text-white text-xs px-1 rounded-full min-w-[16px] h-[16px] flex items-center justify-center border border-surface">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};