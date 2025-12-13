import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; trend?: string }> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="text-primary" size={24} />
      </div>
      {trend && <span className="text-xs font-medium text-success bg-green-50 px-2 py-1 rounded">{trend}</span>}
    </div>
    <h3 className="text-textSecondary text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
  </div>
);

export const WholesalerDashboard: React.FC = () => {
  const { partsCatalog } = useApp();

  const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const categoryData = [
    { name: 'Engine', value: 45 },
    { name: 'Brake', value: 30 },
    { name: 'Elec', value: 15 },
    { name: 'Other', value: 10 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Wholesaler Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Inventory" value={`${partsCatalog.reduce((acc, p) => acc + p.warehouseStock, 0)} Items`} icon={Package} />
        <StatCard title="Active Retailers" value="6 Partners" icon={Users} trend="+2 this month" />
        <StatCard title="Revenue (M)" value="₹2.45L" icon={DollarSign} trend="+12%" />
        <StatCard title="Parts Sold" value="147 Units" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4">Category Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};