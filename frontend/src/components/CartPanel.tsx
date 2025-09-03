import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import * as api from '../services/api';
import { debounce } from '../utils/debounce';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
  productUrl?: string;
  createdAt: string;
}

interface CartData {
  items: CartItem[];
  total: number;
  count: number;
}

interface CartPanelProps {
  onCheckoutSuccess: () => void;
}

const CartPanel = ({ onCheckoutSuccess }: CartPanelProps) => {
  const [cartData, setCartData] = useState<CartData>({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await api.getCart();
      setCartData(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced server update function
  const debouncedServerUpdate = useCallback(
    debounce(async (itemId: string, newQuantity: number) => {
      try {
        await api.updateCartItem(itemId, newQuantity);
        // Trigger cart update event for other components
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
        console.error('Error updating quantity:', error);
        // Revert optimistic update on error
        loadCart();
      }
    }, 500),
    []
  );

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Add to updating items
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    // Optimistic update - update UI immediately
    setCartData(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      );
      const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      return {
        ...prevCart,
        items: updatedItems,
        total: newTotal
      };
    });

    // Debounced server update
    debouncedServerUpdate(itemId, newQuantity);
    
    // Remove from updating items after a short delay
    setTimeout(() => {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 1000);
  };

  const removeItem = async (itemId: string) => {
    try {
      // Optimistic update - remove item immediately
      setCartData(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);
        const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return {
          ...prevCart,
          items: updatedItems,
          total: newTotal,
          count: updatedItems.length
        };
      });

      // Then update server
      await api.removeFromCart(itemId);
      
      // Trigger cart update event for other components
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
      // Revert optimistic update on error
      loadCart();
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      
      // Optimistic update - clear cart immediately
      setCartData({ items: [], total: 0, count: 0 });
      
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Process checkout
      await api.checkout();
      
      onCheckoutSuccess();
    } catch (error) {
      console.error('Error during checkout:', error);
      // Reload cart on error to restore state
      loadCart();
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-gray-600 font-medium">Loading cart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">
      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {cartData.items.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Empty Cart</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add products to cart to start shopping</p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {cartData.items.map((item) => {
              const isUpdating = updatingItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 ${
                    isUpdating ? 'opacity-75 scale-[0.98]' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Product Image */}
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingCart className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {item.productName}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Price and Controls */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatPrice(item.total)}
                          </div>
                        </div>
                        
                        {/* Controls Row */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-xs font-medium text-gray-900 dark:text-white min-w-[1.5rem] text-center">
                              {isUpdating ? (
                                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isUpdating}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout Footer - Fixed at bottom */}
      {cartData.items.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <img 
              src="./ShoppyS logo .png" 
              alt="ShoppyS Logo" 
              className="w-10 h-10 rounded-lg shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate font-sora">Checkout</p>
              <p className="text-xs text-gray-500 dark:text-gray-300 truncate">{formatPrice(cartData.total)}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Ready to Pay</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{cartData.count} item{cartData.count !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {checkoutLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Pay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPanel;
