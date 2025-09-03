import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import AuthPage from './pages/AuthPage';

interface User {
  id: string;
  email: string;
  username: string;
  sensayUserId?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Check if user is logged in on app load
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    setLoading(false);

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-gray-600 font-medium">Loading ShoppyS...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/chat" replace /> : <LandingPage />
          } 
        />
        
        {/* Authentication Page Route */}
        <Route 
          path="/auth" 
          element={
            user ? <Navigate to="/chat" replace /> : <AuthPage onLogin={handleLogin} />
          } 
        />
        
        {/* Chat Application Route */}
        <Route 
          path="/chat" 
          element={
            user ? <ChatPage onLogout={handleLogout} /> : <Navigate to="/auth" replace />
          } 
        />
        
        {/* Fallback route - redirect to home */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
        </Routes>
      </div>
    </Router>
  );
}

export default App;