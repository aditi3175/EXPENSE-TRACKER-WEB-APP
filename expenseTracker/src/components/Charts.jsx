import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const Charts = ({ expenses }) => {
  const chartData = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return { categoryData: [], monthlyData: [], trendData: [] };
    }

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryTotals).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage: (
          (amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) *
          100
        ).toFixed(1),
      })
    );

    const monthlyData = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthExpenses = expenses.filter((exp) => {
        const expenseDate = new Date(exp.date);
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      });
      const totalAmount = monthExpenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
      );
      monthlyData.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        amount: totalAmount,
      });
    }

    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayExpenses = expenses.filter(
        (exp) => new Date(exp.date).toDateString() === date.toDateString()
      );
      const totalAmount = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      trendData.push({
        day: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: totalAmount,
      });
    }

    return { categoryData, monthlyData, trendData };
  }, [expenses]);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const formatCurrency = (value) => {
    const currency = localStorage.getItem("userCurrency") || "INR";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100">
        <h2 className="text-2xl font-black text-green-800 mb-8">
          📈 Expense Analytics
        </h2>
        <div className="text-center py-8 text-amber-600 font-medium">
          No expenses to display. Add some expenses to see analytics.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-green-800 mb-4 sm:mb-6 lg:mb-8">
          📊 Spending by Category
        </h2>
        <div className="h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) =>
                  `${category} (${percentage}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {chartData.categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Spending */}
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-green-800 mb-4 sm:mb-6 lg:mb-8">
          📅 Monthly Spending (Last 6 Months)
        </h2>
        <div className="h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Trend */}
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-green-800 mb-4 sm:mb-6 lg:mb-8">
          📈 Spending Trend (Last 30 Days)
        </h2>
        <div className="h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
