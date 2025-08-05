import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { WHATSAPP_MESSAGE } from '../constants';

const PlayIcon = () => (
    <svg className="h-16 w-16 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-3xl font-bold text-brand-primary">Product Not Found</h1>
    <p className="mt-4 text-brand-secondary">Sorry, we couldn't find the product you're looking for.</p>
    <div className="mt-8">
      <Link to="/products">
         <Button variant="secondary">Back to Shop</Button>
      </Link>
    </div>
  </div>
);


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products, whatsappNumber } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [productFound, setProductFound] = useState<boolean | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setProductFound(true);
      } else {
        setProductFound(false);
      }
      setSelectedImageIndex(0); // Reset on product change
    }
    window.scrollTo(0, 0); // Scroll to top on page load
  }, [id, getProductById]);

  if (productFound === null) {
    return <Spinner />;
  }
  
  if (productFound === false || !product) {
    return <NotFound />;
  }
  
  const selectedImage = product.images[selectedImageIndex] || product.images[0];

  // Construct the WhatsApp message with the product link
  const productUrl = window.location.href;
  const message = `${WHATSAPP_MESSAGE} ${product.name} (Price: ₹${product.offerPrice.toLocaleString('en-IN')}).\n\nYou can view it here: ${productUrl}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  // Enhanced logic for finding related products
  const relatedProducts = products
    .filter(p => p.id !== product.id) // Exclude the current product
    .sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      // Higher score for same category
      if (a.category === product.category) scoreA += 2;
      if (b.category === product.category) scoreB += 2;
      // Additional score for same brand
      if (a.brand === product.brand) scoreA += 1;
      if (b.brand === product.brand) scoreB += 1;
      
      // Sort by descending score to get the most relevant products first
      return scoreB - scoreA;
    })
    .slice(0, 4); // Take the top 4 most related products

  return (
    <div className="space-y-10">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-brand-border">
          <img src={selectedImage} alt={`${product.name} - view ${selectedImageIndex + 1}`} className="w-full h-full object-cover" />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
                {product.images.map((img, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index ? 'border-brand-accent scale-105 shadow-md' : 'border-transparent'}`}
                    aria-label={`View image ${index + 1}`}
                >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
                ))}
            </div>
        )}
      </div>

      {/* Product info */}
      <div className="px-2 space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary sm:text-3xl">{product.name}</h1>
        
        <div>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl text-brand-primary">₹{product.offerPrice.toLocaleString('en-IN')}</p>
                {product.originalPrice > product.offerPrice && (
                  <p className="text-xl line-through text-brand-secondary">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
              {product.originalPrice > product.offerPrice && (
                <p className="text-md font-semibold text-green-600 mt-1">
                  You save {Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)}%
                </p>
              )}
            </div>
            <div className="text-right">
                <h3 className="text-sm font-medium text-brand-secondary">Quality</h3>
                <p className="text-md text-brand-primary">{product.quality}</p>
            </div>
          </div>
        </div>

        <div>
            <p className="text-base text-brand-secondary leading-relaxed">{product.description}</p>
        </div>
        
        <div className="pt-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="secondary">Buy On WhatsApp</Button>
          </a>
        </div>
      </div>

      {/* Video Review */}
      <div className="space-y-4 px-2">
         <h2 className="text-xl font-bold tracking-tight text-brand-primary">Video Review</h2>
         <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black cursor-pointer group">
            <img src={product.images[1] || product.images[0]} alt="Video thumbnail" className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayIcon />
            </div>
         </div>
      </div>


       {/* Related Products */}
       {relatedProducts.length > 0 && (
         <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-brand-primary px-2">Related Products</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
              {relatedProducts.map(p => (
                <div key={p.id} className="flex-shrink-0 w-2/3 sm:w-1/3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
         </div>
       )}
    </div>
  );
};

export default ProductDetailPage;