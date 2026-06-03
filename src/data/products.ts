export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  tagColor?: string;
  category: string;
}

export const allProducts: Product[] = [
  { id: 1, name: 'Oversized Wool Coat', price: 720, image: '/products/women/1 (1).jpeg', tag: 'NEW', tagColor: 'bg-dark', category: 'women' },
  { id: 2, name: 'Silk Blend Blazer', price: 540, originalPrice: 680, image: '/products/women/1 (2).jpeg', tag: 'SALE', tagColor: 'bg-gold', category: 'women' },
  { id: 3, name: 'Merino Knit Dress', price: 310, image: '/products/women/1 (3).jpeg', tag: 'NEW', tagColor: 'bg-dark', category: 'women' },
  { id: 4, name: 'Tailored Wide Trousers', price: 420, image: '/products/women/1 (4).jpeg', category: 'women' },
  { id: 5, name: 'Double-Breasted Suit', price: 1200, image: '/products/men/1 (1).jpeg', tag: 'NEW', tagColor: 'bg-dark', category: 'men' },
  { id: 6, name: 'Cashmere V-Neck', price: 280, image: '/products/men/1 (2).jpeg', category: 'men' },
  { id: 7, name: 'Linen Summer Shirt', price: 195, originalPrice: 260, image: '/products/men/1 (3).jpeg', tag: 'SALE', tagColor: 'bg-gold', category: 'men' },
  { id: 8, name: 'Slim Chino Pants', price: 240, image: '/products/men/1 (4).jpeg', category: 'men' },
  { id: 9, name: 'Leather Crossbody Bag', price: 480, image: '/products/accessories/1 (1).jpeg', tag: 'NEW', tagColor: 'bg-dark', category: 'accessories' },
  { id: 10, name: 'Silk Scarf', price: 120, image: '/products/accessories/1 (2).jpeg', category: 'accessories' },
  { id: 11, name: 'Gold Chain Necklace', price: 350, image: '/products/accessories/1 (3).jpeg', category: 'accessories' },
  { id: 12, name: 'Leather Belt', price: 145, image: '/products/accessories/1 (4).jpeg', category: 'accessories' },
  { id: 13, name: 'Aviator Sunglasses', price: 290, image: '/products/eyewear/1 (1).jpeg', tag: 'NEW', tagColor: 'bg-dark', category: 'eyewear' },
  { id: 14, name: 'Round Frame Glasses', price: 220, image: '/products/eyewear/1 (2).jpeg', category: 'eyewear' },
  { id: 15, name: 'Cat-Eye Frames', price: 310, originalPrice: 380, image: '/products/eyewear/1 (3).jpeg', tag: 'SALE', tagColor: 'bg-gold', category: 'eyewear' },
  { id: 16, name: 'Square Tortoise Frames', price: 260, image: '/products/eyewear/1 (4).jpeg', category: 'eyewear' },
  { id: 17, name: 'Belted Cashmere Overcoat', price: 890, originalPrice: 1150, image: '/products/women/1 (5).jpeg', tag: 'SALE', tagColor: 'bg-gold', category: 'women' },
  { id: 18, name: 'Cashmere Turtleneck', price: 310, image: '/products/women/1 (6).jpeg', category: 'women' },
  { id: 19, name: 'Wide-Leg Trousers', price: 420, image: '/products/women/1 (7).jpeg', category: 'women' },
  { id: 20, name: 'Ankle Boots', price: 560, image: '/products/footwear/1.jpeg', category: 'footwear' },
];

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};
