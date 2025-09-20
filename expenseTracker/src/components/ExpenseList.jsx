import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const ExpenseList = ({ onEdit, refreshTrigger }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState(
    localStorage.getItem("userCurrency") || "INR"
  );
  const [filter, setFilter] = useState({ category: "", search: "" });

  const categories = [
    "All",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/expenses");
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  // Listen for currency change events
  useEffect(() => {
    const handleCurrencyChange = () => {
      const savedCurrency = localStorage.getItem("userCurrency") || "INR";
      setCurrency(savedCurrency);
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () => {
      window.removeEventListener("currencyChange", handleCurrencyChange);
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axiosInstance.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete expense");
      }
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      filter.category === "" ||
      filter.category === "All" ||
      expense.category === filter.category;
    const matchesSearch =
      expense.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      expense.notes.toLowerCase().includes(filter.search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: "bg-green-100 text-green-800",
      Transport: "bg-blue-100 text-blue-800",
      Shopping: "bg-purple-100 text-purple-800",
      Bills: "bg-red-100 text-red-800",
      Entertainment: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.Other;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-black text-green-800">
          💰 Expenses
        </h2>
        <div className="text-xs sm:text-sm text-amber-600 font-medium">
          {filteredExpenses.length} of {expenses.length} expenses
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6 font-medium text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label
            htmlFor="search"
            className="block text-xs sm:text-sm font-bold text-green-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
            placeholder="Search expenses..."
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-xs sm:text-sm font-bold text-green-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-amber-600 font-medium text-sm sm:text-base">
          {expenses.length === 0
            ? "No expenses yet. Add your first expense!"
            : "No expenses match your filters."}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredExpenses.map((expense) => (
            <div
              key={expense._id}
              className="border-2 border-amber-200 rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-amber-50 to-green-50"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                    <h3 className="font-bold text-green-800 text-base sm:text-lg">
                      {expense.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getCategoryColor(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-amber-700 space-y-1 font-medium">
                    <p>Date: {formatDate(expense.date)}</p>
                    {expense.notes && <p>Notes: {expense.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-2">
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-black text-green-800">
                      {formatAmount(expense.amount)}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 sm:p-2 text-green-600 hover:text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
