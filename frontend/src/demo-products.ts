// Demo data untuk testing MediaPanel
export const demoProducts = [
  {
    id: 'demo_1',
    name: 'Dell Inspiron 15 Laptop',
    price: '$799',
    description: 'Powerful laptop with Intel Core i5, 8GB RAM, and 256GB SSD',
    url: 'https://www.amazon.com/dp/example1',
    image: 'https://via.placeholder.com/300x200/1A73E8/FFFFFF?text=Dell+Laptop',
    rating: 4.5,
    availability: 'In Stock'
  },
  {
    id: 'demo_2', 
    name: 'Nike Air Max Sneakers',
    price: 'Rp 1.200.000',
    description: 'Comfortable running shoes with air cushioning technology',
    url: 'https://www.tokopedia.com/example2',
    image: 'https://via.placeholder.com/300x200/42B549/FFFFFF?text=Nike+Shoes',
    rating: 4.8,
    availability: 'Limited Stock'
  }
];

// Function to simulate product detection for testing
export function simulateProductDetection(): typeof demoProducts {
  return demoProducts;
}
