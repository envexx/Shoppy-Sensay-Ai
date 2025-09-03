import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, authenticateToken, AuthRequest } from './auth';
import { SensayService } from './sensay-service';
import ShopifyService from './shopify-service';
import { prisma } from './database';
import { cacheService } from './cache';

const router = express.Router();
const sensayService = new SensayService();
const shopifyService = new ShopifyService();

// Rate limiting for cart operations
const cartLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 cart operations per minute
  message: 'Too many cart operations, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Shoppy Sensay API'
  });
});

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await registerUser(email, username, password);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Registration failed'
    });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const result = await loginUser(emailOrUsername, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ 
      error: error.message || 'Login failed'
    });
  }
});

// Protected routes (require authentication)
router.get('/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Chat routes
router.post('/chat/send', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { message, isNewChat, sessionId } = req.body;
    const userId = req.user!.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Chat request from user ${userId}:`, message, { isNewChat, sessionId });
    const response = await sensayService.sendChatMessage(userId, message.trim(), isNewChat, sessionId);
    
    res.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Chat failed'
    });
  }
});

router.get('/chat/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const sessionId = req.query.sessionId as string;

    const history = await sensayService.getChatHistory(userId, sessionId);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error: any) {
    console.error('Chat history error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get chat history'
    });
  }
});

router.get('/chat/sensay-history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const history = await sensayService.getSensayChatHistory(userId);
    
    res.json({
      success: true,
      type: 'chat_history',
      items: history
    });
  } catch (error: any) {
    console.error('Sensay chat history error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get Sensay chat history'
    });
  }
});

router.get('/chat/sessions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const sessions = await sensayService.getChatSessions(userId);
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error: any) {
    console.error('Chat sessions error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get chat sessions'
    });
  }
});

// Analytics routes - DISABLED due to Sensay API limitations
// router.get('/analytics', authenticateToken, async (req: AuthRequest, res) => {
//   try {
//     const userId = req.user!.id;
//     const analytics = await sensayService.getUserAnalytics(userId);
//     res.json({
//       success: true,
//       data: analytics
//     });
//   } catch (error: any) {
//     console.error('Analytics error:', error);
//     res.status(500).json({ 
//       error: error.message || 'Failed to get analytics'
//     });
//   }
// });

// Admin routes (for debugging)
router.get('/admin/users', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Simple admin check - you can enhance this
    if (!req.user!.email.includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        sensayUserId: true,
        createdAt: true,
        _count: {
          select: {
            chatSessions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error: any) {
    console.error('Admin users error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get users'
    });
  }
});

router.get('/admin/api-usage', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user!.email.includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const usage = await prisma.apiUsage.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    
    res.json({
      success: true,
      data: usage
    });
  } catch (error: any) {
    console.error('Admin API usage error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get API usage'
    });
  }
});

// Shopify API routes
router.post('/shopify/search', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    console.log(`Shopify search request: "${query}" (limit: ${limit})`);
    const products = await shopifyService.searchProducts(query.trim(), limit);
    
    res.json({
      success: true,
      data: {
        products,
        count: products.length,
        formattedResponse: shopifyService.formatProductsForChat(products)
      }
    });
  } catch (error: any) {
    console.error('Shopify search error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to search products'
    });
  }
});

router.get('/shopify/product/:handle', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { handle } = req.params;
    
    if (!handle) {
      return res.status(400).json({ error: 'Product handle is required' });
    }

    console.log(`Getting product details for handle: ${handle}`);
    const product = await shopifyService.getProductByHandle(handle);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Shopify get product error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get product details'
    });
  }
});

router.post('/shopify/cart/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log(`Creating cart for user ${req.user!.id}`);
    const cart = await shopifyService.createCart();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    console.error('Shopify create cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create cart'
    });
  }
});

router.post('/shopify/cart/add', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cartId, variantId, quantity = 1 } = req.body;
    
    if (!cartId || !variantId) {
      return res.status(400).json({ error: 'Cart ID and variant ID are required' });
    }

    console.log(`Adding variant ${variantId} to cart ${cartId} (qty: ${quantity})`);
    const cart = await shopifyService.addToCart(cartId, variantId, quantity);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    console.error('Shopify add to cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to add item to cart'
    });
  }
});

router.get('/shopify/cart/:cartId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { cartId } = req.params;
    
    if (!cartId) {
      return res.status(400).json({ error: 'Cart ID is required' });
    }

    console.log(`Getting cart details for: ${cartId}`);
    const cart = await shopifyService.getCart(cartId);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error: any) {
    console.error('Shopify get cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get cart details'
    });
  }
});

router.get('/shopify/order/:orderName', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { orderName } = req.params;
    
    if (!orderName) {
      return res.status(400).json({ error: 'Order name/number is required' });
    }

    console.log(`Checking order status for: ${orderName}`);
    const order = await shopifyService.getOrderStatus(orderName);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Shopify get order error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get order status'
    });
  }
});

router.get('/shopify/featured', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    console.log(`Getting featured products (limit: ${limit})`);
    const products = await shopifyService.getFeaturedProducts(limit);
    
    res.json({
      success: true,
      data: {
        products,
        count: products.length,
        formattedResponse: shopifyService.formatProductsForChat(products)
      }
    });
  } catch (error: any) {
    console.error('Shopify featured products error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get featured products'
    });
  }
});

// Cart API routes
router.get('/cart', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    const total = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        total: total,
        count: cartItems.length
      }
    });
  } catch (error: any) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get cart items'
    });
  }
});

// Fast cart count endpoint for real-time updates
router.get('/cart/count', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const cacheKey = `cart_count_${userId}`;
    
    // Try to get from cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true
      });
    }
    
    // Use aggregation for faster count and total calculation
    const cartStats = await prisma.cartItem.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { total: true }
    });
    
    const result = {
      count: cartStats._count.id || 0,
      total: Number(cartStats._sum.total) || 0
    };
    
    // Cache the result for 30 seconds
    cacheService.set(cacheKey, result, 30000);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get cart count error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get cart count'
    });
  }
});

router.post('/cart/add', authenticateToken, cartLimiter, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { productId, productName, description, price, quantity = 1, imageUrl, productUrl } = req.body;
    
    console.log('Add to cart request:', { userId, productId, productName, price, quantity });
    
    if (!productId || !productName || !price) {
      console.log('Missing required fields:', { productId, productName, price });
      return res.status(400).json({ error: 'Product ID, name, and price are required' });
    }
    
    // Use transaction for atomic operations with cart totals
    const result = await prisma.$transaction(async (tx) => {
      // Check if product already exists in cart
      const existingItem = await tx.cartItem.findFirst({
        where: {
          userId,
          productId
        }
      });
      
      let cartItem;
      let isUpdate = false;
      
      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + quantity;
        const newTotal = Number(price) * newQuantity;
        
        cartItem = await tx.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: newQuantity,
            total: newTotal
          }
        });
        isUpdate = true;
      } else {
        // Create new cart item
        const total = Number(price) * quantity;
        
        cartItem = await tx.cartItem.create({
          data: {
            userId,
            productId,
            productName,
            description,
            price: Number(price),
            quantity,
            total,
            imageUrl,
            productUrl
          }
        });
      }
      
      // Get updated cart totals
      const cartItems = await tx.cartItem.findMany({
        where: { userId }
      });
      
      const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
      const cartCount = cartItems.length;
      
      return {
        item: cartItem,
        cartTotal,
        cartCount,
        isUpdate
      };
    });
    
    console.log('Cart item processed:', result.item);
    
    res.json({
      success: true,
      data: result.item,
      cartTotal: result.cartTotal,
      cartCount: result.cartCount,
      message: result.isUpdate ? 'Item quantity updated in cart' : 'Item added to cart'
    });

    // Invalidate cache
    cacheService.delete(`cart_count_${userId}`);
    cacheService.delete(`cart_${userId}`);
  } catch (error: any) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to add item to cart'
    });
  }
});

router.put('/cart/:itemId', authenticateToken, cartLimiter, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    
    // Use transaction for atomic update with cart totals
    const result = await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findFirst({
        where: { id: itemId, userId }
      });
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
      
      const total = Number(cartItem.price) * quantity;
      
      const updatedItem = await tx.cartItem.update({
        where: { id: itemId },
        data: { quantity, total }
      });
      
      // Get updated cart totals
      const cartItems = await tx.cartItem.findMany({
        where: { userId }
      });
      
      const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
      const cartCount = cartItems.length;
      
      return {
        item: updatedItem,
        cartTotal,
        cartCount
      };
    });
    
    res.json({
      success: true,
      data: result.item,
      cartTotal: result.cartTotal,
      cartCount: result.cartCount
    });

    // Invalidate cache
    cacheService.delete(`cart_count_${userId}`);
    cacheService.delete(`cart_${userId}`);
  } catch (error: any) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to update cart item'
    });
  }
});

router.delete('/cart/:itemId', authenticateToken, cartLimiter, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;
    
    // Use transaction for atomic delete with cart totals
    const result = await prisma.$transaction(async (tx) => {
      const cartItem = await tx.cartItem.findFirst({
        where: { id: itemId, userId }
      });
      
      if (!cartItem) {
        throw new Error('Cart item not found');
      }
      
      await tx.cartItem.delete({
        where: { id: itemId }
      });
      
      // Get updated cart totals
      const cartItems = await tx.cartItem.findMany({
        where: { userId }
      });
      
      const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
      const cartCount = cartItems.length;
      
      return {
        cartTotal,
        cartCount
      };
    });
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cartTotal: result.cartTotal,
      cartCount: result.cartCount
    });

    // Invalidate cache
    cacheService.delete(`cart_count_${userId}`);
    cacheService.delete(`cart_${userId}`);
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to remove item from cart'
    });
  }
});

router.delete('/cart', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
    
    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error: any) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to clear cart'
    });
  }
});

// Purchase History API routes
router.get('/purchases', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    const purchases = await prisma.purchaseHistory.findMany({
      where: { userId },
      orderBy: { purchaseDate: 'desc' }
    });
    
    res.json({
      success: true,
      data: purchases
    });
  } catch (error: any) {
    console.error('Get purchase history error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get purchase history'
    });
  }
});

router.post('/checkout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Use transaction for atomic checkout process
    const result = await prisma.$transaction(async (tx) => {
      // Get all cart items
      const cartItems = await tx.cartItem.findMany({
        where: { userId }
      });
      
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      
      const orderId = `ORDER_${Date.now()}_${userId}`;
      
      // Create purchase history entries
      const purchases = await Promise.all(
        cartItems.map(item => 
          tx.purchaseHistory.create({
            data: {
              userId: item.userId,
              productId: item.productId,
              productName: item.productName,
              description: item.description,
              price: item.price,
              quantity: item.quantity,
              total: item.total,
              imageUrl: item.imageUrl,
              productUrl: item.productUrl,
              orderId,
              status: 'completed'
            }
          })
        )
      );
      
      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });
      
      const totalAmount = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
      
      return {
        purchases,
        totalAmount,
        orderId
      };
    });
    
    // Invalidate cache
    cacheService.delete(`cart_count_${userId}`);
    cacheService.delete(`cart_${userId}`);
    
    res.json({
      success: true,
      data: {
        ...result,
        message: 'Checkout completed successfully'
      }
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to complete checkout'
    });
  }
});

export default router;
