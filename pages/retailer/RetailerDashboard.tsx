import React from 'react';
import { useApp } from '../../context/AppContext';
import { IndianRupee, ShoppingCart, AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-border">
    <div className="flex items-center justify-between mb-2 md:mb-4">
      <div className={`p-2 md:p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`${color.replace('bg-', 'text-')} md:w-6 md:h-6`} size={20} />
      </div>
    </div>
    <h3 className="text-textSecondary text-xs md:text-sm font-medium">{title}</h3>
    <p className="text-lg md:text-2xl font-bold text-textPrimary mt-1">{value}</p>
  </div>
);

export const RetailerDashboard: React.FC = () => {
  const { sales, invoices } = useApp();
  
  const pendingPayment = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0);
  const totalSales = sales.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">Retailer Dashboard</h1>
        <Link to="/retailer/new-sale" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          + New Sale
        </Link>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Revenue" value={`₹${totalSales}`} icon={IndianRupee} color="bg-green-500" />
        <StatCard title="Transactions" value={`${sales.length}`} icon={ShoppingCart} color="bg-blue-500" />
        <StatCard title="Due Payments" value={`₹${pendingPayment}`} icon={AlertCircle} color="bg-red-500" />
        <StatCard title="Avg. Sale Value" value={`₹${Math.round(totalSales / (sales.length || 1))}`} icon={TrendingUp} color="bg-orange-500" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden">
          {sales.slice(0, 5).map(sale => (
            <div key={sale.id} className="p-4 border-b border-border last:border-0 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <span className="text-xs text-textSecondary font-mono block mb-1">#{sale.id}</span>
                   <h3 className="font-bold text-sm text-textPrimary">{sale.partName}</h3>
                   <div className="text-xs text-textSecondary">{sale.date} • {sale.customer || 'Walk-in'}</div>
                </div>
                <div className="text-right">
                   <div className="font-bold text-primary">₹{sale.amount}</div>
                   <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1 ${sale.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                     {sale.status === 'paid' ? <CheckCircle size={10} /> : <Clock size={10} />}
                     <span className="capitalize">{sale.status}</span>
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto">
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