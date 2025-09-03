/**
 * Main entry point untuk Sensay Shopping AI Setup
 */

import { SensayClient } from './sensay-client';
import { SensayAPIComplete } from './sensay-api-complete';

/**
 * Main function - setup dan test Shopping AI
 */
async function main() {
  console.log('🛍️ Sensay Shopping AI Setup');
  console.log('================================\n');

  const client = new SensayClient();
  const completeAPI = new SensayAPIComplete();
  
  try {
    console.log('🔄 Trying with Complete API implementation...\n');
    
    // Use the complete API for better reliability
    const result = await completeAPI.demonstrateAPI();
    
    if (result) {
      console.log('\n🎉 Setup completed successfully!');
      console.log('📋 Details:');
      console.log('   User ID:', result.userId);
              console.log('   Replica UUID:', result.replicaUUID);
        console.log('   Replica Name:', result.replicaName);
      console.log('\n💡 Simpan Replica UUID untuk integrasi ke aplikasi Anda!');
      
      // Simpan ke file untuk referensi
      const fs = require('fs');
      const resultData = {
        userId: result.userId,
        replicaUuid: result.replicaUUID,
        replicaName: result.replicaName,
        createdAt: new Date().toISOString(),
        instructions: {
          usage: 'Gunakan replicaUuid untuk chat dengan AI',
          example: `await completeAPI.chatWithReplica('${result.replicaUUID}', '${result.userId}', 'Your message here');`
        }
      };
      
      fs.writeFileSync('shopping-ai-result.json', JSON.stringify(resultData, null, 2));
      console.log('📄 Result saved to: shopping-ai-result.json');
      
    } else {
      console.log('❌ Setup failed. Please check the logs above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }
}

/**
 * Export untuk digunakan sebagai module
 */
export { SensayClient };
export { SensayAPIComplete };
export * from './types';
export * from './config';

// Jalankan main function jika file ini dijalankan langsung
if (require.main === module) {
  main().catch(console.error);
}

