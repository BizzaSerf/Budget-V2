
import React from 'react';
import { Transaction, User } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-slate-700">No Transactions Logged</h3>
        <p className="text-slate-500 mt-1">Add your first expense to get started!</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 px-2">Recent Transactions</h3>
      <ul className="divide-y divide-slate-100">
        {sortedTransactions.map(t => (
          <li key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">{t.description}</p>
              <p className="text-sm text-slate-500">{t.category} &middot; {t.date.toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900 text-lg">${t.amount.toFixed(2)}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                t.paidBy === User.Wife ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {t.paidBy}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
