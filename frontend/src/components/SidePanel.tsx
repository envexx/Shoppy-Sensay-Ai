import { useState, useEffect } from 'react';
import { X, ShoppingCart, History } from 'lucide-react';
import CartPanel from './CartPanel';
import PurchaseHistoryPanel from './PurchaseHistoryPanel';

interface SidePanelProps {
  isOpen: boolean;
  type: 'cart' | 'history' | null;
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

const SidePanel = ({ isOpen, type, onClose, onCheckoutSuccess }: SidePanelProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    } else {
      // Allow body scroll when panel is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-80 lg:w-80 md:w-64 mobile-hide-sidebar tablet-reduced-sidebar flex-shrink-0 p-2 animate-slide-in-right z-50 transform transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="absolute inset-2 
          rounded-2xl 
          border border-gray-200 dark:border-white/30 
          bg-white dark:bg-gray-900 
          shadow-sm"></div>
      <div className="relative h-full p-2">
        {/* Panel Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 mb-2 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            {type === 'cart' ? (
              <>
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cart</h2>
              </>
            ) : type === 'history' ? (
              <>
                <History className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Purchase History</h2>
              </>
            ) : null}
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-white/30 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="h-full overflow-hidden">
          {type === 'cart' && (
            <CartPanel 
              onCheckoutSuccess={onCheckoutSuccess}
            />
          )}
          {type === 'history' && (
            <PurchaseHistoryPanel 
              onBack={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
