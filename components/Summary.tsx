import React, { useMemo } from 'react';
import { Transaction, User } from '../types';

interface SummaryProps {
  transactions: Transaction[];
}

const Summary: React.FC<SummaryProps> = ({ transactions }) => {
  const { totalSpent, wifeSpent, husbandSpent } = useMemo(() => {
    const wifeTotal = transactions
      .filter(t => t.paidBy === User.Wife)
      .reduce((sum, t) => sum + t.amount, 0);

    const husbandTotal = transactions
      .filter(t => t.paidBy === User.Husband)
      .reduce((sum, t) => sum + t.amount, 0);

    const total = wifeTotal + husbandTotal;

    return {
      totalSpent: total,
      wifeSpent: wifeTotal,
      husbandSpent: husbandTotal,
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard title="Total Spent" value={totalSpent} color="text-indigo-600" />
      <SummaryCard title={`${User.Husband}'s Spending`} value={husbandSpent} color="text-blue-600" />
      <SummaryCard title={`${User.Wife}'s Spending`} value={wifeSpent} color="text-teal-600" />
    </div>
  );
};

interface SummaryCardProps {
    title: string;
    value: number;
    color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-slate-500 font-medium">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${color}`}>${value.toFixed(2)}</p>
    </div>
)

export default Summary;