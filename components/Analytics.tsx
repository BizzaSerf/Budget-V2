import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, Category } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const monthlyData = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    const filteredTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === month && tDate.getFullYear() === year;
    });

    const categoryTotals = filteredTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<Category, number>);

    const chartData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, amount: Number(value) }))
      .sort((a, b) => b.amount - a.amount);
      
    const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    return { chartData, totalSpent };
  }, [transactions, selectedDate]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-800">Monthly Analytics</h2>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <button onClick={handlePrevMonth} className="text-slate-500 hover:text-indigo-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-700 w-36 text-center">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth} className="text-slate-500 hover:text-indigo-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Total Spent This Month</h3>
        <p className="text-4xl font-bold text-indigo-600">${monthlyData.totalSpent.toFixed(2)}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Spending by Category</h3>
        {monthlyData.chartData.length > 0 ? (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-25} textAnchor="end" height={70} />
                <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} cursor={{ fill: 'rgba(238, 242, 255, 0.6)' }} />
                <Bar dataKey="amount" name="Spent" fill="#4f46e5" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p className="font-medium">No spending data for this month.</p>
            <p className="text-sm">Try adding a transaction or navigating to another month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
