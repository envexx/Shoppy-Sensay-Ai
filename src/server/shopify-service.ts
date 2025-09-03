import axios, { AxiosInstance, AxiosError } from 'axios';
import { SHOPIFY_CONFIG } from '../config';

export interface ShopifyProduct {
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

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyOrder {
  id: string;
  name: string;
  displayFulfillmentStatus: string;
  fulfillmentOrders: {
    edges: Array<{
      node: {
        status: string;
        lineItems: {
          edges: Array<{
            node: {
              lineItem: {
                name: string;
              };
            };
          }>;
        };
      };
    }>;
  };
}

export class ShopifyService {
  private storefrontClient: AxiosInstance;
  private adminClient: AxiosInstance;

  constructor() {
    // Storefront API Client (untuk customer-facing operations)
    this.storefrontClient = axios.create({
      baseURL: SHOPIFY_CONFIG.endpoints.storefront,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontApiToken,
      },
      timeout: 10000, // 10 second timeout
    });

    // Admin API Client (untuk backend operations)
    this.adminClient = axios.create({
      baseURL: SHOPIFY_CONFIG.endpoints.admin,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_CONFIG.adminApiToken,
      },
      timeout: 10000, // 10 second timeout
    });

    // Add response interceptors for better error handling
    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for better error handling and rate limiting
   */
  private setupInterceptors() {
    // Storefront client interceptor
    this.storefrontClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return this.handleShopifyError(error, 'Storefront API');
      }
    );

    // Admin client interceptor
    this.adminClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return this.handleShopifyError(error, 'Admin API');
      }
    );
  }

  /**
   * Enhanced error handler for Shopify API responses
   */
  private handleShopifyError(error: AxiosError, apiType: string): Promise<never> {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          throw new Error(`${apiType}: Bad Request - Check your query syntax`);
        case 401:
          throw new Error(`${apiType}: Unauthorized - Check your access token`);
        case 402:
          throw new Error(`${apiType}: Payment Required - Shop is frozen`);
        case 403:
          throw new Error(`${apiType}: Forbidden - Shop is marked as fraudulent`);
        case 404:
          throw new Error(`${apiType}: Not Found - Resource doesn't exist`);
        case 423:
          throw new Error(`${apiType}: Locked - Shop isn't available`);
        case 429:
          throw new Error(`${apiType}: Rate Limited - Too many requests`);
        default:
          if (status >= 500) {
            throw new Error(`${apiType}: Server Error (${status}) - Try again later`);
          }
          throw new Error(`${apiType}: HTTP Error ${status}`);
      }
    } else if (error.request) {
      throw new Error(`${apiType}: Network Error - Unable to connect to Shopify`);
    } else {
      throw new Error(`${apiType}: Request Error - ${error.message}`);
    }
  }

  /**
   * Mencari produk berdasarkan query text
   */
  async searchProducts(searchText: string, limit: number = 5): Promise<ShopifyProduct[]> {
    try {
      const query = `
        query searchProducts($searchText: String!, $limit: Int!) {
          products(first: $limit, query: $searchText) {
            edges {
              node {
                id
                title
                handle
                description
                totalInventory
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
                variants(first: 3) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const searchQuery = this.buildSearchQuery(searchText);
      console.log(`🔍 Shopify Search Query: "${searchQuery}" (from: "${searchText}")`);
      
      const variables = {
        searchText: searchQuery,
        limit
      };

      const response = await this.storefrontClient.post('', {
        query,
        variables
      });

      if (response.data.errors) {
        console.error('🚨 Shopify GraphQL Errors:', response.data.errors);
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      const products = response.data.data.products.edges.map((edge: any) => edge.node);
      console.log(`✅ Shopify found ${products.length} products`);
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Mendapatkan detail produk berdasarkan handle
   */
  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    try {
      const query = `
        query getProduct($handle: String!) {
          product(handle: $handle) {
            id
            title
            handle
            description
            totalInventory
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      `;

      const response = await this.storefrontClient.post('', {
        query,
        variables: { handle }
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data.product;
    } catch (error) {
      console.error('Error getting product by handle:', error);
      throw new Error('Failed to get product details');
    }
  }

  /**
   * Membuat keranjang baru
   */
  async createCart(): Promise<ShopifyCart> {
    try {
      const mutation = `
        mutation cartCreate {
          cartCreate {
            cart {
              id
              checkoutUrl
              totalQuantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const response = await this.storefrontClient.post('', {
        query: mutation
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      const { cart, userErrors } = response.data.data.cartCreate;

      if (userErrors && userErrors.length > 0) {
        throw new Error(`Cart creation error: ${userErrors[0].message}`);
      }

      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw new Error('Failed to create cart');
    }
  }

  /**
   * Menambahkan item ke keranjang
   */
  async addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
    try {
      const mutation = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              checkoutUrl
              totalQuantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        cartId,
        lines: [{
          merchandiseId: variantId,
          quantity
        }]
      };

      const response = await this.storefrontClient.post('', {
        query: mutation,
        variables
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      const { cart, userErrors } = response.data.data.cartLinesAdd;

      if (userErrors && userErrors.length > 0) {
        throw new Error(`Add to cart error: ${userErrors[0].message}`);
      }

      return cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  /**
   * Mendapatkan detail keranjang
   */
  async getCart(cartId: string): Promise<ShopifyCart> {
    try {
      const query = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await this.storefrontClient.post('', {
        query,
        variables: { cartId }
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data.cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      throw new Error('Failed to get cart details');
    }
  }

  /**
   * Mengecek status pesanan (menggunakan Admin API)
   */
  async getOrderStatus(orderName: string): Promise<ShopifyOrder | null> {
    try {
      const query = `
        query getOrderStatus($orderName: String!) {
          orders(first: 1, query: $orderName) {
            edges {
              node {
                id
                name
                displayFulfillmentStatus
                fulfillmentOrders(first: 1) {
                  edges {
                    node {
                      status
                      lineItems(first: 5) {
                        edges {
                          node {
                            lineItem {
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        orderName: `name:${orderName}`
      };

      const response = await this.adminClient.post('', {
        query,
        variables
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      const orders = response.data.data.orders.edges;
      return orders.length > 0 ? orders[0].node : null;
    } catch (error) {
      console.error('Error getting order status:', error);
      throw new Error('Failed to get order status');
    }
  }

  /**
   * Mengambil koleksi produk (untuk rekomendasi)
   */
  async getFeaturedProducts(limit: number = 10): Promise<ShopifyProduct[]> {
    try {
      const query = `
        query getFeaturedProducts($limit: Int!) {
          products(first: $limit, sortKey: BEST_SELLING) {
            edges {
              node {
                id
                title
                handle
                description
                totalInventory
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await this.storefrontClient.post('', {
        query,
        variables: { limit }
      });

      if (response.data.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data.products.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw new Error('Failed to get featured products');
    }
  }

  /**
   * Helper function untuk membangun search query yang efektif
   */
  private buildSearchQuery(searchText: string): string {
    // Membersihkan input dan mengoptimalkan untuk Shopify search
    const cleanText = searchText.trim().toLowerCase();
    
    // Extract key product terms from the text
    const productTerms = [];
    
    // Clothing categories
    if (cleanText.includes('kemeja') || cleanText.includes('shirt') || cleanText.includes('t-shirt') || cleanText.includes('tshirt')) {
      productTerms.push('shirt', 'kemeja', 't-shirt', 'tshirt');
    }
    
    if (cleanText.includes('celana') || cleanText.includes('pants') || cleanText.includes('jeans')) {
      productTerms.push('pants', 'celana', 'jeans');
    }
    
    if (cleanText.includes('sepatu') || cleanText.includes('shoes') || cleanText.includes('sneakers')) {
      productTerms.push('shoes', 'sepatu', 'sneakers');
    }
    
    if (cleanText.includes('tops') || cleanText.includes('atasan') || cleanText.includes('blouse')) {
      productTerms.push('tops', 'atasan', 'shirt', 'blouse', 't-shirt');
    }
    
    if (cleanText.includes('hoodie') || cleanText.includes('hoodies') || cleanText.includes('sweater')) {
      productTerms.push('hoodie', 'hoodies', 'sweater');
    }
    
    if (cleanText.includes('polo') || cleanText.includes('polos')) {
      productTerms.push('polo', 'polos');
    }
    
    if (cleanText.includes('oversized') || cleanText.includes('loose')) {
      productTerms.push('oversized', 'loose', 'relaxed');
    }
    
    // Electronics
    if (cleanText.includes('phone') || cleanText.includes('smartphone') || cleanText.includes('handphone')) {
      productTerms.push('phone', 'smartphone', 'handphone', 'mobile');
    }
    
    if (cleanText.includes('laptop') || cleanText.includes('computer') || cleanText.includes('notebook')) {
      productTerms.push('laptop', 'computer', 'notebook');
    }
    
    // If we found specific product terms, build targeted query
    if (productTerms.length > 0) {
      const titleQueries = productTerms.map(term => `title:*${term}*`).join(' OR ');
      const tagQueries = productTerms.map(term => `tag:${term}`).join(' OR ');
      return `(${titleQueries}) OR (${tagQueries})`;
    }
    
    // Fallback: extract meaningful words for general search
    const meaningfulWords = cleanText
      .split(' ')
      .filter(word => 
        word.length > 2 && 
        !['the', 'and', 'for', 'with', 'like', 'want', 'need', 'looking', 'show', 'find', 'could', 'would', 'something', 'budget', 'range', 'prefer', 'comfortable'].includes(word)
      );
    
    if (meaningfulWords.length > 0) {
      const searchTerms = meaningfulWords.slice(0, 3); // Limit to 3 most relevant words
      const titleQueries = searchTerms.map(term => `title:*${term}*`).join(' OR ');
      const tagQueries = searchTerms.map(term => `tag:${term}`).join(' OR ');
      return `(${titleQueries}) OR (${tagQueries})`;
    }
    
    // Final fallback
    return `title:*${cleanText.split(' ')[0]}*`;
  }

  /**
   * Helper function untuk format harga
   */
  formatPrice(amount: string, currencyCode: string): string {
    const price = parseFloat(amount);
    
    if (currencyCode === 'IDR') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    
    if (currencyCode === 'USD') {
      return `$${price.toFixed(2)}`;
    }
    
    return `${price.toFixed(2)} ${currencyCode}`;
  }

  /**
   * Helper function untuk memformat respons produk untuk chatbot
   */
  formatProductsForChat(products: ShopifyProduct[]): string {
    if (products.length === 0) {
      return "Maaf, saya tidak menemukan produk yang sesuai dengan pencarian Anda. Coba dengan kata kunci yang berbeda.";
    }

    let response = `Saya menemukan ${products.length} produk yang cocok:\n\n`;
    
    products.forEach((product, index) => {
      const price = this.formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
      );
      
      const image = product.images.edges.length > 0 ? product.images.edges[0].node.url : '';
      const availability = product.totalInventory > 0 ? 'Tersedia' : 'Stok Habis';
      
      response += `${index + 1}. **${product.title}**\n`;
      response += `   Harga: ${price}\n`;
      response += `   Status: ${availability}\n`;
      if (product.description) {
        response += `   Deskripsi: ${product.description.substring(0, 100)}...\n`;
      }
      if (image) {
        response += `   ![${product.title}](${image})\n`;
      }
      response += `   Link: https://shoppysensay.myshopify.com/products/${product.handle}\n\n`;
    });

    response += "Apakah ada produk yang ingin Anda tambahkan ke keranjang? Atau ingin melihat detail lebih lanjut?";
    
    return response;
  }
}

export default ShopifyService;
