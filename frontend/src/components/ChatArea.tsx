import React, { useState, useEffect, useRef } from 'react';
import { 
  Smile, 
  Paperclip, 
  Send, 
  Mic,
  Shield,
  ShoppingBag,
  ShoppingCart,
  History
} from 'lucide-react';
import * as api from '../services/api';
import ProductCard from './ProductCard';
import { detectShoppingLinks, extractProductFromMessage } from '../utils/linkDetector';
import MarkdownText from '../utils/markdownParser';

interface User {
  id: string;
  email: string;
  username: string;
  sensayUserId?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  link?: string;
  products?: ProductInfo[];
  shopifyProducts?: ShopifyProductInfo[];
}

interface ShopifyProductInfo {
  id: string;
  title: string;
  handle: string;
  description: string;
  totalInventory: number;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
      };
    }>;
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

interface ProductInfo {
  id: string;
  name: string;
  price?: string;
  image?: string;
  url: string;
  description?: string;
  rating?: number;
  availability?: string;
}

interface ChatAreaProps {
  selectedChat: string;
  user: User | null;
  isNewChat?: boolean;
  onSessionCreated?: (sessionId: string) => void;
  onCartClick?: () => void;
  onHistoryClick?: () => void;
}

const ChatArea = ({ selectedChat, user, isNewChat = false, onSessionCreated, onCartClick, onHistoryClick }: ChatAreaProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load cart count on component mount
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const response = await api.getCartCount();
        setCartCount(response.data.count);
      } catch (error) {
        console.error('Error loading cart count:', error);
      }
    };
    
    if (user) {
      loadCartCount();
    }
  }, [user]);

  // Function to refresh cart count (optimized)
  const refreshCartCount = async () => {
    try {
      const response = await api.getCartCount();
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error refreshing cart count:', error);
    }
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      refreshCartCount();
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Function to detect products in a message
  const detectProductsInMessage = (content: string): ProductInfo[] => {
    // detectShoppingLinks already returns ProductInfo[]
    const detectedProducts = detectShoppingLinks(content);
    
    // Also try to extract product recommendations from AI responses
    const extractedProducts = extractProductFromMessage(content);
    
    // Combine both types of detection
    return [...detectedProducts, ...extractedProducts];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && !isNewChat && selectedChat && selectedChat !== 'new-chat') {
      loadChatHistory(selectedChat);
      setCurrentSessionId(selectedChat);
    } else if (isNewChat || selectedChat === 'new-chat') {
      // Clear messages for new chat
      setMessages([]);
      setCurrentSessionId(null);
    }
  }, [user, selectedChat, isNewChat]);

  const loadChatHistory = async (sessionId: string) => {
    if (!user) return;
    
    try {
      console.log('Loading chat history for session:', sessionId);
      // Load specific session history
      const response = await api.getChatHistory(sessionId);
      console.log('Chat history response for session:', sessionId, response); // Debug log
      
      if (response.success && response.data && response.data.length > 0) {
        // Add product detection to existing messages and restore saved Shopify products
        const messagesWithProducts = response.data.map((msg: any) => {
          const detectedProducts = detectProductsInMessage(msg.content);
          return {
            ...msg,
            products: detectedProducts.length > 0 ? detectedProducts : undefined,
            shopifyProducts: msg.shopifyProducts || undefined
          };
        });
        setMessages(messagesWithProducts);
        console.log(`Loaded ${messagesWithProducts.length} messages for session ${sessionId}`);
      } else {
        console.log('No messages found for session:', sessionId);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat history for session:', sessionId, error);
      // If session not found, clear messages and show error
      setMessages([]);
      // You could add a toast notification here to inform the user
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading || !user) return;

    const messageContent = message.trim();
    const detectedProducts = detectProductsInMessage(messageContent);
    
    const userMessage: Message = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}_${performance.now()}`,
      content: messageContent,
      role: 'user',
      timestamp: new Date().toISOString(),
      products: detectedProducts.length > 0 ? detectedProducts : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    setError('');

    // If this is a new chat and it's the first message, this will automatically create a new session
    // The backend will handle session creation in the sendChat endpoint

    try {
      // Determine if this is a new chat or continuing existing session
      const isNewChatMode = isNewChat || selectedChat === 'new-chat';
      // Use the tracked currentSessionId or fall back to selectedChat logic
      const sessionIdToSend = currentSessionId || (selectedChat !== 'new-chat' && !isNewChatMode ? selectedChat : undefined);
      
      console.log('Sending message with params:', { 
        message: userMessage.content, 
        isNewChatMode: isNewChatMode, 
        sessionId: sessionIdToSend,
        selectedChat,
        isNewChat,
        messagesCount: messages.length,
        currentSessionId
      });
      
      const response = await api.sendChat(userMessage.content, isNewChatMode, sessionIdToSend);
      console.log('Chat response:', response, { isNewChatMode, sessionIdToSend }); // Debug log
      if (response.success && response.data) {
        const aiContent = response.data.message;
        const aiDetectedProducts = detectProductsInMessage(aiContent);
        
        const aiMessage: Message = {
          id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 11)}_${performance.now()}`,
          content: aiContent,
          role: 'assistant',
          timestamp: response.data.timestamp,
          products: aiDetectedProducts.length > 0 ? aiDetectedProducts : undefined,
          shopifyProducts: response.data.shopifyProducts // Include Shopify products from response
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Update currentSessionId with the session ID from response
        if (response.data.sessionId) {
          setCurrentSessionId(response.data.sessionId);
          
          // If this was a new session, notify parent to switch to it
          if (response.data.isNewSession && onSessionCreated) {
            console.log('New session created, switching to:', response.data.sessionId);
            onSessionCreated(response.data.sessionId);
          } else if (sessionIdToSend !== response.data.sessionId) {
            // Session ID changed (e.g., session was recreated), update parent
            console.log('Session ID changed from', sessionIdToSend, 'to', response.data.sessionId);
            if (onSessionCreated) {
              onSessionCreated(response.data.sessionId);
            }
          }
        }
        
        // Check if response indicates cart action and refresh cart count
        const responseText = response.data.message.toLowerCase();
        if (responseText.includes('added to cart') || 
            responseText.includes('🛒') || 
            responseText.includes('cart') ||
            responseText.includes('enjoy your new') ||
            responseText.includes('removed') ||
            responseText.includes('deleted') ||
            responseText.includes('reduced') ||
            responseText.includes('updated') ||
            responseText.includes('changed')) {
          console.log('Response indicates cart action, refreshing cart count...');
          refreshCartCount();
        }
        
        // Product detection is now handled inline with ProductCard
      } else {
        console.error('Invalid response structure:', response);
        setError('Received invalid response from server');
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="h-full flex flex-col bg-slate-800/30 backdrop-blur-xl">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-500" />
            <h3 className="text-xl font-bold mb-2 font-sora text-white">Welcome to Shoppy Sensay</h3>
            <p className="text-slate-300">Please login to start chatting with your AI shopping assistant</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      {/* Header with Cart and History Icons */}
      {user && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#71B836]/10 dark:bg-[#71B836]/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#71B836] dark:text-[#71B836]/80" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shoppy Sensay</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Shopping Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group"
              title="Keranjang"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            
            {/* History Icon */}
            <button
              onClick={onHistoryClick}
              className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 group"
              title="Riwayat Pembelian"
            >
              <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto ultra-thin-scrollbar p-6 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            {isNewChat || selectedChat === 'new-chat' ? (
              <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#71B836]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#71B836]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-sora">Welcome to Shoppy Sensay!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  I'm your smart shopping assistant! I can help you find the best products, 
                  compare prices, and make informed purchasing decisions. What would you like to shop for today?
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="bg-[#71B836]/10 dark:bg-[#71B836]/20 border border-[#71B836]/30 dark:border-[#71B836]/50 rounded-lg p-3 text-left">
                    <p className="text-[#71B836] dark:text-[#71B836]/80 font-medium">💡 Try asking me:</p>
                    <p className="text-[#71B836] dark:text-[#71B836]/70">"Find me trendy casual shirts under $50"</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3 text-left">
                    <p className="text-green-700 dark:text-green-300 font-medium">🔍 Or say:</p>
                    <p className="text-green-600 dark:text-green-400">"Show me the best summer dresses for 2025"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start w-full">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
                  <p className="text-sm">Hello! I'm Shoppy Sensay, your smart shopping assistant! 🛍️ I'm here to help you find the best products at great prices. What are you looking to buy today?</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Session Header */}
            {!isNewChat && selectedChat !== 'new-chat' && (
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#71B836] rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Chat Session Started
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {messages.length > 0 ? formatTime(messages[0].timestamp) : 'Now'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#71B836] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <div>
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap">
                        <MarkdownText content={msg.content} />
                      </div>
                    )}
                  </div>
                  <p className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-[#71B836]/20' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
              
              {/* Product Cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="w-full">
                  <ProductCard products={msg.products} />
                </div>
              )}
              
              {/* Shopify Product Cards */}
              {msg.shopifyProducts && msg.shopifyProducts.length > 0 && (
                <div className="w-full">
                  <ProductCard products={msg.shopifyProducts} isShopifyProducts={true} />
                </div>
              )}
            </div>
            ))}
          </>
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#71B836]/80 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#71B836]/80 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[#71B836]/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Shoppy is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="relative p-6 
            border border-gray-200 dark:border-white/30 
            bg-white/30 dark:bg-gray-900/30 
            backdrop-blur-md 
            flex-shrink-0 
            shadow-sm 
            rounded-xl">
        {/* Enhanced Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl"></div>
        
        <form onSubmit={handleSendMessage} className="relative z-10 flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about any product you're looking for..."
              className="w-full px-4 py-3 glass-morphism-enhanced rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 text-sm pr-20 focus:outline-none focus:ring-2 focus:ring-[#71B836]/50 focus:border-white/50 transition-all duration-300 shadow-sm"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button type="button" className="p-1 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm">
                <Smile className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
              <button type="button" className="p-1 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm">
                <Paperclip className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button type="button" className="p-3 glass-morphism-enhanced rounded-full transition-all duration-300 hover:scale-110">
              <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />
            </button>
            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-[#71B836]/90 to-[#71B836]/90 hover:from-[#71B836] hover:to-[#71B836]/80 rounded-full text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-110 backdrop-blur-sm"
              disabled={loading || !message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
        
        <div className="relative z-10 flex items-center justify-center mt-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1 glass-morphism-enhanced px-3 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Powered by Sensay AI • Secure & Private Shopping Assistant</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;