import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export const RetailerPayments: React.FC = () => {
  const { invoices, payInvoice } = useApp();

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-textPrimary">Invoices & Payments</h1>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {invoices.map(inv => (
          <div key={inv.id} className="bg-surface p-4 rounded-xl shadow-sm border border-border">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                 <div className="p-2 bg-primary/10 rounded-lg">
                   <FileText size={20} className="text-primary" />
                 </div>
                 <div>
                   <div className="font-bold text-sm text-textPrimary">{inv.id}</div>
                   <div className="text-xs text-textSecondary">{inv.date}</div>
                 </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-textPrimary">₹{inv.amount.toLocaleString()}</div>
                {inv.status === 'paid' ? (
                  <span className="text-xs text-success font-medium flex items-center justify-end">
                    <CheckCircle size={12} className="mr-1" /> Paid
                  </span>
                ) : (
                  <span className="text-xs text-warning font-medium flex items-center justify-end">
                    <Clock size={12} className="mr-1" /> Pending
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
               <span className="text-xs text-textSecondary font-mono">Ref: {inv.orderId}</span>
               {inv.status !== 'paid' && (
                  <button 
                    onClick={() => payInvoice(inv.id)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                  >
                    Pay Now
                  </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-border text-xs uppercase text-textSecondary font-semibold">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Order Ref</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-background/50 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-2 text-textPrimary">
                  <FileText size={16} className="text-textSecondary" />
                  {inv.id}
                </td>
                <td className="px-6 py-4 text-sm text-textSecondary">{inv.date}</td>
                <td className="px-6 py-4 text-sm font-mono text-textSecondary">{inv.orderId}</td>
                <td className="px-6 py-4 font-bold text-textPrimary">₹{inv.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {inv.status === 'paid' ? (
                    <span className="flex items-center text-success text-sm font-medium">
                      <CheckCircle size={14} className="mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center text-warning text-sm font-medium">
                      <Clock size={14} className="mr-1" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {inv.status !== 'paid' && (
                    <button 
                      onClick={() => payInvoice(inv.id)}
                      className="bg-primary text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600"
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};