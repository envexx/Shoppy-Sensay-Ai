// api/index.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS untuk frontend
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:5173',  // Vite dev server
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',   // Vite dev server
    'https://sensay-terbaru.vercel.app', // Vercel deployment
    'https://*.vercel.app' // All Vercel deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Gunakan routes
app.use('/api', routes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ Shoppy Sensay API Server',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      chat: {
        send: 'POST /api/chat/send',
        history: 'GET /api/chat/history',
        sessions: 'GET /api/chat/sessions'
      },
      shopify: {
        search: 'POST /api/shopify/search',
        featured: 'GET /api/shopify/featured',
        product: 'GET /api/shopify/product/[handle]'
      },
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart',
        update: 'PUT /api/cart/[itemId]',
        delete: 'DELETE /api/cart/[itemId]',
        count: 'GET /api/cart/count',
        checkout: 'POST /api/cart/checkout'
      },
      purchases: 'GET /api/purchases'
    },
    documentation: 'https://api.sensay.io/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Export untuk Vercel
module.exports = app;

// Start server jika tidak di Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API available at http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  });
}