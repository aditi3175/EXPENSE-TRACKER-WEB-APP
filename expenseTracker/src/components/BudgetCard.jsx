import { useState, useEffect } from "react";

const BudgetCard = ({ expenses, refreshTrigger }) => {
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem("userBudget");
    return savedBudget ? parseFloat(savedBudget) : 1000;
  });
  const [totalSpent, setTotalSpent] = useState(0);
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("userCurrency") || "INR";
  });

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      const spent = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
      );
      setTotalSpent(spent);
    } else {
      setTotalSpent(0);
    }
  }, [expenses, refreshTrigger]);

  const remaining = budget - totalSpent;
  const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = () => {
    if (spentPercentage >= 90) return "text-red-600";
    if (spentPercentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getValueFontSize = (amount) => {
    const amountStr = formatAmount(amount);
    if (amountStr.length > 12) return "text-lg";
    if (amountStr.length > 8) return "text-xl";
    return "text-2xl md:text-3xl";
  };

  const getProgressColor = () => {
    if (spentPercentage >= 90) return "bg-red-500";
    if (spentPercentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (spentPercentage >= 100) return "Over Budget";
    if (spentPercentage >= 90) return "Almost Over";
    if (spentPercentage >= 75) return "Getting Close";
    return "On Track";
  };

  // ✅ FIX: Handle currency change with event dispatch
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("userCurrency", newCurrency);
    window.dispatchEvent(new Event("currencyChange")); // 🔥 trigger custom event
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-black text-green-800">
          💳 Budget Overview
        </h2>
        <div className="text-xs sm:text-sm text-amber-600 font-medium">
          {getStatusText()}
        </div>
      </div>

      <div className="space-y-4">
        {/* Budget Input */}
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-bold text-green-700 mb-1"
          >
            Monthly Budget
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              setBudget(value);
              localStorage.setItem("userBudget", value.toString());
            }}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium"
            placeholder="Enter your monthly budget"
          />
        </div>

        {/* Currency Selector */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-bold text-green-700 mb-1"
          >
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)} // ✅ FIX applied
            className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="MXN">MXN</option>
            <option value="CAD">CAD</option>
            <option value="JPY">JPY</option>
            <option value="BAM">BAM</option>
            <option value="ARS">ARS</option>
            <option value="AZN">AZN</option>
            <option value="CNY">CNY</option>
          </select>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-amber-700 font-medium mb-2">
            <span>Spent: {formatAmount(totalSpent)}</span>
            <span>Budget: {formatAmount(budget)}</span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-amber-600 font-medium mt-2">
            {spentPercentage.toFixed(1)}% of budget used
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-xl p-4 sm:p-6 border-2 border-amber-200 min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
            <div className="text-xs sm:text-sm text-amber-700 font-medium mb-2">
              Total Spent
            </div>
            <div
              className={`${getValueFontSize(
                totalSpent
              )} font-black text-green-800 break-words leading-tight`}
            >
              {formatAmount(totalSpent)}
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-xl p-4 sm:p-6 border-2 border-amber-200 min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
            <div className="text-xs sm:text-sm text-amber-700 font-medium mb-2">
              Remaining
            </div>
            <div
              className={`${getValueFontSize(
                remaining
              )} font-black ${getStatusColor()} break-words leading-tight`}
            >
              {formatAmount(remaining)}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`text-center p-3 sm:p-4 rounded-xl font-bold text-sm sm:text-base ${
            spentPercentage >= 100
              ? "bg-red-100 text-red-800 border-2 border-red-200"
              : spentPercentage >= 90
              ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200"
              : "bg-green-100 text-green-800 border-2 border-green-200"
          }`}
        >
          {spentPercentage >= 100 ? (
            <span>
              ⚠️ You've exceeded your budget by{" "}
              {formatAmount(Math.abs(remaining))}
            </span>
          ) : spentPercentage >= 90 ? (
            <span>⚠️ You're close to your budget limit</span>
          ) : (
            <span>✅ You're doing great with your budget!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
