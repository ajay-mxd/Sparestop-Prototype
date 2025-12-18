import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Wrench, ArrowRight, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const BrandLogo: React.FC<{ className?: string }> = ({ className }) => (
  <span className={cn("font-sifonn text-primary", className)}>Sparestop</span>
);

const RoleCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  onClick: () => void;
  color: string;
  buttonText: string;
}> = ({ title, description, icon: Icon, onClick, color, buttonText }) => (
  <button 
    onClick={onClick}
    className="bg-surface p-8 md:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-border hover:border-primary text-left w-full group relative overflow-hidden active:scale-[0.98] duration-300"
  >
    <div className={`absolute top-0 right-0 p-32 opacity-5 rounded-full -mr-12 -mt-12 ${color} transition-transform group-hover:scale-150 duration-700 ease-out`}></div>
    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={28} className="md:w-8 md:h-8" />
    </div>
    <h3 className="text-xl md:text-3xl font-bold text-textPrimary mb-3 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-textSecondary text-sm md:text-lg mb-8 leading-relaxed opacity-90">{description}</p>
    <div className="flex items-center text-primary font-bold group-hover:translate-x-3 transition-transform text-sm md:text-base tracking-wide">
      {buttonText} <ArrowRight size={20} className="ml-2" />
    </div>
  </button>
);

export const Landing: React.FC = () => {
  const { setRole, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'retailer' | 'garage') => {
    setRole(role);
    if (role === 'retailer') {
      navigate('/retailer/new-sale');
    } else {
      navigate(`/${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <nav className="px-6 py-6 md:px-12 flex justify-between items-center max-w-5xl mx-auto w-full pt-safe">
        <div className="flex items-center gap-3">
          <BrandLogo className="text-3xl md:text-4xl" />
        </div>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-3 rounded-full hover:bg-surface text-textSecondary hover:text-primary transition-colors border border-transparent hover:border-border active:scale-90 shadow-sm"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-3xl w-full">
          {/* Slogan section removed as requested */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <RoleCard
              title="For Retailers"
              description="Restock your shop instantly. Access wholesale pricing, manage invoices, and track delivery to your store."
              icon={Users}
              color="bg-orange-500"
              buttonText="Retailer Portal"
              onClick={() => handleRoleSelect('retailer')}
            />
            <RoleCard
              title="For Garages"
              description="Find parts for any car, compare local store availability, and reserve items for quick pickup."
              icon={Wrench}
              color="bg-blue-600"
              buttonText="Mechanic Portal"
              onClick={() => handleRoleSelect('garage')}
            />
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] md:text-xs text-textSecondary opacity-60 font-medium tracking-widest uppercase">
              © 2024 <span className="font-sifonn">Sparestop</span> Pvt Ltd. Prototype v1.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};