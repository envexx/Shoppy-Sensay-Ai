# 🛍️ Shoppy Sensay - AI Shopping Assistant

<div align="center">
  <img src="./frontend/public/ShoppyS logo .png" alt="ShoppyS Logo" width="200" height="200">
  
  <h3>Intelligent AI-Powered Shopping Assistant by Sensay Api</h3>
  
  <p>
    <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js">
    <img src="https://img.shields.io/badge/React-18+-61dafb.svg" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  </p>
  
  <p>
    <strong>Live Demo:</strong> 
    <a href="https://shoppy-sensay-ai.vercel.app">Frontend</a> | 
    <a href="https://shoppy-sensay-ai-api.vercel.app">Backend API</a>
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Use Cases](#-use-cases)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)

## 🎯 Overview

Shoppy Sensay is an intelligent AI-powered shopping assistant that revolutionizes the e-commerce experience by providing personalized product recommendations and seamless shopping interactions. Built with cutting-edge technology including React, Node.js, and powered by Sensay AI, it helps customers find the perfect products from your Shopify store through natural conversation.

### Key Highlights

- 🤖 **AI-Powered**: Advanced natural language processing for intelligent product recommendations
- 🛒 **E-commerce Ready**: Full integration with Shopify stores
- 💬 **Conversational Interface**: Natural chat-based shopping experience
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🔒 **Secure**: JWT-based authentication and secure API endpoints
- 📱 **Mobile-First**: Optimized for all devices

## 🏗️ Architecture

### System Architecture Overview

```mermaid
graph TB
    A[Frontend - React App] --> B[Backend API - Node.js]
    B --> C[Sensay AI Service]
    B --> D[Shopify API]
    B --> E[PostgreSQL Database]
    
    C --> F[AI Chat Processing]
    D --> G[Product Search & Inventory]
    E --> H[User Data & Cart Management]
    
    subgraph "Frontend Components"
        I[Chat Interface]
        J[Product Display]
        K[Shopping Cart]
        L[Authentication]
    end
    
    subgraph "Backend Services"
        M[Auth Service]
        N[Cart Service]
        O[Sensay Service]
        P[Shopify Service]
    end
    
    A --> I
    A --> J
    A --> K
    A --> L
    
    B --> M
    B --> N
    B --> O
    B --> P
```

### Technology Stack

#### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Axios** - HTTP client

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication

#### External Services
- **Sensay AI** - AI conversation engine
- **Shopify API** - E-commerce platform integration

### Data Flow

1. **User Interaction**: Customer interacts with the chat interface
2. **AI Processing**: Sensay AI processes the natural language input
3. **Product Search**: System searches Shopify store for relevant products
4. **Response Generation**: AI generates contextual response with product recommendations
5. **UI Update**: Frontend displays products and chat response
6. **Cart Management**: User can add products to cart and manage purchases

## ✨ Features

### 🤖 AI-Powered Chat
- **Natural Language Understanding**: Interprets customer requests from vague to specific
- **Contextual Responses**: Maintains conversation context for better recommendations
- **Smart Product Search**: Automatically searches inventory based on customer needs
- **Learning Capabilities**: Improves recommendations based on user interactions

### 🛒 E-commerce Integration
- **Real-time Product Search**: Live inventory from Shopify stores
- **Product Display**: Rich product cards with images, prices, and details
- **Shopping Cart**: Full cart management with quantity controls
- **Order Processing**: Seamless checkout experience

### 🎨 User Experience
- **Modern Interface**: Clean, intuitive design
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode**: Automatic theme switching
- **Real-time Updates**: Live chat and cart updates
- **Product Modals**: Detailed product views

### 🔒 Security & Performance
- **JWT Authentication**: Secure user sessions
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management
- **Performance Optimization**: Fast loading and response times

## 🎯 Use Cases

### 1. E-commerce Customer Support
**Scenario**: Customer needs help finding specific products
- **Input**: "I'm looking for a blue dress for a wedding"
- **AI Response**: Asks clarifying questions about size, style, budget
- **Output**: Shows relevant dresses with detailed information
- **Action**: Customer can add to cart or ask for alternatives

### 2. Product Discovery
**Scenario**: Customer wants to explore new products
- **Input**: "What's trending in your store?"
- **AI Response**: Shows popular/featured products
- **Output**: Curated product recommendations
- **Action**: Customer discovers new items they might like

### 3. Sales Consultation
**Scenario**: Customer needs personalized recommendations
- **Input**: "I need workout clothes for the gym"
- **AI Response**: Asks about preferences, size, budget
- **Output**: Personalized product suggestions
- **Action**: Customer gets tailored recommendations

### 4. Shopping Assistance
**Scenario**: Customer needs help with product details
- **Input**: "What's the difference between these two jackets?"
- **AI Response**: Compares products side-by-side
- **Output**: Detailed comparison with pros/cons
- **Action**: Customer makes informed decision

### 5. Order Management
**Scenario**: Customer wants to track or modify orders
- **Input**: "Where is my order?"
- **AI Response**: Provides order status and tracking
- **Output**: Real-time order information
- **Action**: Customer stays informed about their purchase

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **PostgreSQL** - Database server
- **Git** - Version control

### Required Accounts & API Keys

1. **Sensay AI Account**
   - Sign up at [Sensay AI](https://sensay.io)
   - Get your API key and Organization ID

2. **Shopify Store**
   - Create a Shopify store or use existing one
   - Generate Storefront and Admin API tokens

3. **Database**
   - Set up PostgreSQL database (local or cloud)

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/envexx/Shoppy-Sensay-Ai.git
cd Shoppy-Sensay-Ai
```

#### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/sensay_shop"

# Sensay AI Configuration
SENSAY_API_KEY="your_sensay_api_key_here"
SENSAY_API_URL="https://api.sensay.io"

# Shopify Configuration
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_ACCESS_TOKEN="your_shopify_access_token_here"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key_here"

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) View database in Prisma Studio
npx prisma studio
```

#### 5. Build the Application

```bash
# Build backend
npm run build

# Build frontend
cd frontend
npm run build
cd ..
```

#### 6. Start the Application

**Development Mode:**

```bash
# Start backend server (with auto-reload)
npm run dev

# In another terminal, start frontend development server
cd frontend
npm run dev
```

**Production Mode:**

```bash
# Start backend server
npm start

# Frontend is already built and served
```

#### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/api/health
- **API Documentation**: http://localhost:3001/

### Quick Start Script

For faster setup, you can use the provided setup script:

```bash
# Make setup script executable (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Or run setup batch file (Windows)
setup.bat
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://shoppy-sensay-ai-api.vercel.app/api`

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | `{email, username, password}` |
| POST | `/auth/login` | User login | `{emailOrUsername, password}` |
| GET | `/auth/me` | Get current user | Headers: `Authorization: Bearer <token>` |

### Chat Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/chat/send` | Send message to AI | `{message, isNewChat?, sessionId?}` |
| GET | `/chat/history` | Get chat history | Query: `sessionId?` |
| GET | `/chat/sessions` | Get chat sessions | - |
| GET | `/chat/sensay-history` | Get Sensay chat history | - |

### Cart Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/cart` | Get user cart | - |
| POST | `/cart` | Add product to cart | `{productId, productName, price, quantity, ...}` |
| PUT | `/cart/:itemId` | Update cart item | `{quantity}` |
| DELETE | `/cart/:itemId` | Remove cart item | - |
| DELETE | `/cart` | Clear entire cart | - |
| GET | `/cart/count` | Get cart count | - |
| POST | `/cart/checkout` | Checkout cart | - |

### Shopify Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/shopify/search` | Search products | `{query, limit?}` |
| GET | `/shopify/product/:handle` | Get product details | - |
| POST | `/shopify/cart/create` | Create Shopify cart | - |
| POST | `/shopify/cart/add` | Add to Shopify cart | `{cartId, variantId, quantity}` |
| GET | `/shopify/cart/:id` | Get Shopify cart | - |
| GET | `/shopify/order/:name` | Get order status | - |
| GET | `/shopify/featured` | Get featured products | Query: `limit?` |

### Purchase History Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/purchases` | Get purchase history |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API information |

### Example API Calls

#### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword"
  }'
```

#### Send Chat Message
```bash
curl -X POST http://localhost:3001/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "message": "I need a blue dress for a wedding",
    "isNewChat": true
  }'
