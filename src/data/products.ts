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
  { id: 1, name: 'Oversized Wool Coat', price: 720, image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&h=650&fit=crop&crop=top', tag: 'NEW', tagColor: 'bg-dark', category: 'women' },
  { id: 2, name: 'Silk Blend Blazer', price: 540, originalPrice: 680, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=650&fit=crop&crop=center', tag: 'SALE', tagColor: 'bg-gold', category: 'women' },
  { id: 3, name: 'Merino Knit Dress', price: 310, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=650&fit=crop&crop=top', tag: 'NEW', tagColor: 'bg-dark', category: 'women' },
  { id: 4, name: 'Tailored Wide Trousers', price: 420, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=650&fit=crop&crop=center', category: 'women' },
  { id: 5, name: 'Double-Breasted Suit', price: 1200, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&h=650&fit=crop&crop=center', tag: 'NEW', tagColor: 'bg-dark', category: 'men' },
  { id: 6, name: 'Cashmere V-Neck', price: 280, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&fit=crop&crop=top', category: 'men' },
  { id: 7, name: 'Linen Summer Shirt', price: 195, originalPrice: 260, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=650&fit=crop&crop=center', tag: 'SALE', tagColor: 'bg-gold', category: 'men' },
  { id: 8, name: 'Slim Chino Pants', price: 240, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=650&fit=crop&crop=center', category: 'men' },
  { id: 9, name: 'Leather Crossbody Bag', price: 480, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=650&fit=crop&crop=center', tag: 'NEW', tagColor: 'bg-dark', category: 'accessories' },
  { id: 10, name: 'Silk Scarf', price: 120, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=650&fit=crop&crop=center', category: 'accessories' },
  { id: 11, name: 'Gold Chain Necklace', price: 350, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=650&fit=crop&crop=center', category: 'accessories' },
  { id: 12, name: 'Leather Belt', price: 145, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&h=650&fit=crop&crop=center', category: 'accessories' },
  { id: 13, name: 'Aviator Sunglasses', price: 290, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=650&fit=crop&crop=center', tag: 'NEW', tagColor: 'bg-dark', category: 'eyewear' },
  { id: 14, name: 'Round Frame Glasses', price: 220, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=650&fit=crop&crop=center', category: 'eyewear' },
  { id: 15, name: 'Cat-Eye Frames', price: 310, originalPrice: 380, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=650&fit=crop&crop=center', tag: 'SALE', tagColor: 'bg-gold', category: 'eyewear' },
  { id: 16, name: 'Square Tortoise Frames', price: 260, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=650&fit=crop&crop=center', category: 'eyewear' },
  { id: 17, name: 'Belted Cashmere Overcoat', price: 890, originalPrice: 1150, image: '/product-main.png', tag: 'SALE', tagColor: 'bg-gold', category: 'women' },
  { id: 18, name: 'Cashmere Turtleneck', price: 310, image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&h=650&fit=crop&crop=top', category: 'women' },
  { id: 19, name: 'Wide-Leg Trousers', price: 420, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop&crop=center', category: 'women' },
  { id: 20, name: 'Ankle Boots', price: 560, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=650&fit=crop&crop=center', category: 'footwear' },
];

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`;
};
