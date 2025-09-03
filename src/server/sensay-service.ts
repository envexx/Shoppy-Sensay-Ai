import { SensayAPIComplete } from '../sensay-api-complete';
import { prisma } from './database';
import ShopifyService from './shopify-service';
import dotenv from 'dotenv';

dotenv.config();

export class SensayService {
  private sensayAPI: SensayAPIComplete;
  private shopifyService: ShopifyService;
  private replicaUUID: string;

  constructor() {
    this.sensayAPI = new SensayAPIComplete();
    this.shopifyService = new ShopifyService();
    this.replicaUUID = process.env.SENSAY_REPLICA_UUID || '50039859-1408-4152-b6ec-1c0fde91cd87';
  }

  /**
   * Get or create Sensay user ID for our app user
   */
  async getOrCreateSensayUser(userId: string): Promise<string> {
    try {
      // Check if user already has Sensay user ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { sensayUserId: true, username: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.sensayUserId) {
        return user.sensayUserId;
      }

      // Create new Sensay user
      console.log('Creating new Sensay user for:', user.username);
      const sensayUser = await this.sensayAPI.createUser(`customer_${userId}_${Date.now()}`);
      
      // Update our user with Sensay user ID
      await prisma.user.update({
        where: { id: userId },
        data: { sensayUserId: sensayUser.id }
      });

      // Log API usage
      await this.logApiUsage(userId, 'create_user', { userId }, sensayUser);

      return sensayUser.id;
    } catch (error) {
      console.error('Error getting/creating Sensay user:', error);
      await this.logApiUsage(userId, 'create_user', { userId }, null, false, (error as Error).message);
      throw error;
    }
  }

  /**
   * Send chat message to Shoppy Sensay
   */
  async sendChatMessage(userId: string, message: string, isNewChat: boolean = false, sessionId?: string): Promise<any> {
    try {
      console.log('=== SEND CHAT MESSAGE START ===');
      console.log('User ID:', userId);
      console.log('Message:', message);
      console.log('Is New Chat:', isNewChat);
      console.log('Session ID:', sessionId);
      console.log('Message length:', message.length);
      console.log('Message type:', typeof message);
      // Get Sensay user ID
      const sensayUserId = await this.getOrCreateSensayUser(userId);

      // Enhanced message with Shopify product context
      let enhancedMessage = message;
      let shopifyProducts: any[] = [];

      // Define product keywords for detection
      const productKeywords = ['phone', 'smartphone', 'laptop', 'computer', 'shoes', 'bag', 'watch', 'shirt', 'clothes', 'electronics'];
      const findKeywords = ['find', 'looking for', 'want', 'need', 'show me', 'search'];

      // Detect SPECIFIC product search intent (when user gives detailed requirements OR after conversation)
      const specificSearchIndicators = [
        'show me', 'tampilkan', 'cari yang', 'search for', 'find me',
        'dengan budget', 'with budget', 'harga', 'price range', 'under', 'di bawah',
        'beli sekarang', 'buy now', 'add to cart', 'tambah ke keranjang',
        'rekomendasi', 'recommend', 'suggest', 'pilihkan', 'i want to buy',
        'looking for with', 'need something with', 'budget of', 'around'
      ];

      // Check for specific search intent
      const hasSpecificIntent = specificSearchIndicators.some(indicator => 
        message.toLowerCase().includes(indicator.toLowerCase())
      );

      // Check if message contains detailed requirements (longer, more specific)
      const hasDetailedRequirements = message.length > 25 && (
        message.toLowerCase().includes('untuk') || 
        message.toLowerCase().includes('for') ||
        message.toLowerCase().includes('gaming') ||
        message.toLowerCase().includes('photography') ||
        message.toLowerCase().includes('business') ||
        message.toLowerCase().includes('budget') ||
        message.toLowerCase().includes('range') ||
        message.toLowerCase().includes('style') ||
        message.toLowerCase().includes('work') ||
        message.toLowerCase().includes('daily') ||
        message.toLowerCase().includes('professional')
      );

      // Check if user is providing answers to consultation questions
      const isAnsweringQuestions = message.toLowerCase().includes('mainly') ||
        message.toLowerCase().includes('mostly') ||
        (message.includes('$') && message.includes('-')) ||
        (message.toLowerCase().includes('rp') && (message.includes('-') || message.includes('juta'))) ||
        message.toLowerCase().includes('prefer') ||
        message.toLowerCase().includes('important') ||
        message.toLowerCase().includes('need it for');

      // Check for follow-up questions that should maintain context
      const followUpIndicators = [
        'is there any other', 'are there any other', 'any other option', 'any other choice',
        'what else', 'anything else', 'other options', 'other choices', 'alternatives',
        'show me more', 'more options', 'different', 'another', 'else',
        'how about', 'what about', 'can you show', 'do you have',
        'any more', 'more of', 'similar', 'like this', 'comparable'
      ];

      const isFollowUpQuestion = followUpIndicators.some(indicator => 
        message.toLowerCase().includes(indicator.toLowerCase())
      );

      // Check for purchase intent
      const purchaseIndicators = [
        'i want to buy', 'i want to order', 'i want to purchase', 'i want to get',
        'i would like to buy', 'i would like to order', 'i would like to purchase',
        'i need to buy', 'i need to order', 'i need to purchase',
        'saya ingin membeli', 'saya ingin memesan', 'saya ingin order',
        'saya mau beli', 'saya mau pesan', 'saya mau order',
        'beli', 'pesan', 'order', 'ambil', 'dapatkan',
        'add to cart', 'tambah ke keranjang', 'masukkan ke keranjang',
        'buy this', 'order this', 'purchase this', 'get this',
        'i want this', 'i want that', 'i want it', 'i want one',
        'i want the', 'i want a', 'i want an',
        'i\'ll take', 'i\'ll get', 'i\'ll buy', 'i\'ll order',
        'i\'ll have', 'i\'ll purchase', 'i\'ll grab',
        'take this', 'get this', 'have this', 'grab this',
        'yes', 'sure', 'okay', 'ok', 'alright', 'deal',
        'i\'ll take it', 'i\'ll get it', 'i\'ll buy it',
        'add it', 'put it in', 'add to my cart'
      ];

      const isPurchaseIntent = purchaseIndicators.some(indicator => 
        message.toLowerCase().includes(indicator.toLowerCase())
      );
      
      console.log('Intent detection:', {
        message: message,
        isPurchaseIntent: isPurchaseIntent,
        matchedPurchaseIndicators: purchaseIndicators.filter(indicator => 
          message.toLowerCase().includes(indicator.toLowerCase())
        )
      });

      // Check for quantity in message (e.g., "2 buah", "3 pieces", "five items", "1 item")
      const quantityPattern = /(\d+)\s*(buah|pieces?|items?|pcs?|unit|satuan|item)/i;
      const quantityMatch = message.match(quantityPattern);
      const requestedQuantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

      // Check for purchase history inquiry
      const historyIndicators = [
        'have i bought', 'have i purchased', 'have i ordered', 'did i buy', 'did i purchase',
        'sudah pernah beli', 'sudah pernah pesan', 'sudah pernah order',
        'riwayat pembelian', 'purchase history', 'order history', 'buying history',
        'what did i buy', 'what have i bought', 'my purchases', 'my orders'
      ];

      const isHistoryInquiry = historyIndicators.some(indicator => 
        message.toLowerCase().includes(indicator.toLowerCase())
      );

      // Check for specific product history inquiry (e.g., "have I bought this shirt before?")
      const specificProductHistoryIndicators = [
        'have i bought this', 'have i purchased this', 'did i buy this', 'did i purchase this',
        'sudah pernah beli ini', 'sudah pernah pesan ini', 'sudah pernah order ini',
        'pernah beli', 'pernah pesan', 'pernah order', 'bought before', 'purchased before'
      ];

      const isSpecificProductHistoryInquiry = specificProductHistoryIndicators.some(indicator => 
        message.toLowerCase().includes(indicator.toLowerCase())
      );

      // Check for cart management queries
      const cartManagementIndicators = [
        'how much', 'how many', 'what\'s in my cart', 'what is in my cart',
        'show my cart', 'my cart', 'cart items', 'cart contents',
        'remove', 'delete', 'reduce', 'decrease', 'kurangi', 'hapus',
        'i don\'t want', 'i don\'t need', 'cancel', 'batal',
        'change quantity', 'update quantity', 'modify quantity'
      ];

      const isCartManagement = cartManagementIndicators.some(indicator => 
        message.toLowerCase().includes(indicator.toLowerCase())
      );

      const isProductSearch = hasSpecificIntent || hasDetailedRequirements || isAnsweringQuestions || isFollowUpQuestion;
      const needsSystemAction = isPurchaseIntent || isHistoryInquiry || isSpecificProductHistoryInquiry || isCartManagement;
      
      console.log('Complete intent analysis:', {
        message: message,
        isPurchaseIntent: isPurchaseIntent,
        isCartManagement: isCartManagement,
        isProductSearch: isProductSearch,
        needsSystemAction: needsSystemAction,
        matchedPurchaseIndicators: purchaseIndicators.filter(indicator => 
          message.toLowerCase().includes(indicator.toLowerCase())
        ),
        matchedCartIndicators: cartManagementIndicators.filter(indicator => 
          message.toLowerCase().includes(indicator.toLowerCase())
        )
      });
      
      // Always send to Sensay API with system data for natural decision making
      let systemData = '';
      let systemContext = '';
      
      // Get temp session for system actions
      let tempChatSession = null;
      if (needsSystemAction && !isNewChat) {
        if (sessionId) {
          tempChatSession = await prisma.chatSession.findFirst({
            where: { 
              id: sessionId,
              userId 
            }
          });
        } else {
          tempChatSession = await prisma.chatSession.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
          });
        }
      }
      
      // Gather system data if needed
      if (needsSystemAction) {
        try {
          if (isPurchaseIntent) {
            // Get product from conversation context
            let productToAdd = null;
            if (tempChatSession) {
              const recentMessages = await prisma.chatMessage.findMany({
                where: { sessionId: tempChatSession.id },
                orderBy: { timestamp: 'desc' },
                take: 10,
                select: { content: true, role: true, shopifyProducts: true }
              });

              for (const msg of recentMessages) {
                if (msg.role === 'assistant' && msg.shopifyProducts) {
                  const products = Array.isArray(msg.shopifyProducts) ? msg.shopifyProducts : [msg.shopifyProducts];
                  if (products.length > 0) {
                    productToAdd = products[0] as any;
                    break;
                  }
                }
              }
            }

            if (productToAdd) {
              systemData = `[SYSTEM DATA - PURCHASE INTENT DETECTED]
Product: ${productToAdd.title}
Quantity: ${requestedQuantity}
Price: ${productToAdd.priceRange.minVariantPrice.amount} ${productToAdd.priceRange.minVariantPrice.currencyCode}
Description: ${productToAdd.description}
Product ID: ${productToAdd.id}
Handle: ${productToAdd.handle}

[SYSTEM ACTION AVAILABLE: Add to cart automatically if user confirms purchase intent]`;
            } else {
              systemData = `[SYSTEM DATA - PURCHASE INTENT DETECTED]
No specific product found in conversation context.
User message: "${message}"
Detected quantity: ${requestedQuantity}

[SYSTEM ACTION: Ask user to specify which product they want to purchase]`;
            }
          } else if (isHistoryInquiry) {
            const purchaseHistory = await prisma.purchaseHistory.findMany({
              where: { userId },
              orderBy: { purchaseDate: 'desc' },
              take: 10
            });

            if (purchaseHistory.length > 0) {
              const historyData = purchaseHistory.map((purchase, index) => {
                const date = new Date(purchase.purchaseDate).toLocaleDateString();
                return `${index + 1}. Product: ${purchase.productName}, Quantity: ${purchase.quantity}, Date: ${date}, Price: ${purchase.price}`;
              }).join('\n');

              systemData = `[SYSTEM DATA - PURCHASE HISTORY]
Total purchases: ${purchaseHistory.length}
Recent purchases:
${historyData}

[SYSTEM ACTION: Provide natural response about user's purchase history]`;
            } else {
              systemData = `[SYSTEM DATA - PURCHASE HISTORY]
No purchase history found for this user.

[SYSTEM ACTION: Encourage user to start shopping]`;
            }
          } else if (isSpecificProductHistoryInquiry) {
            let productToCheck = null;
            
            if (tempChatSession) {
              const recentMessages = await prisma.chatMessage.findMany({
                where: { sessionId: tempChatSession.id },
                orderBy: { timestamp: 'desc' },
                take: 10,
                select: { content: true, role: true, shopifyProducts: true }
              });

              for (const msg of recentMessages) {
                if (msg.role === 'assistant' && msg.shopifyProducts) {
                  const products = Array.isArray(msg.shopifyProducts) ? msg.shopifyProducts : [msg.shopifyProducts];
                  if (products.length > 0) {
                    productToCheck = products[0] as any;
                    break;
                  }
                }
              }
            }

            if (productToCheck) {
              const productHistory = await prisma.purchaseHistory.findMany({
                where: { 
                  userId: userId,
                  productName: {
                    contains: productToCheck.title,
                    mode: 'insensitive'
                  }
                },
                orderBy: { purchaseDate: 'desc' }
              });

              if (productHistory.length > 0) {
                const totalQuantity = productHistory.reduce((sum, purchase) => sum + purchase.quantity, 0);
                const lastPurchase = productHistory[0];
                const lastPurchaseDate = new Date(lastPurchase.purchaseDate).toLocaleDateString();

                systemData = `[SYSTEM DATA - SPECIFIC PRODUCT HISTORY]
Product: ${productToCheck.title}
Has been purchased: YES
Total times purchased: ${productHistory.length}
Total quantity bought: ${totalQuantity}
Last purchase date: ${lastPurchaseDate}
Last purchase quantity: ${lastPurchase.quantity}

[SYSTEM ACTION: Confirm that user has purchased this product before and provide details]`;
              } else {
                systemData = `[SYSTEM DATA - SPECIFIC PRODUCT HISTORY]
Product: ${productToCheck.title}
Has been purchased: NO
This would be their first time buying this item.

[SYSTEM ACTION: Inform user they haven't purchased this product before]`;
              }
            } else {
              systemData = `[SYSTEM DATA - SPECIFIC PRODUCT HISTORY]
No specific product found in conversation context.
User message: "${message}"

[SYSTEM ACTION: Ask user to specify which product they want to check]`;
            }
          } else if (isCartManagement) {
            // Get current cart items
            const cartItems = await prisma.cartItem.findMany({
              where: { userId },
              orderBy: { createdAt: 'desc' }
            });

            if (cartItems.length > 0) {
              const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
              const cartData = cartItems.map((item, index) => {
                return `${index + 1}. ${item.productName} - Quantity: ${item.quantity}, Price: $${item.price}, Total: $${item.total}`;
              }).join('\n');

              systemData = `[SYSTEM DATA - CART MANAGEMENT]
Current cart items: ${cartItems.length}
Total cart value: $${cartTotal}
Cart contents:
${cartData}

[SYSTEM ACTION: Provide natural response about cart contents. If user wants to remove/reduce items, ask for confirmation and provide options.]`;
            } else {
              systemData = `[SYSTEM DATA - CART MANAGEMENT]
Cart is empty.

[SYSTEM ACTION: Inform user that their cart is empty and suggest browsing products.]`;
            }
          }
          
          systemContext = `\n\n${systemData}\n\n[SYSTEM INSTRUCTION: Based on the system data above, provide a natural, conversational response. If this is a purchase intent, only add to cart if the user clearly wants to buy. If this is a history inquiry, provide helpful information about their purchase history. Make the conversation feel natural and human-like. Do not use hardcoded responses - be conversational and natural.]`;
        } catch (error) {
          console.error('Error gathering system data:', error);
        }
      }

      // Initialize response variable
      let response: any;

      // Get conversation context early for use in both product search and regular chat
      let conversationContext = '';
      
      // We need to get the session first to retrieve conversation context
      if (!isNewChat) {
        if (sessionId) {
          tempChatSession = await prisma.chatSession.findFirst({
            where: { 
              id: sessionId,
              userId 
            }
          });
        } else {
          tempChatSession = await prisma.chatSession.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
          });
        }
        
        if (tempChatSession) {
          const recentMessages = await prisma.chatMessage.findMany({
            where: { sessionId: tempChatSession.id },
            orderBy: { timestamp: 'desc' },
            take: 15, // Last 15 messages
            select: {
              role: true,
              content: true,
              timestamp: true
            }
          });

          if (recentMessages.length > 0) {
            // Reverse to get chronological order
            const contextMessages = recentMessages.reverse();
            conversationContext = '\n\n[CONVERSATION CONTEXT - Last 15 messages for context:]\n';
            
            contextMessages.forEach(msg => {
              const role = msg.role === 'user' ? 'User' : 'Assistant';
              conversationContext += `${role}: ${msg.content}\n`;
            });
            
            conversationContext += '[END CONTEXT]\n';
            console.log('Added conversation context with', contextMessages.length, 'messages');
          }
        }
      }

      // Send to Sensay API with system data for natural decision making
      if (needsSystemAction) {
        // Send enhanced message to Sensay API with system data
        const enhancedMessage = `${message}${conversationContext}${systemContext}`;
        
        response = await this.sensayAPI.chatWithReplica(
          this.replicaUUID,
          sensayUserId,
          enhancedMessage
        );
        
        console.log('Sensay API response received:', {
          hasContent: !!response.content,
          contentLength: response.content?.length || 0,
          contentPreview: response.content?.substring(0, 100) + '...',
          fullResponse: response
        });

        // If Sensay API indicates a purchase should be made, execute it
        console.log('🔍 Purchase intent execution check:', {
          isPurchaseIntent: isPurchaseIntent,
          hasResponseContent: !!response.content,
          responseContent: response.content,
          willExecute: isPurchaseIntent && response.content
        });
        
        if (isPurchaseIntent && response.content) {
          console.log('✅ Purchase intent conditions met, proceeding with execution...');
          const responseText = response.content.toLowerCase();
          const shouldAddToCart = (
            responseText.includes('added to cart') || 
            responseText.includes('successfully added') ||
            responseText.includes('cart updated') ||
            responseText.includes('added to your cart') ||
            responseText.includes('i\'ll add') ||
            responseText.includes('i will add') ||
            responseText.includes('adding to cart') ||
            responseText.includes('add another') ||
            responseText.includes('add to your cart') ||
            responseText.includes('great choice') ||
            responseText.includes('perfect') ||
            responseText.includes('enjoy your shopping') ||
            responseText.includes('enjoy your new') ||
            responseText.includes('🛒') ||
            responseText.includes('cart') ||
            (responseText.includes('add') && responseText.includes('cart')) ||
            (responseText.includes('added') && responseText.includes('collection')) ||
            (responseText.includes('burgundy') && responseText.includes('tee')) ||
            (responseText.includes('statement') && responseText.includes('tee'))
          );
          
          console.log('Response analysis:', {
            responseText: response.content,
            shouldAddToCart: shouldAddToCart,
            isPurchaseIntent: isPurchaseIntent
          });
          
          if (shouldAddToCart) {
            console.log('✅ Sensay API response indicates purchase intent, adding to cart...');
            console.log('Response text:', response.content);
            
            // Extract product and add to cart
            let productToAdd = null;
            if (tempChatSession) {
              const recentMessages = await prisma.chatMessage.findMany({
                where: { sessionId: tempChatSession.id },
                orderBy: { timestamp: 'desc' },
                take: 10,
                select: { content: true, role: true, shopifyProducts: true }
              });

              for (const msg of recentMessages) {
                if (msg.role === 'assistant' && msg.shopifyProducts) {
                  const products = Array.isArray(msg.shopifyProducts) ? msg.shopifyProducts : [msg.shopifyProducts];
                  if (products.length > 0) {
                    productToAdd = products[0] as any;
                    break;
                  }
                }
              }
            }

            if (productToAdd) {
              try {
                console.log('Adding product to cart:', {
                  productId: productToAdd.id,
                  productName: productToAdd.title,
                  quantity: requestedQuantity,
                  price: productToAdd.priceRange.minVariantPrice.amount
                });
                
                await prisma.cartItem.create({
                  data: {
                    userId: userId,
                    productId: productToAdd.id,
                    productName: productToAdd.title,
                    description: productToAdd.description,
                    price: parseFloat(productToAdd.priceRange.minVariantPrice.amount),
                    quantity: requestedQuantity,
                    total: parseFloat(productToAdd.priceRange.minVariantPrice.amount) * requestedQuantity,
                    imageUrl: productToAdd.images?.edges?.[0]?.node?.url,
                    productUrl: `https://shoppysensay.myshopify.com/products/${productToAdd.handle}`
                  }
                });
                console.log('✅ Product successfully added to cart based on Sensay API decision');
              } catch (error) {
                console.error('❌ Error adding to cart:', error);
              }
            } else {
              console.log('❌ No product found in conversation context for cart addition');
            }
          } else {
            console.log('❌ Sensay API response does not indicate purchase intent');
            console.log('Response text:', response.content);
          }
        } else {
          console.log('❌ Purchase intent conditions not met:', {
            isPurchaseIntent: isPurchaseIntent,
            hasResponseContent: !!response.content,
            reason: !isPurchaseIntent ? 'No purchase intent detected' : 'No response content'
          });
        }
      } else if (isCartManagement && response.content) {
        console.log('🔍 Checking if cart management action should be executed...');
        const responseText = response.content.toLowerCase();
        
        // Check if response indicates cart reduction/removal
        const shouldReduceCart = (
          responseText.includes('removed') ||
          responseText.includes('deleted') ||
          responseText.includes('reduced') ||
          responseText.includes('updated') ||
          responseText.includes('changed') ||
          responseText.includes('modified') ||
          responseText.includes('kurangi') ||
          responseText.includes('hapus') ||
          responseText.includes('berkurang')
        );
        
        console.log('Cart management response analysis:', {
          responseText: response.content,
          shouldReduceCart: shouldReduceCart,
          isCartManagement: isCartManagement
        });
        
        if (shouldReduceCart) {
          console.log('✅ Sensay API response indicates cart management action...');
          
          // Get current cart items
          const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
          });
          
          if (cartItems.length > 0) {
            // For now, remove the most recent item (this can be made more sophisticated)
            const itemToRemove = cartItems[0];
            console.log('Removing item from cart:', {
              itemId: itemToRemove.id,
              productName: itemToRemove.productName,
              quantity: itemToRemove.quantity
            });
            
            try {
              await prisma.cartItem.delete({
                where: { id: itemToRemove.id }
              });
              console.log('✅ Item successfully removed from cart');
            } catch (error) {
              console.error('❌ Error removing item from cart:', error);
            }
          } else {
            console.log('❌ No items in cart to remove');
          }
        }
      } else {
        console.log('❌ No purchase intent or cart management detected in message:', message);
      }
      
      if (isProductSearch) {
        try {
          console.log(`Detected product search intent: "${message}"`);
          
          // For follow-up questions, enhance search with conversation context
          let searchQuery = message;
          if (isFollowUpQuestion && !isNewChat) {
            // Get recent conversation to understand what product category user is asking about
            const recentMessages = await prisma.chatMessage.findMany({
              where: { 
                sessionId: (await prisma.chatSession.findFirst({
                  where: { userId },
                  orderBy: { updatedAt: 'desc' }
                }))?.id
              },
              orderBy: { timestamp: 'desc' },
              take: 10,
              select: { content: true, role: true }
            });

            // Extract product keywords from recent conversation
            const conversationText = recentMessages.map(msg => msg.content).join(' ');
            const productKeywords = ['t-shirt', 'shirt', 'phone', 'smartphone', 'laptop', 'computer', 'shoes', 'bag', 'watch', 'clothes', 'electronics'];
            const foundKeywords = productKeywords.filter(keyword => 
              conversationText.toLowerCase().includes(keyword.toLowerCase())
            );

            if (foundKeywords.length > 0) {
              searchQuery = `${foundKeywords[0]} ${message}`;
              console.log(`Enhanced follow-up search with context: "${searchQuery}"`);
            }
          }
          
          // Search for products in Shopify using the enhanced query
          const searchResults = await this.shopifyService.searchProducts(searchQuery, 5);
          shopifyProducts = searchResults;

          // Instead of hardcoded response, let Sensay API generate contextual response with product data
          const productData = searchResults.length > 0 ? 
            searchResults.map((product, index) => {
              const price = this.shopifyService.formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              );
              return `${index + 1}. **${product.title}** - ${price}`;
            }).join('\n') : 'No products found matching your criteria.';

          // Create enhanced message with product data and context for Sensay API
          const enhancedSearchMessage = `${message}${conversationContext}

[PRODUCT SEARCH RESULTS - ${searchResults.length} products found:]
${productData}

[SYSTEM: Based on the conversation context above and the product search results, provide a natural, contextual response. If this is a follow-up question like "is there any other option", acknowledge what was previously discussed and offer relevant alternatives or additional information about the products shown.]`;

          console.log(`Sending enhanced search message to Sensay API with ${searchResults.length} products`);
          response = await this.sensayAPI.chatWithReplica(
            this.replicaUUID,
            sensayUserId,
            enhancedSearchMessage
          );
            
            console.log(`Found ${searchResults.length} products for search: "${message}"`);
        } catch (error) {
          console.error('Error searching Shopify products:', error);
          // Fall back to Sensay API if Shopify search fails
          const fallbackMessage = `${message}${conversationContext}\n\n[SYSTEM: Shopify search temporarily unavailable, provide general assistance based on conversation context]`;
          response = await this.sensayAPI.chatWithReplica(
            this.replicaUUID,
            sensayUserId,
            fallbackMessage
          );
        }
      } else {
        // Send message to Sensay with conversation context
        const messageWithContext = enhancedMessage + conversationContext;
        console.log(`Sending message to Shoppy Sensay for user ${userId}:`, message);
        console.log(`Message includes conversation context: ${conversationContext ? 'Yes' : 'No'}`);
        
        // Add system instruction for better context understanding
        const contextualMessage = messageWithContext + 
          (conversationContext ? '\n\n[SYSTEM: Use the conversation context above to provide relevant and contextual responses. Remember what the user was previously discussing.]' : '');
        
        response = await this.sensayAPI.chatWithReplica(
          this.replicaUUID,
          sensayUserId,
          contextualMessage
        );
      }

      // Handle chat session based on request type
      let chatSession;
      
      if (isNewChat) {
        // Always create new session for new chat
        chatSession = await prisma.chatSession.create({
          data: { userId }
        });
        console.log('Created new chat session:', chatSession.id);
      } else if (sessionId) {
        // Use existing session if specified
        chatSession = await prisma.chatSession.findFirst({
          where: { 
            id: sessionId,
            userId 
          }
        });
        
        if (!chatSession) {
          // Session not found or doesn't belong to user, create new one
          chatSession = await prisma.chatSession.create({
            data: { userId }
          });
          console.log('Session not found, created new session:', chatSession.id);
        } else {
          console.log('Using existing session:', chatSession.id);
        }
      } else {
        // No sessionId provided and not new chat - this should not happen in normal flow
        // Get most recent session as fallback, but log this as potential issue
        console.warn('No sessionId provided for non-new chat. This may indicate a frontend issue.');
        chatSession = await prisma.chatSession.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' }
        });
        
        if (!chatSession) {
          // No existing sessions, create new one
          chatSession = await prisma.chatSession.create({
            data: { userId }
          });
          console.log('No existing sessions, created new session:', chatSession.id);
        } else {
          console.log('Using most recent session as fallback:', chatSession.id);
        }
      }

      // Conversation context is already retrieved above for both product search and regular chat

      // Extract link from message if present
      const linkRegex = /(https?:\/\/[^\s]+)/g;
      const detectedLink = message.match(linkRegex)?.[0] || null;

      console.log('Saving messages to database...');
      console.log('Session ID:', chatSession.id);
      console.log('User message:', message);
      console.log('AI response:', response.content);

      try {
        console.log('Attempting to save user message...');
        // Save user message
        const userMessage = await prisma.chatMessage.create({
          data: {
            sessionId: chatSession.id,
            role: 'user',
            content: message,
            link: detectedLink
          }
        });
        console.log('✅ User message saved with ID:', userMessage.id);

        console.log('Attempting to save AI message...');
        // Save AI response with Shopify products data
        const aiMessage = await prisma.chatMessage.create({
          data: {
            sessionId: chatSession.id,
            role: 'assistant',
            content: response.content,
            sensayResponse: response,
            shopifyProducts: shopifyProducts.length > 0 ? shopifyProducts : undefined
          }
        });
        console.log('✅ AI message saved with ID:', aiMessage.id);
        console.log('✅ Both messages saved successfully to database');
      } catch (saveError: any) {
        console.error('❌ Error saving messages to database:', saveError);
        console.error('Save error details:', {
          message: saveError.message,
          code: saveError.code,
          stack: saveError.stack
        });
        // Continue execution even if saving fails
      }

      // Update session timestamp
      console.log('Updating session timestamp...');
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: { updatedAt: new Date() }
      });
      console.log('✅ Session timestamp updated');

      // Log API usage
      console.log('Logging API usage...');
      await this.logApiUsage(userId, 'chat', { message }, response);
      console.log('✅ API usage logged');

      console.log('=== SEND CHAT MESSAGE SUCCESS ===');
      console.log('Final response:', response.content);
      console.log('Session ID:', chatSession.id);
      console.log('Shopify products count:', shopifyProducts.length);

      return {
        success: true,
        message: response.content,
        sessionId: chatSession.id,
        timestamp: new Date().toISOString(),
        isNewSession: isNewChat, // Flag to indicate if this was a new session
        shopifyProducts: shopifyProducts.length > 0 ? shopifyProducts : undefined // Include Shopify products if found
      };

    } catch (error: any) {
      console.error('Error sending chat message:', error);
      await this.logApiUsage(userId, 'chat', { message }, null, false, error.message);
      
      // Provide user-friendly error messages
      let userMessage = 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.';
      
      if (error.code === 'UND_ERR_CONNECT_TIMEOUT' || error.name === 'AbortError') {
        userMessage = 'The request timed out. The AI service might be busy. Please try again.';
      } else if (error.message?.includes('fetch failed')) {
        userMessage = 'Unable to connect to the AI service. Please check your internet connection and try again.';
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        userMessage = 'Authentication error. Please try logging out and back in.';
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        userMessage = 'Too many requests. Please wait a moment before trying again.';
      }
      
      throw new Error(userMessage);
    }
  }

  /**
   * Get chat history for user
   */
  async getChatHistory(userId: string, sessionId?: string): Promise<any> {
    try {
      console.log('Getting chat history for user:', userId, 'session:', sessionId);
      
      let whereClause: any = { userId };
      
      if (sessionId) {
        whereClause.id = sessionId;
      }

      const sessions = await prisma.chatSession.findMany({
        where: whereClause,
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
            select: {
              id: true,
              role: true,
              content: true,
              timestamp: true,
              link: true,
              shopifyProducts: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: sessionId ? 1 : 10 // Limit to 10 recent sessions if no specific session
      });

      console.log(`Found ${sessions.length} sessions for user ${userId}`);

      // Flatten all messages from all sessions for frontend compatibility
      const allMessages = sessions.flatMap(session => session.messages);
      
      console.log(`Returning ${allMessages.length} messages for user ${userId}`);

      return allMessages;
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }

  /**
   * Get chat history from Sensay API
   */
  async getSensayChatHistory(userId: string): Promise<any> {
    try {
      const sensayUserId = await this.getOrCreateSensayUser(userId);

      // Get chat history from Sensay API
      const response = await this.sensayAPI.getChatHistory(this.replicaUUID, sensayUserId);
      
      await this.logApiUsage(userId, 'get_chat_history', {}, response);

      return response.items || [];
    } catch (error) {
      console.error('Error getting Sensay chat history:', error);
      await this.logApiUsage(userId, 'get_chat_history', {}, null, false, (error as Error).message);
      throw error;
    }
  }

  /**
   * Get chat sessions summary for user
   */
  async getChatSessions(userId: string): Promise<any> {
    try {
      console.log('Getting chat sessions for user:', userId);
      
      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }, // Get messages in chronological order to find first user message
            select: {
              content: true,
              timestamp: true,
              role: true
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 20
      });

      // Get last messages for each session in parallel
      const lastMessages = await Promise.all(
        sessions.map(session =>
          prisma.chatMessage.findFirst({
            where: { sessionId: session.id },
            orderBy: { timestamp: 'desc' },
            select: { content: true }
          })
        )
      );

      // Attach last messages to sessions
      sessions.forEach((session, index) => {
        (session as any).lastMessage = lastMessages[index]?.content || 'No messages';
      });

      console.log(`Found ${sessions.length} sessions for user ${userId}`);

      const sessionSummaries = sessions.map(session => {
        // Find the first user message for title, or use the first message as fallback
        const firstUserMessage = session.messages.find(msg => msg.role === 'user');
        const titleMessage = firstUserMessage?.content || session.messages[0]?.content || 'Chat Session';
        
        return {
          id: session.id,
          title: this.generateSessionTitle(titleMessage),
          lastMessage: (session as any).lastMessage || 'No messages',
          timestamp: session.updatedAt.toISOString(),
          messageCount: session._count.messages
        };
      });

      console.log('Session summaries:', sessionSummaries.map(s => ({ id: s.id, title: s.title, messageCount: s.messageCount })));

      return sessionSummaries;
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      throw error;
    }
  }

  /**
   * Generate a title for chat session based on first message
   */
  private generateSessionTitle(firstMessage: string): string {
    // Clean up the message for title
    let title = firstMessage.trim();
    
    // Remove common prefixes
    title = title.replace(/^(hi|hello|hey|hai|halo)\s*,?\s*/i, '');
    
    // If message is too long, truncate it
    if (title.length > 40) {
      title = title.substring(0, 40) + '...';
    }
    
    // If title is empty or too short, use default
    if (title.length < 3) {
      title = 'Chat Session';
    }
    
    return title;
  }

  /**
   * Get user's Sensay analytics
   */
  async getUserAnalytics(userId: string): Promise<any> {
    try {
      const sensayUserId = await this.getOrCreateSensayUser(userId);

      // Get conversations analytics
      const analytics = await this.sensayAPI.getAnalytics(this.replicaUUID, sensayUserId, 'historical');
      
      // Get our local chat stats
      const localStats = await prisma.chatMessage.groupBy({
        by: ['role'],
        where: {
          session: {
            userId
          }
        },
        _count: {
          id: true
        }
      });

      await this.logApiUsage(userId, 'analytics', {}, analytics);

      return {
        sensayAnalytics: analytics,
        localStats,
        summary: {
          totalMessages: localStats.reduce((sum, stat) => sum + stat._count.id, 0),
          userMessages: localStats.find(s => s.role === 'user')?._count.id || 0,
          aiResponses: localStats.find(s => s.role === 'assistant')?._count.id || 0
        }
      };

    } catch (error) {
      console.error('Error getting analytics:', error);
      await this.logApiUsage(userId, 'analytics', {}, null, false, (error as Error).message);
      throw error;
    }
  }

  /**
   * Log API usage for monitoring
   */
  private async logApiUsage(
    userId: string,
    endpoint: string,
    requestData: any,
    responseData: any,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.apiUsage.create({
        data: {
          userId,
          endpoint,
          requestData,
          responseData,
          success,
          errorMessage
        }
      });
    } catch (error) {
      console.error('Error logging API usage:', error);
    }
  }
}
