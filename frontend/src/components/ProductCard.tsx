import { ExternalLink, Star, DollarSign, Package, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { addToCart } from '../services/api';

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

// Legacy interface for backward compatibility
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

interface ProductCardProps {
  products: ProductInfo[] | ShopifyProductInfo[];
  isShopifyProducts?: boolean;
}

const ProductCard = ({ products, isShopifyProducts = false }: ProductCardProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  // Check scroll position and update button states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Initial check and setup scroll listener
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Cart functions with optimistic updates
  const handleAddToCart = async (product: ShopifyProductInfo) => {
    try {
      setAddingToCart(product.id);
      
      // Get the first available variant
      const variant = product.variants?.edges?.[0]?.node;
      if (!variant || !variant.availableForSale) {
        return;
      }

      const cartData = {
        productId: product.id,
        productName: product.title,
        description: product.description,
        price: parseFloat(variant.price.amount),
        quantity: 1,
        imageUrl: product.images.edges[0]?.node.url,
        productUrl: getShopifyProductUrl(product.handle)
      };

      console.log('Adding to cart:', cartData);

      // Optimistic update - dispatch event immediately for smooth UX
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Add to our internal cart
      const result = await addToCart(cartData);
      console.log('Add to cart result:', result);
      
      // Dispatch another update to ensure consistency
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Dispatch update to refresh cart state on error
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } finally {
      setAddingToCart(null);
    }
  };

  // Helper functions for Shopify products
  const formatShopifyPrice = (amount: string, currencyCode: string): string => {
    const price = parseFloat(amount);
    if (currencyCode === 'IDR') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    if (currencyCode === 'USD') {
      return `$${price.toFixed(2)}`;
    }
    return `${price.toFixed(2)} ${currencyCode}`;
  };

  const getShopifyProductUrl = (handle: string): string => {
    return `https://shoppysensay.myshopify.com/products/${handle}`;
  };

  return (
    <div className="mt-3">
      {products.length > 1 && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Package className="w-4 h-4 text-[#71B836]" />
            <span className="font-medium">{products.length} products found</span>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                canScrollLeft
                  ? 'text-gray-600 dark:text-gray-300 hover:text-[#71B836] dark:hover:text-[#71B836] hover:bg-[#71B836]/10 dark:hover:bg-[#71B836]/20'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-[#71B836]" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                canScrollRight
                  ? 'text-gray-600 dark:text-gray-300 hover:text-[#71B836] dark:hover:text-[#71B836] hover:bg-[#71B836]/10 dark:hover:bg-[#71B836]/20'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-[#71B836]" />
            </button>
          </div>
        </div>
      )}
      
      {/* Horizontal scrollable container with navigation */}
      <div className="relative">
        {/* Left gradient overlay */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        )}
        
        {/* Right gradient overlay */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide"
        >
        {products.map((product) => {
          if (isShopifyProducts) {
            const shopifyProduct = product as ShopifyProductInfo;
            const productImage = shopifyProduct.images.edges[0]?.node.url;
            const productPrice = formatShopifyPrice(
              shopifyProduct.priceRange.minVariantPrice.amount,
              shopifyProduct.priceRange.minVariantPrice.currencyCode
            );
            const productUrl = getShopifyProductUrl(shopifyProduct.handle);
            const isAvailable = shopifyProduct.totalInventory > 0;
            const isAddingThisProduct = addingToCart === shopifyProduct.id;

            return (
              <div
                key={shopifyProduct.id}
                className="flex-shrink-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-all duration-300 group"
              >
                {/* Product Image */}
                {productImage && (
                  <div className="mb-3">
                    <img
                      src={productImage}
                      alt={shopifyProduct.title}
                      className="w-full h-28 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">
                    {shopifyProduct.title}
                  </h4>
                  
                  {shopifyProduct.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {shopifyProduct.description.substring(0, 100)}...
                    </p>
                  )}

                  {/* Price and Availability */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <DollarSign className="w-3 h-3 text-[#71B836]" />
                      <span className="font-medium text-sm">{productPrice}</span>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isAvailable 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300'
                    }`}>
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isAvailable && (
                      <button
                        onClick={() => handleAddToCart(shopifyProduct)}
                        disabled={isAddingThisProduct}
                        className="inline-flex items-center justify-center w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingThisProduct ? (
                          <>
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-[#71B836] hover:bg-[#5A9A2E] dark:bg-[#71B836] dark:hover:bg-[#5A9A2E] text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors group"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          } else {
            // Legacy product rendering
            const legacyProduct = product as ProductInfo;
            return (
              <div
                key={legacyProduct.id}
                className="flex-shrink-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-all duration-300 group"
              >
                {/* Product Image */}
                {legacyProduct.image && (
                  <div className="mb-3">
                    <img
                      src={legacyProduct.image}
                      alt={legacyProduct.name}
                      className="w-full h-28 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">
                    {legacyProduct.name}
                  </h4>
                  
                  {legacyProduct.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {legacyProduct.description}
                    </p>
                  )}

                  {/* Price and Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {legacyProduct.price && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <DollarSign className="w-3 h-3 text-[#71B836]" />
                          <span className="font-medium text-sm">{legacyProduct.price}</span>
                        </div>
                      )}
                      
                      {legacyProduct.rating && (
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span className="text-sm">{legacyProduct.rating}</span>
                        </div>
                      )}
                    </div>

                    {legacyProduct.availability && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 px-2 py-1 rounded-full">
                        {legacyProduct.availability}
                      </span>
                    )}
                  </div>

                  {/* View Product Button */}
                  <a
                    href={legacyProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors group"
                  >
                    <span>View Product</span>
                    <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform icon-glow-white" />
                  </a>
                </div>
              </div>
            );
          }
        })}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
