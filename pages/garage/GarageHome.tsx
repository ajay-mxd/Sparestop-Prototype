import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { partCategories } from '../../data/parts';
import { Search, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export const GarageHome: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Find Parts Fast</h1>
        <p className="opacity-90 mb-4">Search by vehicle or part number</p>
        <Link to="/garage/search" className="bg-surface text-textPrimary p-3 rounded-lg flex items-center w-full shadow-sm border border-border">
          <Search size={20} className="text-textSecondary mr-3" />
          <span className="text-textSecondary">Search for "Swift Oil Filter"...</span>
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-textPrimary">Categories</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {partCategories.map(cat => {
            // @ts-ignore
            const IconComponent = Icons[cat.icon] || Icons.Box;
            return (
              <Link to={`/garage/search?cat=${cat.id}`} key={cat.id} className="flex flex-col items-center group">
                <div className="w-14 h-14 bg-surface rounded-xl shadow-sm flex items-center justify-center mb-2 border border-border group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                  <IconComponent size={24} className="text-primary" />
                </div>
                <span className="text-xs text-center text-textSecondary font-medium group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-textPrimary mb-4">Popular Parts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface p-4 rounded-xl border border-border flex gap-4 hover:border-primary/50 transition-colors">
               <div className="w-20 h-20 bg-background rounded-lg flex-shrink-0"></div>
               <div className="flex-1">
                 <h3 className="font-semibold text-textPrimary">Brake Pads Front</h3>
                 <p className="text-xs text-textSecondary mb-2">Maruti Swift, Dzire</p>
                 <div className="flex justify-between items-center">
                   <span className="font-bold text-primary">₹1,200</span>
                   <button className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">View</button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};