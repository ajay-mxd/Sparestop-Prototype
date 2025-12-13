import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Calendar, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

export const WholesalerSales: React.FC = () => {
  const { warehouseOrders } = useApp();

  // Mock data for the chart
  const data = [
    { name: 'Mon', val: 40 },
    { name: 'Tue', val: 30 },
    { name: 'Wed', val: 65 },
    { name: 'Thu', val: 45 },
    { name: 'Fri', val: 80 },
    { name: 'Sat', val: 55 },
    { name: 'Sun', val: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-textPrimary">Sales Tracking</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium">
            <Calendar size={16} /> Last 7 Days
          </button>
          <button className="p-2 bg-white border border-border rounded-lg">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
        <h3 className="font-bold text-lg mb-4">Revenue Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="val" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border font-bold">Recent Wholesale Orders</div>
        <div className="divide-y divide-border">
          {warehouseOrders.map(order => (
            <div key={order.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
               <div>
                 <div className="font-bold text-textPrimary">{order.id}</div>
                 <div className="text-sm text-textSecondary">{order.date} • {order.items.length} Items</div>
               </div>
               <div className="text-right">
                 <div className="font-bold text-primary">₹{order.total.toLocaleString()}</div>
                 <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                   {order.status}
                 </span>
               </div>
            </div>
          ))}
          {warehouseOrders.length === 0 && (
             <div className="p-8 text-center text-textSecondary">No recent orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};