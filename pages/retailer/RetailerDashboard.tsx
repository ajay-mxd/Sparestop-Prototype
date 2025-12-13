import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, ShoppingCart, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
    </div>
    <h3 className="text-textSecondary text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
  </div>
);

export const RetailerDashboard: React.FC = () => {
  const { sales, invoices } = useApp();
  
  const pendingPayment = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0);
  const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">Retailer Dashboard</h1>
        <Link to="/retailer/new-sale" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          + New Sale
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${totalSales}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Transactions" value={`${sales.length}`} icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Due Payments" value={`₹${pendingPayment}`} icon={AlertCircle} color="bg-red-500" />
        <StatCard title="Avg. Sale Value" value={`₹${Math.round(totalSales / (sales.length || 1))}`} icon={TrendingUp} color="bg-orange-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-textSecondary font-semibold">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Part</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.slice(0, 5).map(sale => (
                <tr key={sale.id}>
                  <td className="px-4 py-3 font-mono text-xs">{sale.id}</td>
                  <td className="px-4 py-3 text-sm">{sale.date}</td>
                  <td className="px-4 py-3 text-sm">{sale.customer}</td>
                  <td className="px-4 py-3 text-sm">{sale.partName}</td>
                  <td className="px-4 py-3 font-medium">₹{sale.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${sale.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};