```

#### Search Products
```bash
curl -X POST http://localhost:3001/api/shopify/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "query": "blue dress",
    "limit": 5
  }'
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Backend Deployment

1. **Connect to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables** in Vercel Dashboard:
   ```
   DATABASE_URL=your_production_database_url
   SENSAY_API_KEY=your_sensay_api_key
   SENSAY_API_URL=https://api.sensay.io
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ACCESS_TOKEN=your_shopify_access_token
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

3. **Deploy**:
   ```bash
   git push origin main
   ```

#### Frontend Deployment

1. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

2. **Update API URL** in production environment

### Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables for Production

Ensure all environment variables are properly configured:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Sensay AI
SENSAY_API_KEY=your_production_api_key
SENSAY_API_URL=https://api.sensay.io

# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_production_access_token

# Security
JWT_SECRET=your_secure_jwt_secret

# Server
PORT=3001
NODE_ENV=production
```

## 🧑‍💻 Sensay API Configuration

### API Integration
The Sensay AI integration provides:
- Natural language processing for customer queries
- Intelligent product recommendation algorithms
- Context-aware conversation management
- Learning capabilities for improved responses

### Configuration Steps
1. Sign up for a Sensay AI account
2. Get your API key from the dashboard
3. Configure the API key in your environment variables

