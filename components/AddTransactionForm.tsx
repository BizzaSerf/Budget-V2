
import React, { useState, useCallback } from 'react';
import { Transaction, User, Category } from '../types';
import { USERS, CATEGORIES } from '../constants';
import { categorizeTransaction } from '../services/geminiService';
import { PlusIcon, SpinnerIcon, SparklesIcon } from './icons';

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<User>(User.Husband);
  const [category, setCategory] = useState<Category>(Category.Other);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  
  const handleDescriptionBlur = useCallback(async () => {
    if (description.length > 3) {
      setIsCategorizing(true);
      try {
        const suggestedCategory = await categorizeTransaction(description);
        setCategory(suggestedCategory);
      } catch (error) {
        console.error("Failed to get category suggestion:", error);
      } finally {
        setIsCategorizing(false);
      }
    }
  }, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || !numericAmount || numericAmount <= 0) {
      alert("Please enter a valid description and amount.");
      return;
    }
    onAddTransaction({
      description,
      amount: numericAmount,
      paidBy,
      category,
    });
    // Reset form
    setDescription('');
    setAmount('');
    setCategory(Category.Other);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-600 mb-1">
              Description
            </label>
            <div className="relative">
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    onBlur={handleDescriptionBlur}
                    placeholder="e.g., Dinner with friends"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                 {isCategorizing && <SpinnerIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />}
            </div>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="paidBy" className="block text-sm font-medium text-slate-600 mb-1">
                Paid By
                </label>
                <select
                id="paidBy"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value as User)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                {USERS.map(user => (
                    <option key={user} value={user}>{user}</option>
                ))}
                </select>
            </div>
            <div>
                 <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1 flex items-center">
                    Category 
                    <SparklesIcon className="w-4 h-4 ml-1.5 text-indigo-500" />
                </label>
                <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
                </select>
            </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
