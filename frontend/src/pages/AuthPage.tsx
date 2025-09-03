import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthForm from '../components/AuthForm';

interface User {
  id: string;
  email: string;
  username: string;
  sensayUserId?: string;
}

interface AuthPageProps {
  onLogin?: (user: User) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    // Store user data
    if (onLogin) {
      onLogin(user);
    }
    // Redirect to chat page
    navigate('/chat');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background - Same as Chat */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient layer */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(45deg, 
              rgba(102, 215, 151, 0.3) 0%, 
              rgba(102, 215, 151, 0.2) 25%, 
              rgba(102, 215, 151, 0.2) 50%, 
              rgba(102, 215, 151, 0.3) 75%, 
              rgba(102, 215, 151, 0.3) 100%
            )`,
            backgroundSize: '400% 400%',
            animation: 'gradient-move 12s ease-in-out infinite'
          }}
        ></div>
        
        {/* Floating radial gradients */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(102, 215, 151, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(102, 215, 151, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 40% 80%, rgba(102, 215, 151, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 90% 90%, rgba(102, 215, 151, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 10% 10%, rgba(102, 215, 151, 0.2) 0%, transparent 40%)
            `,
            animation: 'gradient-shift 8s ease-in-out infinite'
          }}
        ></div>
        
        {/* Additional floating orbs */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 60% 30%, rgba(102, 215, 151, 0.5) 0%, transparent 40%),
              radial-gradient(circle at 30% 70%, rgba(102, 215, 151, 0.5) 0%, transparent 40%)
            `,
            animation: 'float 10s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-4">
        <div className="flex items-center justify-start">
          {/* Back Button */}
          <button 
            onClick={handleBackToHome}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/40 dark:hover:bg-gray-700/40"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
        <div className="w-full max-w-md">
          {/* Glass Container */}
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg dark:border-gray-600/50 rounded-2xl p-8 shadow-2xl">
            
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome Back!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Sign in to continue your smart shopping journey
              </p>
              

            </div>

            {/* Authentication Form */}
            <AuthForm onLogin={handleLogin} />

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{' '}
                <a href="#" className="text-[#71B836] hover:text-[#5A9A2E] underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#71B836] hover:text-[#5A9A2E] underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AuthPage;
