// Demo messages untuk testing scrolling behavior
export const demoMessages = [
  {
    id: 'demo_1',
    content: 'Hello! I need help finding a good laptop for work.',
    role: 'user' as const,
    timestamp: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'demo_2', 
    content: 'Hi! I\'d be happy to help you find the perfect laptop for work! 💻 Here are some excellent options within different price ranges:\n\n**1. Dell Inspiron 15**: Great performance with Intel Core i5, 8GB RAM, and 256GB SSD. Perfect for everyday office tasks and multitasking.\n\n**2. HP Pavilion x360**: This 2-in-1 convertible laptop offers flexibility with touchscreen functionality, Intel Core i5, 8GB RAM, and 512GB SSD.\n\n**3. Acer Aspire 5**: Excellent value for money with AMD Ryzen 5, 16GB RAM, and 512GB SSD. Great for demanding work applications.\n\n**4. Lenovo ThinkPad E15**: Business-grade reliability with Intel Core i5, 12GB RAM, and excellent keyboard for typing.\n\nWhat\'s your budget range and what type of work applications will you be using?',
    role: 'assistant' as const,
    timestamp: new Date(Date.now() - 250000).toISOString()
  },
  {
    id: 'demo_3',
    content: 'My budget is around $800-1000. I mainly use Excel, PowerPoint, and some light video editing.',
    role: 'user' as const,
    timestamp: new Date(Date.now() - 200000).toISOString()
  },
  {
    id: 'demo_4',
    content: 'Perfect! For your budget and requirements, I highly recommend:\n\n**Dell Inspiron 15 5000** - $899\n- Intel Core i7-1165G7\n- 16GB RAM (great for Excel with large datasets)\n- 512GB SSD (fast boot and file access)\n- Dedicated graphics for light video editing\n- 15.6" Full HD display\n\n**HP Pavilion 15** - $949\n- AMD Ryzen 7 5700U\n- 16GB RAM\n- 1TB SSD (lots of storage)\n- AMD Radeon graphics\n- Excellent for multitasking\n\n**Acer Swift 3** - $799\n- Intel Core i7-1165G7\n- 16GB RAM\n- 512GB SSD\n- Lightweight at 2.65 lbs\n- Great battery life\n\nFor light video editing, I\'d lean toward the Dell Inspiron or HP Pavilion as they have better graphics capabilities. Would you like me to find current deals on any of these?',
    role: 'assistant' as const,
    timestamp: new Date(Date.now() - 150000).toISOString()
  },
  {
    id: 'demo_5',
    content: 'The Dell Inspiron sounds perfect! Can you find me the best deal on it?',
    role: 'user' as const,
    timestamp: new Date(Date.now() - 100000).toISOString()
  },
  {
    id: 'demo_6',
    content: 'Excellent choice! 🎉 Here are the best current deals for the Dell Inspiron 15 5000:\n\n**Best Deals Found:**\n\n🔥 **Amazon** - $849 (Save $50!)\n- Free shipping\n- 30-day return policy\n- Available in Silver and Black\n\n🛒 **Best Buy** - $879 (Price match available)\n- Geek Squad setup available\n- 15-day return policy\n- Same-day pickup option\n\n💻 **Dell Direct** - $899 (Original price)\n- 1-year premium support included\n- Customization options available\n- 30-day return policy\n\n**Recommendation**: The Amazon deal at $849 offers the best value with fast shipping and good return policy. \n\nWould you like me to help you check availability or find any additional accessories like a laptop bag or external mouse?',
    role: 'assistant' as const,
    timestamp: new Date(Date.now() - 50000).toISOString()
  }
];

// Function to simulate adding these demo messages for testing
export function addDemoMessages(setMessages: (messages: any[]) => void) {
  setMessages(demoMessages);
}
