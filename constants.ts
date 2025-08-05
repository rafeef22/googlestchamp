import { Product } from './types';

export const WHATSAPP_NUMBER = "1234567890"; // Replace with your WhatsApp number
export const WHATSAPP_MESSAGE = "Hi, I'm interested in buying this shoe:";
export const INITIAL_HERO_IMAGE = "https://picsum.photos/id/101/1200/600";


export const BRANDS = ["Nike", "Adidas", "Jordan", "New Balance", "Yeezy"];
export const MAX_PRICE = 250000;
export const QUALITIES = ["10A", "9A", "7A", "6A", "5A"];
export const CATEGORIES = ["Lifestyle", "Running", "Basketball", "Skateboarding", "Luxury"];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Air Jordan 1 Retro High",
    brand: "Jordan",
    originalPrice: 18000,
    offerPrice: 15999,
    description: "A timeless classic, the Air Jordan 1 'Chicago' is one of the most iconic sneakers ever created. This high-top features the classic red, white, and black colorway that started it all.",
    images: ["https://picsum.photos/id/10/800/800", "https://picsum.photos/id/11/800/800", "https://picsum.photos/id/12/800/800"],
    isFeatured: true,
    quality: "10A",
    category: "Basketball",
  },
  {
    id: "2",
    name: "Yeezy Boost 350",
    brand: "Yeezy",
    originalPrice: 22000,
    offerPrice: 19999,
    description: "The 'Zebra' colorway of the Yeezy Boost 350 V2 is known for its distinctive black and white striped Primeknit upper, with 'SPLY-350' branding in red. A must-have for any Yeezy collector.",
    images: ["https://picsum.photos/id/20/800/800", "https://picsum.photos/id/21/800/800", "https://picsum.photos/id/22/800/800"],
    isFeatured: true,
    quality: "10A",
    category: "Lifestyle",
  },
  {
    id: "3",
    name: "Nike Dunk Low",
    brand: "Nike",
    originalPrice: 11000,
    offerPrice: 8999,
    description: "The Nike Dunk Low 'Panda' offers a clean and simple two-tone color scheme that has become incredibly popular. Its versatility makes it a staple in any sneaker rotation.",
    images: ["https://picsum.photos/id/30/800/800", "https://picsum.photos/id/31/800/800", "https://picsum.photos/id/32/800/800"],
    isFeatured: true,
    quality: "9A",
    category: "Skateboarding",
  },
  {
    id: "4",
    name: "Adidas Ultraboost",
    brand: "Adidas",
    originalPrice: 12000,
    offerPrice: 12000,
    description: "An enduring icon of street style, the Adidas Samba OG features a smooth leather upper with suede overlays and the classic gum sole. Its timeless design transcends trends.",
    images: ["https://picsum.photos/id/40/800/800", "https://picsum.photos/id/41/800/800", "https://picsum.photos/id/42/800/800"],
    isFeatured: true,
    quality: "9A",
    category: "Lifestyle",
  },
  {
    id: "5",
    name: "New Balance 550",
    brand: "New Balance",
    originalPrice: 10000,
    offerPrice: 10000,
    description: "Originally released in 1989, the New Balance 550 has made a massive comeback. This 'White Green' colorway provides a clean, vintage basketball aesthetic.",
    images: ["https://picsum.photos/id/50/800/800", "https://picsum.photos/id/51/800/800", "https://picsum.photos/id/52/800/800"],
    isFeatured: true,
    quality: "7A",
    category: "Basketball",
  },
   {
    id: "6",
    name: "Air Max 90",
    brand: "Nike",
    originalPrice: 12000,
    offerPrice: 10999,
    description: "The Nike Air Max 90 stays true to its OG running roots with an iconic Waffle sole, stitched overlays and classic TPU accents. Fresh colours give a modern look while Max Air cushioning adds comfort to your journey.",
    images: ["https://picsum.photos/id/60/800/800"],
    isFeatured: true,
    quality: "9A",
    category: "Lifestyle",
  },
];