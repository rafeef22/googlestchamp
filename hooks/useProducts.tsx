import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Product, ProductContextType } from '../types';
import { BRANDS as INITIAL_BRANDS } from '../constants';
import * as mockApi from '../services/mockApi';

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
        const [productsData, heroData, whatsappData] = await Promise.all([
          mockApi.getProducts(),
          mockApi.getHeroImage(),
          mockApi.getWhatsappNumber(),
        ]);
        setProducts(productsData);
        setHeroImage(heroData);
        setWhatsappNumber(whatsappData);
      } catch (error) {
        console.error("Failed to load initial data:", error);
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
    const newProduct = await mockApi.createProduct(productData);
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const updateProduct = async (updatedProductData: Product) => {
    const updatedProduct = await mockApi.updateProduct(updatedProductData);
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = async (id: string) => {
    await mockApi.deleteProduct(id);
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const updateHeroImage = async (image: string) => {
    const newHeroImage = await mockApi.updateHeroImage(image);
    setHeroImage(newHeroImage);
  };
  
  const updateWhatsappNumber = async (number: string) => {
    const newWhatsappNumber = await mockApi.updateWhatsappNumber(number);
    setWhatsappNumber(newWhatsappNumber);
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

  // Render a loading state while initial data is being fetched
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
