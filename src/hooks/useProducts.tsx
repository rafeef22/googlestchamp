import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Product, ProductContextType } from '../types';
import { BRANDS as INITIAL_BRANDS } from '../constants';
import * as apiService from '../services/apiService';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [heroImage, setHeroImage] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [productsData, settingsData] = await Promise.all([
          apiService.getProducts(),
          apiService.getSettings(),
        ]);
        setProducts(productsData);
        setHeroImage(settingsData.heroImage);
        setWhatsappNumber(settingsData.whatsappNumber);
      } catch (error) {
        console.error("Failed to load initial data from backend:", error);
        // You might want to set some default/error state here
        setHeroImage('https://picsum.photos/id/404/1200/600'); 
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const brands = useMemo(() => {
    const productBrands = products.map(p => p.brand);
    const allBrands = [...new Set([...INITIAL_BRANDS, ...productBrands])];
    return allBrands.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct = await apiService.createProduct(productData);
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const updateProduct = async (updatedProductData: Product) => {
    const updatedProduct = await apiService.updateProduct(updatedProductData);
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = async (id: string) => {
    await apiService.deleteProduct(id);
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const updateHeroImage = async (image: string) => {
    const newHeroImage = await apiService.updateHeroImage(image);
    setHeroImage(newHeroImage);
  };
  
  const updateWhatsappNumber = async (number: string) => {
    await apiService.updateWhatsappNumber(number);
    setWhatsappNumber(number);
  };

  const value = { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getProductById, 
    brands,
    heroImage,
    updateHeroImage,
    whatsappNumber,
    updateWhatsappNumber
  };

  return (
    <ProductContext.Provider value={value}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-screen bg-brand-background">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        children
      )}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
