import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isAuthenticated, error, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be 8+ chars with uppercase, lowercase, and number");
      return;
    }

    await register(formData.name, formData.email, formData.password);
    // Navigation will be handled by useEffect when isAuthenticated changes
  };

  return (
        <div 
          className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="budget-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="3" fill="%23fbbf24" opacity="0.3"/><circle cx="80" cy="30" r="2" fill="%2316a34a" opacity="0.2"/><circle cx="50" cy="70" r="2.5" fill="%23f59e0b" opacity="0.25"/><rect x="10" y="10" width="8" height="8" fill="%2316a34a" opacity="0.1" rx="2"/><rect x="70" y="60" width="6" height="6" fill="%23fbbf24" opacity="0.15" rx="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23budget-pattern)"/><g opacity="0.1"><text x="100" y="150" font-family="Arial" font-size="60" fill="%2316a34a" transform="rotate(-15 100 150)">💰</text><text x="300" y="300" font-family="Arial" font-size="40" fill="%23f59e0b" transform="rotate(10 300 300)">📊</text><text x="500" y="200" font-family="Arial" font-size="50" fill="%23fbbf24" transform="rotate(-5 500 200)">💳</text><text x="800" y="400" font-family="Arial" font-size="45" fill="%2316a34a" transform="rotate(8 800 400)">📈</text><text x="1000" y="150" font-family="Arial" font-size="35" fill="%23f59e0b" transform="rotate(-12 1000 150)">💵</text><text x="200" y="600" font-family="Arial" font-size="55" fill="%23fbbf24" transform="rotate(5 200 600)">📋</text><text x="700" y="650" font-family="Arial" font-size="40" fill="%2316a34a" transform="rotate(-8 700 650)">💼</text></g></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl lg:text-4xl font-black text-green-800">
              Create your account
            </h2>
            <p className="mt-2 text-center text-xs sm:text-sm text-amber-700 font-medium">
              Or{' '}
              <Link
                to="/login"
                className="font-bold text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border-2 border-green-100">
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base">
                    {error}
                  </div>
                )}

            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-green-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-green-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-green-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-green-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 font-medium text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-amber-400 disabled:to-amber-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
