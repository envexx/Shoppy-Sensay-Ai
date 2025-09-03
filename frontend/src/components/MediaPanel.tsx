import { ExternalLink, Star, DollarSign, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  sensayUserId?: string;
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

interface MediaPanelProps {
  user: User | null;
  detectedProducts: ProductInfo[];
  isVisible: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const MediaPanel = ({ user, detectedProducts, isVisible, onCollapseChange }: MediaPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Notify parent when collapse state changes
  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  // If panel is not visible or no products detected, don't render
  if (!isVisible || detectedProducts.length === 0) {
    return null;
  }

  if (!user) {
    return null; // Don't show panel if user not logged in and products detected
  }

  return (
    <div className="h-full flex flex-col">
      {/* Collapse/Expand Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={handleCollapseToggle}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          title={isCollapsed ? "Expand products panel" : "Collapse products panel"}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300 icon-glow-gray" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300 icon-glow-gray" />
          )}
        </button>
      </div>

      {/* Main Panel Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Compact Header - Fixed */}
        <div className="flex items-center justify-between mb-4 px-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-sora">Found Products</h2>
          <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
            {detectedProducts.length} items
          </div>
        </div>

        {/* Scrollable Products List Container */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-3">
                {detectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 group backdrop-blur-sm"
                  >
                    {/* Product Image */}
                    {product.image && (
                      <div className="mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 font-sora">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4 text-xs">
                          {product.price && (
                            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                              <DollarSign className="w-3 h-3 icon-glow-green" />
                              <span className="font-medium">{product.price}</span>
                            </div>
                          )}
                          
                          {product.rating && (
                            <div className="flex items-center space-x-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current icon-glow-cyan" />
                              <span>{product.rating}</span>
                            </div>
                          )}
                        </div>

                        {product.availability && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 px-2 py-1 rounded-full">
                            {product.availability}
                          </span>
                        )}
                      </div>
                    </div>
                                  
                    {/* Purchase Button */}
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors group"
                    >
                      <span>View Product</span>
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform icon-glow-white" />
                    </a>
                  </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPanel;