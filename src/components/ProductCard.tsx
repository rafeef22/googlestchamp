import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 border border-brand-border">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {product.images.length > 1 && (
             <img
                src={product.images[1]}
                alt={`${product.name} alternative view`}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          <div className="absolute top-2 left-2 bg-brand-surface text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full shadow-md border border-brand-border">
            {product.quality}
          </div>
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-sm font-medium text-brand-primary">{product.name}</h3>
          <div className="mt-1 text-lg font-semibold text-brand-primary flex justify-center items-center gap-2">
            <span>₹{product.offerPrice.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.offerPrice && (
              <span className="text-sm line-through text-brand-secondary">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;