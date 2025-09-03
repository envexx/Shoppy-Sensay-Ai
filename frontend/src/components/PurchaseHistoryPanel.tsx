import { useState, useEffect } from 'react';
import { History, Package, Calendar, CheckCircle } from 'lucide-react';
import * as api from '../services/api';

interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
  productUrl?: string;
  purchaseDate: string;
  orderId?: string;
  status: string;
}

interface PurchaseHistoryPanelProps {
  onBack: () => void;
}

const PurchaseHistoryPanel = ({ onBack }: PurchaseHistoryPanelProps) => {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseHistory();
  }, []);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      const response = await api.getPurchaseHistory();
      setPurchases(response.data);
    } catch (error) {
      console.error('Error loading purchase history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Group purchases by order ID
  const groupedPurchases = purchases.reduce((groups, purchase) => {
    const orderId = purchase.orderId || `order_${purchase.id}`;
    if (!groups[orderId]) {
      groups[orderId] = [];
    }
    groups[orderId].push(purchase);
    return groups;
  }, {} as Record<string, PurchaseItem[]>);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-gray-600 font-medium">Loading purchase history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full">

      {/* Purchase History Content */}
      <div className="flex-1 overflow-y-auto">
        {purchases.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">No Purchases Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your purchase history will appear here</p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {Object.entries(groupedPurchases).map(([orderId, orderItems]) => {
              const firstItem = orderItems[0];
              const orderTotal = orderItems.reduce((sum, item) => sum + Number(item.total), 0);
              
              return (
                <div
                  key={orderId}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                  {/* Order Header */}
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="space-y-3">
                      {/* Date and Order Info */}
                      <div className="flex items-start space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {formatDate(firstItem.purchaseDate)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Order: {orderId}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status and Total - Stack on mobile */}
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(firstItem.status)}`}>
                          {getStatusIcon(firstItem.status)}
                          <span className="capitalize">{firstItem.status}</span>
                        </span>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatPrice(orderTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-3 space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3">
                        {/* Product Image */}
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {item.productName}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {formatPrice(item.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistoryPanel;
