import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export const RetailerPayments: React.FC = () => {
  const { invoices, payInvoice } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Invoices & Payments</h1>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-border text-xs uppercase text-textSecondary font-semibold">
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
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                  <FileText size={16} className="text-textSecondary" />
                  {inv.id}
                </td>
                <td className="px-6 py-4 text-sm text-textSecondary">{inv.date}</td>
                <td className="px-6 py-4 text-sm font-mono text-textSecondary">{inv.orderId}</td>
                <td className="px-6 py-4 font-bold">₹{inv.amount.toLocaleString()}</td>
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