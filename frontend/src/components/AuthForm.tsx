import { useState } from 'react';
import { Eye, EyeOff, Mail, User, Lock, LogIn, UserPlus } from 'lucide-react';
import * as api from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  sensayUserId?: string;
}

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await api.login(formData.email || formData.username, formData.password);
      } else {
        if (!formData.email || !formData.username || !formData.password) {
          throw new Error('All fields are required for registration');
        }
        response = await api.register(formData.email, formData.username, formData.password);
      }

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLogin(response.data.user);
        setFormData({ email: '', username: '', password: '' });
      }
    } catch (error: any) {
      setError(error.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', username: '', password: '' });
    setError('');
  };

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    resetForm();
  };

  return (
    <div className="w-full">
      {/* Auth Container with glassmorphism */}
      <div className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 rounded-xl p-6">
        
        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-white/20 dark:bg-gray-700/40 backdrop-blur-sm rounded-xl p-1 border border-white/30 dark:border-gray-600/30">
          <button 
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 ${
              isLogin 
                ? 'bg-white/80 dark:bg-gray-600/80 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-600/20'
            }`}
            onClick={() => switchMode(true)}
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>
          <button 
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 ${
              !isLogin 
                ? 'bg-white/80 dark:bg-gray-600/80 text-gray-900 dark:text-white shadow-lg backdrop-blur-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-600/20'
            }`}
            onClick={() => switchMode(false)}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg mb-4 text-sm animate-shake">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field (Register only) */}
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-white/30 dark:bg-gray-600/30 backdrop-blur-sm border border-white/40 dark:border-gray-500/40 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#71B836]/50 focus:border-[#71B836]/50 transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required={!isLogin}
              />
            </div>
          )}
          
          {/* Username/Email Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder={isLogin ? "Email or Username" : "Username"}
              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#71B836] focus:border-transparent transition-all duration-200"
              value={isLogin ? (formData.email || formData.username) : formData.username}
              onChange={(e) => {
                if (isLogin) {
                  setFormData({...formData, email: e.target.value, username: e.target.value});
                } else {
                  setFormData({...formData, username: e.target.value});
                }
              }}
              required
            />
          </div>
          
          {/* Password Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 bg-white/30 dark:bg-gray-600/30 backdrop-blur-sm border border-white/40 dark:border-gray-500/40 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#71B836]/50 focus:border-[#71B836]/50 transition-all duration-200"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              )}
            </button>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#71B836] hover:bg-[#5A9A2E] text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => switchMode(!isLogin)}
              className="text-[#71B836] hover:text-[#5A9A2E] font-medium hover:underline"
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
