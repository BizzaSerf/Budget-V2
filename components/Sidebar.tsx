import React from 'react';
import { HomeIcon, ChartBarIcon } from './icons';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-slate-200 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col p-4 flex-shrink-0">
      <div className="text-2xl font-bold text-white mb-8 px-2 mt-2">
        CoupleFinance
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
            icon={<HomeIcon className="w-6 h-6" />}
            label="Dashboard"
            isActive={currentPage === 'dashboard'}
            onClick={() => setPage('dashboard')}
        />
        <NavItem
            icon={<ChartBarIcon className="w-6 h-6" />}
            label="Analytics"
            isActive={currentPage === 'analytics'}
            onClick={() => setPage('analytics')}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
