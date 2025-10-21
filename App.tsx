import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Category } from './types';
import AddTransactionForm from './components/AddTransactionForm';
import { PlusIcon, XMarkIcon, SpinnerIcon } from './components/icons';
import { CATEGORIES } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import { getAppData, saveAppData, AppData } from './services/dbService';


const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Record<Category, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState('dashboard');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getAppData();
            
            // If the database is completely empty, initialize with default budgets
            if (data.transactions.length === 0 && Object.keys(data.budgets).length === 0) {
                const initialBudgets: Record<Category, number> = {} as Record<Category, number>;
                CATEGORIES.forEach(cat => {
                    initialBudgets[cat] = 0;
                });
                initialBudgets[Category.Groceries] = 500;
                initialBudgets[Category.DiningOut] = 200;
                setBudgets(initialBudgets);
            } else {
                setTransactions(data.transactions);
                setBudgets(data.budgets);
            }

        } catch (err) {
            setError('Failed to load financial data. Please try refreshing the page.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, []);

  const saveData = async (data: AppData) => {
    setIsSaving(true);
    try {
        await saveAppData(data);
    } catch (error) {
        console.error("Failed to save data:", error);
        alert("Could not save your changes. Please check your connection and try again.");
        throw error; // Rethrow to allow caller to handle UI rollback
    } finally {
        setIsSaving(false);
    }
  };

  const handleAddTransaction = async (newTransactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...newTransactionData,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    
    // Optimistic UI update
    setTransactions(updatedTransactions);
    setIsModalOpen(false);

    try {
        await saveData({ transactions: updatedTransactions, budgets });
    } catch (error) {
        // Revert on failure
        setTransactions(transactions);
    }
  };

  const handleUpdateBudgets = async (newBudgets: Record<Category, number>) => {
    const oldBudgets = budgets;
    setBudgets(newBudgets); // Optimistic UI update
    try {
        await saveData({ transactions, budgets: newBudgets });
    } catch (error) {
        setBudgets(oldBudgets); // Revert on failure
    }
  };

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
  }, [transactions]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="flex flex-col items-center">
                <SpinnerIcon className="w-12 h-12 text-indigo-600" />
                <p className="mt-4 text-slate-600 font-semibold">Loading your financial data...</p>
            </div>
        </div>
    );
  }

  if (error) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-slate-100">
              <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-sm">
                  <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h2>
                  <p className="mt-2 text-slate-600">{error}</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar currentPage={page} setPage={setPage} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-slate-900">
                  Shared Finance Tracker
                </h1>
                <p className="text-slate-500 mt-1">Track your shared expenses and budgets with ease.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  {isSaving ? (
                      <>
                          <SpinnerIcon className="w-4 h-4" />
                          <span>Saving...</span>
                      </>
                  ) : (
                      <>
                          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Synced</span>
                      </>
                  )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {page === 'dashboard' && (
            <Dashboard
              transactions={transactions}
              currentMonthTransactions={currentMonthTransactions}
              budgets={budgets}
              onUpdateBudgets={handleUpdateBudgets}
            />
          )}
          {page === 'analytics' && (
            <Analytics transactions={transactions} />
          )}
        </main>
      </div>

      {/* Add Transaction Button */}
       <div className="fixed bottom-6 right-6 z-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-110"
            aria-label="Add new transaction"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>


      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            aria-modal="true"
            role="dialog"
        >
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                aria-label="Close"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="p-6 sm:p-8">
                <AddTransactionForm onAddTransaction={handleAddTransaction} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;