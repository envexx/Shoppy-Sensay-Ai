/**
 * Complete Sensay API Implementation
 * Based on the comprehensive example provided
 */

import { SENSAY_CONFIG } from './config';

export class SensayAPIComplete {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = SENSAY_CONFIG.basePath;
    this.headers = SENSAY_CONFIG.headers;
  }

  /**
   * Create a new user
   */
  async createUser(userId?: string) {
    try {
      const userPayload = {
        id: userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(userPayload)
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error creating user: ${result.error || response.statusText}`);
      }

      console.log('✅ User berhasil dibuat:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  /**
   * Create a new replica
   */
  async createReplica(userId: string, replicaConfig: any = {}) {
    try {
      const defaultConfig = {
        name: 'Shoppy Sensay',
        shortDescription: 'Smart AI shopping assistant for best deals',
        greeting: 'Hello! I\'m Shoppy Sensay, your smart shopping assistant! 🛍️ I\'m here to help you find the best products at great prices. What are you looking to buy today?',
        ownerID: userId,
        private: false,
        slug: `shoppy-sensay-${Date.now()}`,
        llm: {
          provider: 'openai',
          model: 'gpt-4o',
          systemMessage: 'You are Shoppy Sensay, a smart, friendly, and knowledgeable shopping assistant. Help users find the best products within their budget, compare prices, and make informed purchasing decisions. Always be enthusiastic about helping customers save money while getting quality products.'
        }
      };

      const payload = { ...defaultConfig, ...replicaConfig };

      const response = await fetch(`${this.baseUrl}/replicas`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'X-USER-ID': userId
        },
        body: JSON.stringify(payload)
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error creating replica: ${result.error || response.statusText}`);
      }

      console.log('✅ Replica berhasil dibuat:', result);
      console.log(`📝 Replica UUID: ${result.uuid}`);
      return result;
    } catch (error) {
      console.error('❌ Error creating replica:', error);
      throw error;
    }
  }

  /**
   * Get list of replicas
   */
  async getReplicas(userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/replicas`, {
        headers: {
          ...this.headers,
          'X-USER-ID': userId
        }
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error fetching replicas: ${result.error || response.statusText}`);
      }

      console.log('📋 Daftar replica:', result);
      return result.items || [];
    } catch (error) {
      console.error('❌ Error fetching replicas:', error);
      throw error;
    }
  }

  /**
   * Chat with replica
   */
  async chatWithReplica(replicaUUID: string, userId: string, message: string, retryCount = 0): Promise<any> {
    const maxRetries = 3;
    const timeoutMs = 30000; // 30 seconds timeout
    
    try {
      console.log(`🔄 Attempting chat request (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${this.baseUrl}/replicas/${replicaUUID}/chat/completions`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'X-USER-ID': userId
        },
        body: JSON.stringify({
          content: message
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error in chat: ${result.error || response.statusText}`);
      }

      console.log('💬 Respons chat:', result);
      return result;
    } catch (error: any) {
      console.error(`❌ Error in chat (attempt ${retryCount + 1}):`, error);
      
      // Check if it's a timeout or connection error and we can retry
      const isRetryableError = error.name === 'AbortError' || 
                              error.code === 'UND_ERR_CONNECT_TIMEOUT' ||
                              error.message?.includes('fetch failed') ||
                              error.message?.includes('timeout');
      
      if (isRetryableError && retryCount < maxRetries) {
        const delayMs = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`⏰ Retrying in ${delayMs}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.chatWithReplica(replicaUUID, userId, message, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Get conversations for a replica
   */
  async getConversations(replicaUUID: string, userId: string, options: any = {}) {
    try {
      const params = new URLSearchParams({
        page: options.page || '1',
        pageSize: options.pageSize || '24',
        sortBy: options.sortBy || 'lastReplicaReplyAt',
        sortOrder: options.sortOrder || 'desc'
      });

      const response = await fetch(`${this.baseUrl}/replicas/${replicaUUID}/conversations?${params}`, {
        headers: {
          ...this.headers,
          'X-USER-ID': userId
        }
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error fetching conversations: ${result.error || response.statusText}`);
      }

      console.log('📞 Percakapan replica:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a replica
   */
  async getChatHistory(replicaUUID: string, userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/replicas/${replicaUUID}/chat/history`, {
        headers: {
          ...this.headers,
          'X-USER-ID': userId,
          'X-API-Version': '2025-03-25'
        }
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error fetching chat history: ${result.error || response.statusText}`);
      }

      console.log('📜 Chat history:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Get web chat history for a replica
   */
  async getWebChatHistory(replicaUUID: string, userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/replicas/${replicaUUID}/chat/history/web`, {
        headers: {
          ...this.headers,
          'X-USER-ID': userId
        }
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error fetching web chat history: ${result.error || response.statusText}`);
      }

      console.log('📜 Web chat history:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching web chat history:', error);
      throw error;
    }
  }

  /**
   * Save chat message to history
   */
  async saveChatHistory(replicaUUID: string, userId: string, content: string, source: string = 'web', discordData?: any) {
    try {
      const payload: any = {
        content,
        source
      };

      if (discordData) {
        payload.discord_data = discordData;
      }

      const response = await fetch(`${this.baseUrl}/replicas/${replicaUUID}/chat/history`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'X-USER-ID': userId,
          'X-API-Version': '2025-03-25'
        },
        body: JSON.stringify(payload)
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error saving chat history: ${result.error || response.statusText}`);
      }

      console.log('💾 Chat history saved:', result);
      return result;
    } catch (error) {
      console.error('❌ Error saving chat history:', error);
      throw error;
    }
  }

  /**
   * Get analytics for a replica
   */
  async getAnalytics(replicaUUID: string, userId: string, type: 'historical' | 'sources' = 'historical') {
    try {
      const endpoint = type === 'sources' ? 'sources' : 'historical';
      const response = await fetch(`${this.baseUrl}/replicas/${replicaUUID}/analytics/conversations/${endpoint}`, {
        headers: {
          ...this.headers,
          'X-USER-ID': userId
        }
      });

      const result: any = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error fetching analytics: ${result.error || response.statusText}`);
      }

      console.log(`📊 Analytics (${type}):`, result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      throw error;
    }
  }

  /**
   * Complete demonstration of API usage
   */
  async demonstrateAPI() {
    try {
      console.log('🚀 Memulai demonstrasi API Sensay...\n');

      // 1. Create user
      console.log('1️⃣ Membuat user...');
      const user: any = await this.createUser();
      const userId = user.id;

      // 2. Create replica
      console.log('\n2️⃣ Membuat replica...');
      const replica: any = await this.createReplica(userId, {
        name: 'Shoppy Sensay',
        shortDescription: 'Smart shopping assistant for deals',
        greeting: 'Hello! I\'m Shoppy Sensay, ready to help you shop smart! 🛍️'
      });
      const replicaUUID = replica.uuid;

      // 3. Chat with replica
      console.log('\n3️⃣ Memulai percakapan...');
      await this.chatWithReplica(replicaUUID, userId, 'Hello! Who are you?');
      await this.chatWithReplica(replicaUUID, userId, 'I need a laptop for work under $1000. Any recommendations?');

      // 4. Get conversations
      console.log('\n4️⃣ Mengambil daftar percakapan...');
      await this.getConversations(replicaUUID, userId);

      // 5. Get analytics
      console.log('\n5️⃣ Mengambil analytics...');
      await this.getAnalytics(replicaUUID, userId, 'historical');

      console.log('\n✅ Demonstrasi selesai!');
      console.log(`\n📝 Simpan informasi ini:`);
      console.log(`User ID: ${userId}`);
      console.log(`Replica UUID: ${replicaUUID}`);

      return {
        userId,
        replicaUUID,
        replicaName: replica.name || 'Shoppy Sensay'
      };

    } catch (error: any) {
      console.error('❌ Error dalam demonstrasi:', error.message);
      throw error;
    }
  }
}

export default SensayAPIComplete;