## 🏗️ Project Structure

```
Shoppy-Sensay-Ai/
├── 📁 api/                          # Vercel serverless functions
│   ├── 📄 index.js                 # Main entry point
│   └── 📄 routes.js                # API routes
├── 📁 src/                         # Backend source code
│   ├── 📁 server/                  # Server components
│   │   ├── 🔐 auth.ts             # Authentication logic
│   │   ├── 🗄️ database.ts        # Database connection
│   │   ├── 🛣️ routes.ts          # API routes
│   │   ├── 🤖 sensay-service.ts  # Sensay AI integration
│   │   ├── 🛍️ shopify-service.ts # Shopify integration
│   │   └── 💾 cache.ts           # Cache service
│   ├── ⚙️ config.ts              # Configuration
│   ├── 📄 index.ts                # Main server file
│   └── 📋 types.ts                # TypeScript types
├── 📁 frontend/                    # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/         # React components
│   │   │   ├── 💬 ChatArea.tsx   # Chat interface
│   │   │   ├── 🛒 CartPanel.tsx  # Shopping cart
│   │   │   ├── 🏠 LandingPage.tsx # Landing page
│   │   │   └── 📦 ProductCard.tsx # Product display
│   │   ├── 📁 services/           # API services
│   │   │   └── 🌐 api.ts         # API client
│   │   └── 📁 utils/              # Utility functions
│   └── 📁 public/                 # Static assets
│       └── 🖼️ ShoppyS logo .png  # Logo files
├── 📁 prisma/                      # Database schema
│   ├── 📄 schema.prisma           # Database schema
│   └── 📁 migrations/             # Database migrations
├── 📄 package.json                 # Dependencies and scripts
├── 📄 vercel.json                  # Vercel configuration
└── 📄 README.md                    # This file
```

## 🔧 Development

### Available Scripts

#### Backend Scripts
```bash
npm run dev          # Start development server with auto-reload
npm run build        # Build for production
npm start            # Start production server
npm run vercel-dev   # Start Vercel development server
npm run vercel-deploy # Deploy to Vercel
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

#### Frontend Scripts
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Workflow

1. **Feature Development**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Testing**:
   ```bash
   # Test backend
   npm test
   
   # Test frontend
   cd frontend
   npm test
   ```

3. **Code Quality**:
   ```bash
   # Lint backend
   npm run lint
   
   # Lint frontend
   cd frontend
   npm run lint
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository
```bash
git clone https://github.com/envexx/Shoppy-Sensay-Ai.git
cd Shoppy-Sensay-Ai
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 3. Make Your Changes
- Write clean, readable code
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add amazing feature"
```

### 5. Push to Your Branch
```bash
git push origin feature/amazing-feature
```

### 6. Open a Pull Request
- Provide a clear description of your changes
- Reference any related issues
- Request review from maintainers

### Contribution Guidelines

- **Code Style**: Follow TypeScript and React best practices
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update README and code comments
- **Commits**: Use clear, descriptive commit messages
- **Issues**: Check existing issues before creating new ones

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
npx prisma db push

# Reset database
npx prisma migrate reset
```

#### API Key Issues
- Verify your Sensay API key is correct
- Check Shopify tokens are valid
- Ensure environment variables are set

#### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear frontend dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Reporting Bugs

When reporting bugs, please include:
- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Error Messages**: Full error logs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sensay AI** - For providing the intelligent conversation engine
- **Shopify** - For the comprehensive e-commerce API
- **React Team** - For the amazing frontend framework
- **Node.js Community** - For the robust backend runtime
- **Open Source Contributors** - For the amazing tools and libraries

---

<div align="center">
  <p>
    <strong>Built with ❤️ using React, Node.js, and Sensay AI</strong>
  </p>
  <p>
    <a href="https://shoppy-sensay-ai.vercel.app">Live Demo</a> •
    <a href="https://github.com/envexx/Shoppy-Sensay-Ai/issues">Report Bug</a> •
    <a href="https://github.com/envexx/Shoppy-Sensay-Ai/discussions">Request Feature</a>
  </p>
</div>