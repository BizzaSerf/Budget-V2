import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Category } from '../types';
import { CATEGORIES } from '../constants';
import { PencilIcon } from './icons';

interface BudgetsProps {
  transactions: Transaction[];
  budgets: Record<Category, number>;
  onUpdateBudgets: (newBudgets: Record<Category, number>) => void;
}

const Budgets: React.FC<BudgetsProps> = ({ transactions, budgets, onUpdateBudgets }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudgets, setTempBudgets] = useState(budgets);

  useEffect(() => {
    setTempBudgets(budgets);
  }, [budgets]);

  const spentPerCategory = useMemo(() => {
    const spent: Record<Category, number> = {} as Record<Category, number>;
    CATEGORIES.forEach(cat => spent[cat] = 0);
    
    for (const t of transactions) {
      spent[t.category] = (spent[t.category] || 0) + t.amount;
    }
    return spent;
  }, [transactions]);

  const handleSave = () => {
    const newBudgets: Record<Category, number> = { ...tempBudgets };
    // Ensure values are numbers
    for (const cat in newBudgets) {
        newBudgets[cat as Category] = Number(newBudgets[cat as Category]) || 0;
    }
    onUpdateBudgets(newBudgets);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setTempBudgets(budgets);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          {new Date().toLocaleString('default', { month: 'long' })} Budgets
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <PencilIcon className="w-4 h-4 mr-1.5" />
            Edit Budgets
          </button>
        )}
      </div>

      <div className="space-y-4">
        {CATEGORIES.map(category => {
          const spent = spentPerCategory[category] || 0;
          const budget = isEditing ? tempBudgets[category] : budgets[category] || 0;
          const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
          const isOverBudget = spent > budget && budget > 0;

          let progressBarColor = 'bg-indigo-500';
          if (isOverBudget) {
            progressBarColor = 'bg-red-500';
          } else if (percentage > 80) {
            progressBarColor = 'bg-yellow-500';
          }

          return (
            <div key={category} className={`p-2 -m-2 rounded-lg transition-colors ${isOverBudget && !isEditing ? 'bg-red-50 ring-1 ring-red-200' : ''}`}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-slate-700">{category}</span>
                {isEditing ? (
                  <div className="flex items-center">
                    <span className="mr-1 text-slate-500">$</span>
                    <input
                      type="number"
                      value={tempBudgets[category] || ''}
                      onChange={e => setTempBudgets(prev => ({ ...prev, [category]: e.target.value }))}
                      className="w-24 px-2 py-1 border border-slate-300 rounded-md shadow-sm text-right"
                      placeholder="0"
                    />
                  </div>
                ) : (
                  <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-slate-600'}`}>
                    ${spent.toFixed(2)} / ${budget.toFixed(2)}
                  </span>
                )}
              </div>
              {!isEditing && (
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className={`${progressBarColor} h-2.5 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {isEditing && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Budgets
          </button>
        </div>
      )}
    </div>
  );
};

export default Budgets;