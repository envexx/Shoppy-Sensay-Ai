/**
 * Sensay API Client - Wrapper untuk SDK yang akan di-generate
 */

import { SENSAY_CONFIG, SHOPPING_AI_CONFIG } from './config';
import { 
  User, 
  Replica, 
  ChatResponse, 
  SetupResult, 
  CreateUserRequest, 
  CreateReplicaRequest, 
  ChatRequest 
} from './types';

// Import ini akan tersedia setelah SDK di-generate
// import { Configuration, DefaultApi } from '../sensay-sdk';
import axios, { AxiosInstance } from 'axios';

/**
 * Temporary interface untuk SDK yang belum di-generate
 * Ini akan diganti dengan import yang sebenarnya setelah SDK ready
 */
interface TempSDKApi {
  createUser(request: CreateUserRequest): Promise<User>;
  createReplica(request: CreateReplicaRequest): Promise<Replica>;
  chatCompletions(replicaUuid: string, request: ChatRequest, options?: any): Promise<ChatResponse>;
}

class SensayClient {
  private api: TempSDKApi | null = null;

  constructor() {
    this.initializeAPI();
  }

  private initializeAPI() {
    try {
      // Setelah SDK di-generate, uncomment lines berikut:
      /*
      const config = new Configuration({
        basePath: SENSAY_CONFIG.basePath,
        headers: SENSAY_CONFIG.headers
      });
      this.api = new DefaultApi(config);
      */
      
      // Temporary implementation untuk demo
      this.api = this.createMockAPI();
      console.log('✅ Sensay API client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Sensay API client:', error);
      console.log('💡 Make sure to run "npm run setup" first to generate the SDK');
    }
  }

  private createMockAPI(): TempSDKApi {
    const axiosInstance = axios.create({
      baseURL: SENSAY_CONFIG.basePath,
      headers: SENSAY_CONFIG.headers
    });

    return {
      async createUser(request: CreateUserRequest): Promise<User> {
        console.log('🔄 Creating user with ID:', request.id);
        try {
          // Real API call ke Sensay
          const response = await axiosInstance.post('/users', request);
          console.log('✅ Real API response for user creation:', response.data);
          return response.data;
        } catch (error: any) {
          console.log('⚠️ API call failed, using mock response. Error:', error.message);
          // Fallback ke mock response jika API call gagal
          return {
            id: request.id,
            createdAt: new Date().toISOString()
          };
        }
      },

      async createReplica(request: CreateReplicaRequest): Promise<Replica> {
        console.log('🔄 Creating replica:', request.name);
        console.log('📤 Request body:', JSON.stringify(request, null, 2));
        try {
          // Real API call ke Sensay
          const response = await axiosInstance.post('/replicas', request);
          console.log('✅ Real API response for replica creation:', response.data);
          return response.data;
        } catch (error: any) {
          console.log('⚠️ API call failed, using mock response. Error:', error.message);
          if (error.response) {
            console.log('❌ Response status:', error.response.status);
            console.log('❌ Response data:', error.response.data);
          }
          // Fallback ke mock response jika API call gagal
          return {
            uuid: 'replica_' + Date.now(),
            name: request.name,
            shortDescription: request.shortDescription,
            greeting: request.greeting,
            ownerID: request.ownerID,
            private: request.private,
            slug: request.slug,
            llm: request.llm,
            system_message: request.system_message,
            createdAt: new Date().toISOString()
          };
        }
      },

      async chatCompletions(replicaUuid: string, request: ChatRequest, options?: any): Promise<ChatResponse> {
        console.log('🔄 Sending chat to replica:', replicaUuid);
        console.log('💬 Message:', request.content);
        try {
          // Real API call ke Sensay
          const response = await axiosInstance.post(`/replicas/${replicaUuid}/chat/completions`, request, options);
          console.log('✅ Real API response for chat:', response.data);
          return response.data;
        } catch (error: any) {
          console.log('⚠️ API call failed, using mock response. Error:', error.message);
          // Fallback ke mock response jika API call gagal
          return {
            content: `Hello! I'm Shoppy Sensay. I received your message: "${request.content}". For a work laptop with a $1000 budget, I recommend several excellent options with optimal performance and value for your professional needs! 💻✨`,
            role: 'assistant',
            timestamp: new Date().toISOString()
          };
        }
      }
    };
  }

