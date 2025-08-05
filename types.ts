
export interface Product {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  offerPrice: number;
  description: string;
  images: string[]; // Array of base64 strings or image URLs
  isFeatured?: boolean;
  quality: string;
  category: string;
}

export interface Filters {
  searchQuery: string;
  brands: string[];
  priceRange: [number, number];
  qualities: string[];
  categories: string[];
}

export interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  brands: string[];
  heroImage: string;
  updateHeroImage: (image: string) => Promise<void>;
  whatsappNumber: string;
  updateWhatsappNumber: (number: string) => Promise<void>;
}