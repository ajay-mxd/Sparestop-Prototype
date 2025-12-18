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

const BrandLogo: React.FC<{ className?: string }> = ({ className }) => (
  <span className={cn("font-sifonn text-primary", className)}>Sparestop</span>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, setRole, cart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

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

  const pageTitle = navItems.find(item => item.path === location.pathname)?.label || 'Sparestop';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300 overflow-x-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border pt-safe shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between h-[56px] px-6">
          <div className="flex-1">
            <button 
              onClick={handleLogout}
              className="flex items-center text-textSecondary active:opacity-50 transition-all hover:text-error py-2"
              aria-label="Switch Role"
            >
              <LogOut size={18} className="mr-1.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Switch</span>
            </button>
          </div>

          <div className="flex-[2] flex justify-center items-center">
             <span className="font-semibold text-lg text-textPrimary truncate animate-in fade-in slide-in-from-bottom-2 duration-300">
               {pageTitle}
             </span>
          </div>

          <div className="flex-1"></div>
        </div>
      </div>

      {/* Mobile Header Spacer */}
      <div className="md:hidden h-[56px] pt-safe flex-shrink-0"></div>

      {/* Sidebar / Desktop Menu */}
      <div className={cn(
        "hidden md:flex bg-surface border-r border-border md:w-72 fixed md:sticky md:top-0 h-full z-40 flex-col"
      )}>
        <div className="p-8 flex flex-col items-start gap-1">
          <BrandLogo className="text-3xl leading-none" />
          <p className="text-[10px] text-textSecondary uppercase tracking-[0.2em] font-black mt-1">{role} Portal</p>
        </div>

        <nav className="px-4 py-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-primary text-white font-semibold shadow-lg shadow-primary/25" 
                    : "text-textSecondary hover:bg-background/80 hover:text-textPrimary"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-transform group-hover:scale-110", isActive && "animate-pulse-once")} />
                <span className="text-sm tracking-wide">{item.label}</span>
                {item.badge ? (
                  <span className={cn(
                    "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-white text-primary" : "bg-secondary text-white"
                  )}>
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-5 py-3.5 text-error/80 w-full hover:bg-error/5 hover:text-error rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-background pb-28 md:pb-0 scroll-smooth">
        <div className="px-6 py-6 md:px-16 md:py-12 max-w-5xl mx-auto w-full transition-all duration-300">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {(role === 'garage' || role === 'retailer') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-2xl border-t border-border z-50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-5 items-stretch h-[68px]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center relative transition-all active:scale-95 active:bg-background/50 group",
                    isActive ? "text-primary" : "text-textSecondary/70 hover:text-textPrimary"
                  )}
                >
                  <div className="relative mb-1.5 p-1 rounded-xl transition-colors group-hover:bg-primary/5">
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={cn("transition-all duration-300", isActive && "-translate-y-1")} />
                    {item.badge ? (
                      <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] px-1.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-surface font-black shadow-sm transform scale-90">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-tight scale-90 transition-opacity duration-300",
                    isActive ? "opacity-100 font-extrabold" : "opacity-60"
                  )}>{item.label}</span>
                  
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-b-full shadow-[0_2px_8px_rgba(59,130,246,0.6)] animate-in fade-in slide-in-from-top-1 duration-300"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};