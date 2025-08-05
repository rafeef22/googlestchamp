import { Product } from '../types';
import { INITIAL_PRODUCTS, INITIAL_HERO_IMAGE, WHATSAPP_NUMBER as INITIAL_WHATSAPP_NUMBER } from '../constants';

const API_LATENCY = 300; // ms

// --- LocalStorage Helpers ---
const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item != null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

const setStoredValue = <T,>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
};

// --- Initial Data Seeding ---
// This ensures that the app has data on the first run.
const initializeStorage = () => {
    if (localStorage.getItem('champ_products') === null) {
        setStoredValue('champ_products', INITIAL_PRODUCTS);
    }
    if (localStorage.getItem('champ_heroImage') === null) {
        setStoredValue('champ_heroImage', INITIAL_HERO_IMAGE);
    }
    if (localStorage.getItem('champ_whatsappNumber') === null) {
        setStoredValue('champ_whatsappNumber', INITIAL_WHATSAPP_NUMBER);
    }
}
initializeStorage();


// --- Mock API Functions ---

// PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, API_LATENCY));
  return getStoredValue('champ_products', []);
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    const products = getStoredValue<Product[]>('champ_products', []);
    const newProduct: Product = {
      ...productData,
      id: new Date().getTime().toString(),
    };
    const updatedProducts = [newProduct, ...products];
    setStoredValue('champ_products', updatedProducts);
    return newProduct;
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    let products = getStoredValue<Product[]>('champ_products', []);
    products = products.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
    setStoredValue('champ_products', products);
    return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    let products = getStoredValue<Product[]>('champ_products', []);
    products = products.filter(p => p.id !== id);
    setStoredValue('champ_products', products);
};


// SETTINGS
export const getHeroImage = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    return getStoredValue('champ_heroImage', INITIAL_HERO_IMAGE);
};

export const updateHeroImage = async (image: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    setStoredValue('champ_heroImage', image);
    return image;
};

export const getWhatsappNumber = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    return getStoredValue('champ_whatsappNumber', INITIAL_WHATSAPP_NUMBER);
};

export const updateWhatsappNumber = async (number: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, API_LATENCY));
    setStoredValue('champ_whatsappNumber', number);
    return number;
};


// AUTH
export const loginUser = async (user: string, pass: string): Promise<string | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Longer delay for auth
    
    // Credentials are now stored only here, acting as the "backend".
    const validUser = 'busi@rafiadi2';
    const validPass = 'rafiadil@11busi';

    if (user === validUser && pass === validPass) {
      // Return a mock token on success
      return `mock-session-token-${new Date().getTime()}`;
    }
    
    // Return null on failure
    return null;
};