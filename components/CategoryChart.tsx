import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction, Category } from '../types';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF6666', '#66CCCC', '#FFCC99', '#99CCFF', '#CC99FF'
];

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    if (transactions.length === 0) {
      return [];
    }

    const categoryTotals = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<Category, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      // FIX: Add type guard to ensure value is a number before calling toFixed.
      value: typeof value === 'number' ? parseFloat(value.toFixed(2)) : 0,
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-80">
          <p className="text-slate-500">No transactions yet.</p>
          <p className="text-sm text-slate-400">Add a transaction to see your spending breakdown.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                if (percent < 0.05) return null;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                        {`${(percent * 100).toFixed(0)}%`}
                    </text>
                );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* FIX: Add type check for value in Tooltip formatter to prevent crash if value is not a number. */}
          <Tooltip formatter={(value: unknown) => (typeof value === 'number' ? `$${value.toFixed(2)}` : String(value))} />
          <Legend iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
