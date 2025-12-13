import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Users, Truck, Wrench } from 'lucide-react';

const RoleCard: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  onClick: () => void;
  color: string;
}> = ({ title, description, icon: Icon, onClick, color }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-transparent hover:border-primary text-left w-full group"
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-xl font-bold text-textPrimary mb-2 group-hover:text-primary">{title}</h3>
    <p className="text-textSecondary text-sm">{description}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">SpareStop</h1>
          <p className="text-textSecondary text-lg md:text-xl">Wholesale Automotive Spare Parts Platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard
            title="Wholesaler"
            description="Manage inventory, track sales, and oversee retailer network performance."
            icon={Truck}
            color="bg-blue-600"
            onClick={() => handleRoleSelect('wholesaler')}
          />
          <RoleCard
            title="Retailer"
            description="Stock parts, process sales, and order from central warehouse."
            icon={Users}
            color="bg-orange-500"
            onClick={() => handleRoleSelect('retailer')}
          />
          <RoleCard
            title="Garage"
            description="Browse parts, check local availability, and order for quick delivery."
            icon={Wrench}
            color="bg-green-600"
            onClick={() => handleRoleSelect('garage')}
          />
        </div>

        <div className="mt-12 text-center text-sm text-textSecondary">
          <p>Demo Prototype - No login required</p>
        </div>
      </div>
    </div>
  );
};