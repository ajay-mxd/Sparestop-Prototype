import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Wrench, Lock, ArrowRight } from 'lucide-react';

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
    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-transparent hover:border-blue-200 text-left w-full group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 p-32 opacity-5 rounded-full -mr-10 -mt-10 ${color}`}></div>
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${color} text-white shadow-md`}>
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{title}</h3>
    <p className="text-gray-500 mb-8 leading-relaxed">{description}</p>
    <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
      {buttonText} <ArrowRight size={18} className="ml-2" />
    </div>
  </button>
);

export const Landing: React.FC = () => {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'wholesaler' | 'retailer' | 'garage') => {
    setRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar for Landing */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div>
          <span className="text-2xl font-bold text-slate-900">Sparestop</span>
        </div>
        <button 
          onClick={() => handleRoleSelect('wholesaler')}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors"
        >
          <Lock size={14} /> Admin Login
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
              The Engine of <span className="text-blue-600">Auto Parts.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
              Connecting local retailers and garages with the largest wholesale inventory in the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            <p className="text-xs text-slate-400">
              © 2024 Sparestop Pvt Ltd. Demo Prototype v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};