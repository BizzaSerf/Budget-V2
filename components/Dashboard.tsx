import React from 'react';
import { Transaction, Category } from '../types';
import Summary from './Summary';
import Budgets from './Budgets';
import TransactionList from './TransactionList';

interface DashboardProps {
    transactions: Transaction[];
    currentMonthTransactions: Transaction[];
    budgets: Record<Category, number>;
    onUpdateBudgets: (newBudgets: Record<Category, number>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    transactions,
    currentMonthTransactions,
    budgets,
    onUpdateBudgets
}) => {
    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Dashboard</h2>
                <Summary transactions={transactions} />
            </section>
            <section>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Monthly Budgets</h2>
                <Budgets
                    transactions={currentMonthTransactions}
                    budgets={budgets}
                    onUpdateBudgets={onUpdateBudgets}
                />
            </section>
            <section>
                <TransactionList transactions={transactions} />
            </section>
        </div>
    );
};

export default Dashboard;
