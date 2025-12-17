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
          <span className="text-textSecondary text-sm">Search for "Swift Oil Filter"...</span>
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-textPrimary">Categories</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
          {partCategories.map(cat => {
            // @ts-ignore
            const IconComponent = Icons[cat.icon] || Icons.Box;
            return (
              <Link to={`/garage/search?cat=${cat.id}`} key={cat.id} className="flex flex-col items-center group bg-surface p-3 rounded-xl border border-border hover:border-primary/50 transition-all active:scale-95">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-background rounded-full md:rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                  <IconComponent size={20} className="text-primary md:w-6 md:h-6" />
                </div>
                <span className="text-[10px] md:text-xs text-center text-textSecondary font-bold group-hover:text-primary transition-colors leading-tight">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-textPrimary mb-4">Popular Parts</h2>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface p-3 rounded-xl border border-border flex gap-3 hover:border-primary/50 transition-colors shadow-sm">
               <div className="w-16 h-16 bg-background rounded-lg flex-shrink-0 border border-border"></div>
               <div className="flex-1 flex flex-col justify-center">
                 <h3 className="font-semibold text-textPrimary text-sm">Brake Pads Front</h3>
                 <p className="text-xs text-textSecondary mb-2">Maruti Swift, Dzire</p>
                 <div className="flex justify-between items-center">
                   <span className="font-bold text-primary text-sm">₹1,200</span>
                   <button className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">ADD</button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};