import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import SidePanel from './SidePanel';

interface User {
  id: string;
  email: string;
  username: string;
  sensayUserId?: string;
}

interface ChatPageProps {
  onLogout?: () => void;
}

const ChatPage = ({ onLogout }: ChatPageProps) => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState('new-chat');
  const [user, setUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sidePanelType, setSidePanelType] = useState<'cart' | 'history' | null>(null);

  useEffect(() => {
    // Check if user is logged in
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
      }
    }
  }, []);

  // User is already authenticated when reaching this page through routing

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSelectedChat('new-chat');
    // Call parent logout handler if provided
    if (onLogout) {
      onLogout();
    }
    // Redirect to auth page after logout
    navigate('/auth');
  };

  const handleNewChatCreated = (sessionId: string) => {
    console.log('New chat session created, switching to:', sessionId);
    setSelectedChat(sessionId);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCartClick = () => {
    setSidePanelType('cart');
  };

  const handleHistoryClick = () => {
    setSidePanelType('history');
  };

  const handleCloseSidePanel = () => {
    setSidePanelType(null);
  };

  const handleCheckoutSuccess = () => {
    setSidePanelType('history'); // Show history after successful checkout
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Professional Animated Background with Dark Mode Support */}
      <div className="fixed inset-0 -z-10">
        {/* Primary gradient layer with smooth yellow-green to blue-teal transition */}
        <div 
          className="absolute inset-0 opacity-75 dark:opacity-90"
          style={{
            background: `linear-gradient(90deg, 
              rgba(255, 255, 0, 0.2) 0%,
              rgba(144, 238, 144, 0.15) 20%, 
              rgba(173, 216, 230, 0.12) 40%, 
              rgba(135, 206, 235, 0.15) 60%, 
              rgba(0, 191, 255, 0.2) 80%,
              rgba(70, 130, 180, 0.15) 100%
            )`,
            backgroundSize: '200% 100%',
            animation: 'gradient-move 22s ease-in-out infinite'
          }}
        ></div>
        
        {/* Dark mode overlay */}
        <div className="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 opacity-0 dark:opacity-100 transition-opacity duration-500"></div>
        
        {/* Enhanced floating radial gradients with yellow-green to blue-teal theme */}
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            background: `
              radial-gradient(circle at 25% 40%, rgba(255, 255, 0, 0.25) 0%, transparent 65%),
              radial-gradient(circle at 75% 25%, rgba(144, 238, 144, 0.2) 0%, transparent 70%),
              radial-gradient(circle at 45% 75%, rgba(173, 216, 230, 0.18) 0%, transparent 60%),
              radial-gradient(circle at 85% 85%, rgba(0, 191, 255, 0.22) 0%, transparent 65%),
              radial-gradient(circle at 15% 15%, rgba(70, 130, 180, 0.15) 0%, transparent 50%)
            `,
            animation: 'gradient-shift 25s ease-in-out infinite'
          }}
        ></div>
        
        {/* Additional floating orbs with yellow-green to blue-teal theme */}
        <div 
          className="absolute inset-0 opacity-18 dark:opacity-12"
          style={{
            background: `
              radial-gradient(circle at 60% 30%, rgba(255, 255, 0, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 30% 70%, rgba(144, 238, 144, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 80% 60%, rgba(0, 191, 255, 0.2) 0%, transparent 40%)
            `,
            animation: 'float 30s ease-in-out infinite'
          }}
        ></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-25 dark:opacity-15"></div>
      </div>

      {/* Chat History Sidebar */}
      <div className="relative w-80 lg:w-80 md:w-64 mobile-hide-sidebar tablet-reduced-sidebar flex-shrink-0 p-2 animate-slide-in-left">
        <div className="absolute inset-2 
            rounded-2xl 
            border border-gray-200 dark:border-white/30 
            bg-white/30 dark:bg-gray-900/30 
            backdrop-blur-sm 
            shadow-sm"></div>
        <div className="relative h-full p-2">
          <ChatSidebar
            selectedChat={selectedChat}
            onChatSelect={setSelectedChat}
            user={user}
            onLogout={handleLogout}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative p-2 mobile-full-chat animate-slide-in-right">
        <div className="absolute inset-2 glass-morphism-enhanced rounded-2xl"></div>
        <div className="relative flex-1 flex flex-col p-2 overflow-hidden">
          <ChatArea 
            selectedChat={selectedChat} 
            user={user} 
            onSessionCreated={handleNewChatCreated}
            onCartClick={handleCartClick}
            onHistoryClick={handleHistoryClick}
          />
        </div>
      </div>
      
      {/* Side Panel for Cart and History - Outside Chat Area */}
      <SidePanel
        isOpen={sidePanelType !== null}
        type={sidePanelType}
        onClose={handleCloseSidePanel}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default ChatPage;
