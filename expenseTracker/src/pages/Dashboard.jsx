import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import NavBar from '../components/NavBar';
import BudgetCard from '../components/BudgetCard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Charts from '../components/Charts';
import { useExpenses } from "../context/ExpensesContext";


const Dashboard = () => {
  const { expenses, loading, refreshExpenses } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingExpense(null);
    refreshExpenses();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 relative overflow-hidden"
      style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="floating-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse"><circle cx="60" cy="60" r="2" fill="%23fbbf24" opacity="0.3"/><circle cx="30" cy="30" r="1.5" fill="%2316a34a" opacity="0.2"/><circle cx="90" cy="90" r="1" fill="%23f59e0b" opacity="0.25"/></pattern><linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2316a34a;stop-opacity:0.15"/><stop offset="50%" style="stop-color:%23fbbf24;stop-opacity:0.08"/><stop offset="100%" style="stop-color:%23f59e0b;stop-opacity:0.12"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="url(%23floating-pattern)"/><g opacity="0.12"><path d="M0 200 Q200 150 400 200 T800 200 Q1000 150 1200 200 L1200 0 L0 0 Z" fill="url(%23wave-gradient)"/><path d="M0 400 Q300 350 600 400 T1200 400 L1200 200 L0 200 Z" fill="url(%23wave-gradient)"/><path d="M0 600 Q250 550 500 600 T1000 600 Q1100 550 1200 600 L1200 400 L0 400 Z" fill="url(%23wave-gradient)"/><circle cx="100" cy="100" r="15" fill="%2316a34a" opacity="0.4" filter="url(%23glow)"/><circle cx="300" cy="150" r="12" fill="%23f59e0b" opacity="0.4" filter="url(%23glow)"/><circle cx="500" cy="120" r="18" fill="%23fbbf24" opacity="0.4" filter="url(%23glow)"/><circle cx="700" cy="180" r="14" fill="%2316a34a" opacity="0.4" filter="url(%23glow)"/><circle cx="900" cy="140" r="16" fill="%23f59e0b" opacity="0.4" filter="url(%23glow)"/><circle cx="1100" cy="160" r="13" fill="%23fbbf24" opacity="0.4" filter="url(%23glow)"/><rect x="50" y="300" width="8" height="40" fill="%2316a34a" opacity="0.6" rx="4"/><rect x="150" y="280" width="8" height="60" fill="%23f59e0b" opacity="0.6" rx="4"/><rect x="250" y="290" width="8" height="50" fill="%23fbbf24" opacity="0.6" rx="4"/><rect x="350" y="270" width="8" height="70" fill="%2316a34a" opacity="0.6" rx="4"/><rect x="450" y="285" width="8" height="55" fill="%23f59e0b" opacity="0.6" rx="4"/><rect x="550" y="275" width="8" height="65" fill="%23fbbf24" opacity="0.6" rx="4"/><rect x="650" y="295" width="8" height="45" fill="%2316a34a" opacity="0.6" rx="4"/><rect x="750" y="285" width="8" height="55" fill="%23f59e0b" opacity="0.6" rx="4"/><rect x="850" y="290" width="8" height="50" fill="%23fbbf24" opacity="0.6" rx="4"/><rect x="950" y="280" width="8" height="60" fill="%2316a34a" opacity="0.6" rx="4"/><rect x="1050" y="295" width="8" height="45" fill="%23f59e0b" opacity="0.6" rx="4"/><rect x="1150" y="285" width="8" height="55" fill="%23fbbf24" opacity="0.6" rx="4"/><text x="80" y="500" font-family="Arial" font-size="32" fill="%2316a34a" transform="rotate(-15 80 500)">💎</text><text x="200" y="450" font-family="Arial" font-size="28" fill="%23f59e0b" transform="rotate(20 200 450)">🚀</text><text x="350" y="520" font-family="Arial" font-size="24" fill="%23fbbf24" transform="rotate(-8 350 520)">⚡</text><text x="500" y="480" font-family="Arial" font-size="30" fill="%2316a34a" transform="rotate(12 500 480)">🎯</text><text x="650" y="510" font-family="Arial" font-size="26" fill="%23f59e0b" transform="rotate(-18 650 510)">💫</text><text x="800" y="460" font-family="Arial" font-size="28" fill="%23fbbf24" transform="rotate(8 800 460)">🌟</text><text x="950" y="500" font-family="Arial" font-size="24" fill="%2316a34a" transform="rotate(-12 950 500)">🎪</text><text x="1100" y="470" font-family="Arial" font-size="30" fill="%23f59e0b" transform="rotate(15 1100 470)">🎨</text></g></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Floating animated elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-amber-400 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-green-300 rounded-full opacity-40 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        <div className="absolute top-80 right-1/3 w-5 h-5 bg-amber-300 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute top-32 left-2/3 w-3 h-3 bg-green-500 rounded-full opacity-45 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4.5s'}}></div>
        <div className="absolute top-72 right-10 w-2 h-2 bg-amber-500 rounded-full opacity-35 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '6s'}}></div>
        
        {/* Floating money symbols */}
        <div className="absolute top-24 left-1/3 text-2xl opacity-20 animate-pulse" style={{animationDelay: '0s'}}>💰</div>
        <div className="absolute top-48 right-1/4 text-xl opacity-25 animate-pulse" style={{animationDelay: '1s'}}>💎</div>
        <div className="absolute top-64 left-1/2 text-lg opacity-30 animate-pulse" style={{animationDelay: '2s'}}>⚡</div>
        <div className="absolute top-96 right-1/2 text-xl opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}>🚀</div>
        <div className="absolute top-36 left-1/5 text-lg opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}>🎯</div>
        <div className="absolute top-88 right-1/5 text-2xl opacity-15 animate-pulse" style={{animationDelay: '2.5s'}}>💫</div>
      </div>
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-800">📊 Dashboard</h1>
            <p className="text-amber-700 font-medium text-sm sm:text-base lg:text-lg mt-1">Manage your expenses and track your spending</p>
          </div>
          <button
            onClick={handleAddExpense}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Budget and Form */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <BudgetCard expenses={expenses} />
            {showForm && (
              <ExpenseForm
                expense={editingExpense}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
              />
            )}
          </div>

          {/* Right Column - Expenses and Charts */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
            <ExpenseList
              onEdit={handleEditExpense} />
            <Charts expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
