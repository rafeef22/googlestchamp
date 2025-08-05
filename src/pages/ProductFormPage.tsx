import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { QUALITIES, CATEGORIES } from '../constants';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import { generateDescription } from '../services/geminiService';
import * as apiService from '../services/apiService';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById, brands } = useProducts();
  const isEditing = id !== 'new';
  
  const getInitialState = (): Omit<Product, 'id'> => ({
    name: '', brand: '', originalPrice: 0, offerPrice: 0,
    description: '', images: [], isFeatured: false,
    quality: QUALITIES[0], category: CATEGORIES[0],
  });

  const [productData, setProductData] = useState<Omit<Product, 'id'>>(getInitialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      const existingProduct = getProductById(id);
      if (existingProduct) {
        const { id: _, ...dataToSet } = existingProduct;
        setProductData(dataToSet);
      } else {
        navigate('/admin');
      }
    } else {
      setProductData(getInitialState());
    }
  }, [id, isEditing, getProductById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setProductData(prev => ({ ...prev, [name]: checked }));
    } else {
        setProductData(prev => ({
          ...prev,
          [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    }
  };

  const handleImagesChange = useCallback((base64Images: string[]) => {
    setProductData(prev => ({ ...prev, images: base64Images }));
  }, []);

  const handleGenerateDescription = async () => {
    if (!productData.name || !productData.brand) {
        alert("Please enter a name and brand first.");
        return;
    }
    setIsGenerating(true);
    try {
        const description = await generateDescription(productData.brand, productData.name);
        setProductData(prev => ({ ...prev, description }));
    } catch (error) {
        console.error(error);
        alert("Failed to generate description.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(productData.images.length === 0) {
        alert("Please upload at least one image.");
        return;
    }
    if(!productData.brand) {
        alert("Please enter a brand.");
        return;
    }
    if(productData.offerPrice > productData.originalPrice) {
        alert("Offer price cannot be greater than the original price.");
        return;
    }
    setIsSubmitting(true);
    
    try {
      // Step 1: Upload new base64 images to the backend
      const uploadedImageUrls = await Promise.all(
        productData.images.map(image => {
          // If it's a base64 string, upload it. Otherwise, it's an existing URL.
          if (image.startsWith('data:image')) {
            return apiService.uploadImage(image);
          }
          return Promise.resolve(image);
        })
      );

      // Step 2: Create the final product object with new image URLs
      const productToSave = { ...productData, images: uploadedImageUrls };

      // Step 3: Save the product data to the backend
      if (isEditing && id) {
        await updateProduct({ ...productToSave, id });
      } else {
        await addProduct(productToSave);
      }

      setSuccessMessage(`Product ${isEditing ? 'updated' : 'added'} successfully! Redirecting...`);
      setTimeout(() => {
          navigate('/admin');
      }, 1500);

    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
       console.error("Failed to save product:", error);
       alert(`An error occurred while saving the product: ${errorMessage}`);
       setIsSubmitting(false);
    }
  };
  
  const inputStyle = "mt-1 block w-full bg-brand-surface border-brand-border text-brand-primary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent placeholder:text-gray-400";
  const labelStyle = "block text-sm font-medium text-brand-secondary";

  return (
    <div className="max-w-4xl mx-auto bg-brand-surface text-brand-primary p-8 rounded-lg shadow-md border border-brand-border">
      <h1 className="text-3xl font-bold text-brand-primary mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      {successMessage && <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className={labelStyle}>Product Name</label>
            <input type="text" name="name" id="name" value={productData.name} onChange={handleChange} required className={inputStyle}/>
          </div>
          {/* Brand */}
          <div>
            <label htmlFor="brand" className={labelStyle}>Brand</label>
            <input list="brand-list" name="brand" id="brand" value={productData.brand} onChange={handleChange} required className={inputStyle} placeholder="Select or type a brand"/>
            <datalist id="brand-list">
              {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </datalist>
          </div>
          {/* Original Price */}
          <div>
            <label htmlFor="originalPrice" className={labelStyle}>Original Price (₹)</label>
            <input type="number" name="originalPrice" id="originalPrice" value={productData.originalPrice} onChange={handleChange} required min="0" className={inputStyle}/>
          </div>
          {/* Offer Price */}
          <div>
            <label htmlFor="offerPrice" className={labelStyle}>Offer Price (₹)</label>
            <input type="number" name="offerPrice" id="offerPrice" value={productData.offerPrice} onChange={handleChange} required min="0" className={inputStyle}/>
          </div>
          {/* Quality */}
          <div>
            <label htmlFor="quality" className={labelStyle}>Quality</label>
             <select name="quality" id="quality" value={productData.quality} onChange={handleChange} className={inputStyle}>
              {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          {/* Category */}
          <div>
            <label htmlFor="category" className={labelStyle}>Category</label>
             <select name="category" id="category" value={productData.category} onChange={handleChange} className={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {/* Description */}
        <div>
            <div className="flex justify-between items-center">
                <label htmlFor="description" className={labelStyle}>Description</label>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !productData.name || !productData.brand} className="text-sm font-medium text-brand-accent hover:text-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                  {isGenerating ? (
                    <>
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-accent"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10.5a1.5 1.5 0 013 0V16a1 1 0 01-2 0v-1.5a1.5 1.5 0 01-1-1.414V10.5a1.5 1.5 0 011.5-1.5zm9-3a1.5 1.5 0 00-3 0V12a1 1 0 002 0V9.5a1.5 1.5 0 001-1.414V4.5A1.5 1.5 0 0012.5 3h-1A1.5 1.5 0 0010 4.5v1.414A1.5 1.5 0 0011.5 7.5h1A1.5 1.5 0 0014 6V4.5z" clipRule="evenodd" />
                      </svg>
                      Generate with AI
                    </>
                  )}
                </button>
            </div>
            <textarea name="description" id="description" value={productData.description} onChange={handleChange} rows={5} required className={inputStyle}></textarea>
        </div>
        
        {/* Image Uploader */}
        <ImageUploader images={productData.images} onImagesChange={handleImagesChange} />

        {/* Featured Checkbox */}
        <div className="flex items-start">
            <div className="flex items-center h-5">
                <input id="isFeatured" name="isFeatured" type="checkbox" checked={productData.isFeatured} onChange={handleChange} className="focus:ring-brand-accent h-4 w-4 text-brand-accent border-gray-300 rounded"/>
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="isFeatured" className="font-medium text-brand-primary">Mark as Featured</label>
                <p className="text-brand-secondary">Featured products appear on the homepage.</p>
            </div>
        </div>
        
        {/* Submit Button */}
        <div>
          <Button type="submit" variant="secondary" isLoading={isSubmitting} className="w-full md:w-auto">
            {isEditing ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;