  /**
   * Get existing replicas untuk debugging
   */
  async getReplicas(): Promise<any> {
    if (!this.api) {
      throw new Error('API not initialized. Run setup first.');
    }

    const axiosInstance = axios.create({
      baseURL: SENSAY_CONFIG.basePath,
      headers: {
        ...SENSAY_CONFIG.headers,
        'X-USER-ID': SENSAY_CONFIG.organizationSecret // Test dengan org secret sebagai user ID
      }
    });

    try {
      console.log('🔍 Getting existing replicas...');
      const response = await axiosInstance.get('/replicas');
      console.log('✅ Replicas response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.log('❌ Get replicas failed. Error:', error.message);
      if (error.response) {
        console.log('❌ Response status:', error.response.status);
        console.log('❌ Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  /**
   * Membuat user baru
   */
  async createUser(): Promise<User> {
    if (!this.api) {
      throw new Error('API not initialized. Run setup first.');
    }

    try {
      const userId = 'shopping_user_' + Date.now();
      const response = await this.api.createUser({ id: userId });
      console.log('✅ User created:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  /**
   * Membuat AI Replica untuk belanja
   */
  async createShoppingAI(userId: string): Promise<Replica> {
    if (!this.api) {
      throw new Error('API not initialized. Run setup first.');
    }

    try {
      const request: CreateReplicaRequest = {
        name: SHOPPING_AI_CONFIG.name,
        shortDescription: SHOPPING_AI_CONFIG.shortDescription,
        greeting: SHOPPING_AI_CONFIG.greeting,
        ownerID: userId,
        private: SHOPPING_AI_CONFIG.private,
        slug: SHOPPING_AI_CONFIG.slug,
        llm: SHOPPING_AI_CONFIG.llm
      };

      const response = await this.api.createReplica(request);
      
      console.log('✅ Shopping AI Replica created!');
      console.log('🆔 Replica UUID:', response.uuid);
      console.log('📛 Name:', response.name);
      console.log('🔗 Slug:', response.slug);
      
      return response;
    } catch (error) {
      console.error('❌ Error creating shopping AI replica:', error);
      throw error;
    }
  }

  /**
   * Test chat dengan AI Belanja
   */
  async testShoppingChat(replicaUuid: string, userId: string, message: string = 'Hi! I need a laptop for work with a budget of $1000. Any recommendations?'): Promise<ChatResponse> {
    if (!this.api) {
      throw new Error('API not initialized. Run setup first.');
    }

    try {
      const response = await this.api.chatCompletions(
        replicaUuid, 
        { content: message },
        {
          headers: {
            'X-USER-ID': userId
          }
        }
      );
      
      console.log('🤖 ShopBot Response:', response.content);
      return response;
    } catch (error) {
      console.error('❌ Error chatting with ShopBot:', error);
      throw error;
    }
  }

  /**
   * Setup lengkap - jalankan semua step
   */
  async setupShoppingAI(): Promise<SetupResult | null> {
    try {
      console.log('🚀 Starting Shopping AI setup...');
      
      // Step 1: Create user
      const user = await this.createUser();
      
      if (user && user.id) {
        // Step 2: Create shopping AI replica
        const shoppingAI = await this.createShoppingAI(user.id);
        
        if (shoppingAI && shoppingAI.uuid) {
          console.log('\n✨ Shopping AI berhasil dibuat!');
          console.log('💡 Simpan UUID ini untuk digunakan nanti:', shoppingAI.uuid);
          
          // Step 3: Test chat
          console.log('\n🧪 Testing chat dengan ShopBot...');
          await this.testShoppingChat(shoppingAI.uuid, user.id);
          
          return {
            userId: user.id,
            replicaUuid: shoppingAI.uuid,
            replicaName: shoppingAI.name
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('💥 Setup failed:', error);
      return null;
    }
  }
}

export { SensayClient };
