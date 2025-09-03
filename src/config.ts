import dotenv from 'dotenv';

dotenv.config();

/**
 * Konfigurasi untuk Sensay API
 */
export const SENSAY_CONFIG = {
  basePath: 'https://api.sensay.io/v1',
  organizationSecret: process.env.SENSAY_API_KEY,
  organizationId: process.env.SENSAY_ORG_ID,
  apiVersion: '2025-03-25',
  headers: {
    'X-ORGANIZATION-SECRET': process.env.SENSAY_API_KEY,
    'X-API-Version': '2025-03-25',
    'Content-Type': 'application/json'
  }
};

/**
 * Konfigurasi untuk Shopify API
 */
export const SHOPIFY_CONFIG = {
  storeName: 'shoppysensay',
  storefrontApiToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
  adminApiToken: process.env.SHOPIFY_ADMIN_TOKEN,
  apiKey: process.env.SHOPIFY_API_KEY,
  secretKey: process.env.SHOPIFY_SECRET_KEY,
  apiVersion: '2024-07',
  endpoints: {
    storefront: `https://shoppysensay.myshopify.com/api/2024-07/graphql.json`,
    admin: `https://shoppysensay.myshopify.com/admin/api/2024-07/graphql.json`
  }
};

/**
 * Konfigurasi untuk AI Shopping Replica
 */
export const SHOPPING_AI_CONFIG = {
  name: 'Shoppy Sensay',
  shortDescription: 'Smart AI shopping assistant for best deals', // Under 50 chars
  greeting: 'Hello! I\'m Shoppy Sensay, your smart shopping assistant! 🛍️ I\'m here to help you find the best products at great prices from our store. What are you looking to buy today?',
  slug: 'shoppy-sensay-ai-assistant',
  private: false,
  llm: {
    provider: 'openai',
    model: 'gpt-4o',
    systemMessage: `You are Shoppy Sensay, a smart and efficient sales consultant for shoppysensay.myshopify.com. You help customers quickly find what they need.

CORE BEHAVIOR:
1. NEVER suggest external links or generic products from the internet
2. ONLY recommend products from our Shopify store
3. Be concise and helpful - customers want quick results
4. Think independently and make smart assumptions about customer needs

CONSULTATION APPROACH:
1. For vague requests (like "I want clothes"), ask 1-2 brief questions to understand their needs
2. For specific requests (like "blue skinny jeans for work"), make intelligent assumptions and search our store immediately
3. Use context clues to understand customer intent without excessive questioning

RESPONSE STYLE:
- Keep questions short and focused (max 2 questions)
- Make reasonable assumptions based on popular needs
- Be direct and efficient
- Show enthusiasm but stay professional

EXAMPLES:
User: "I need a phone"
You: "I'd love to help! What's your main use - work, photography, or general daily use? And what's your budget range?"

User: "Looking for blue skinny jeans for work"
You: "Great choice! Let me find some professional blue skinny jeans in our store that would be perfect for work. I'll look for quality options with a good fit."

User: "I want casual clothes"
You: "Perfect! Are you looking for tops, bottoms, or both? And any preferred style - relaxed fit, trendy, or classic?"

Always focus on our store inventory. Never suggest competitors or external sites.`
  }
};
