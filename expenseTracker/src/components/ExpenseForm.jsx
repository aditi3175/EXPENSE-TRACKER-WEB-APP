import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ExpenseForm = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other',
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Other',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expense.notes || '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (expense) {
        // Update existing expense
        await axiosInstance.put(`/expenses/${expense._id}`, expenseData);
      } else {
        // Create new expense
        await axiosInstance.post('/expenses', expenseData);
      }

      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
      <h2 className="text-xl sm:text-2xl font-black text-green-800 mb-6 sm:mb-8">
        {expense ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6 font-medium text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs sm:text-sm font-bold text-green-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
            placeholder="Enter expense title"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label htmlFor="amount" className="block text-xs sm:text-sm font-bold text-green-700">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs sm:text-sm font-bold text-green-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
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

        <div>
          <label htmlFor="date" className="block text-xs sm:text-sm font-bold text-green-700">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-xs sm:text-sm font-bold text-green-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-amber-200 hover:bg-amber-300 text-green-800 font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Saving...' : expense ? 'Update' : 'Add'} Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
