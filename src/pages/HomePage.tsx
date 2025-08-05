import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const PriceCategory = ({ label, icon, to }: { label: string, icon:string, to: string }) => (
    <Link to={to} className="flex flex-col items-center space-y-2 group cursor-pointer" aria-label={`Shop products ${label}`}>
        <div className="w-16 h-16 bg-gray-100 border border-brand-border rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-primary group-hover:border-brand-accent">
            <span className="text-brand-primary text-2xl transition-colors duration-300 group-hover:text-white">{icon}</span>
        </div>
        <span className="text-sm text-brand-secondary transition-colors duration-300 group-hover:text-brand-primary font-medium">{label}</span>
    </Link>
);

const HomePage: React.FC = () => {
  const { products, heroImage } = useProducts();
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);
  
  const priceCategories = [
    { label: "Under ₹999", icon: "₹", to: "/products?maxPrice=999" },
    { label: "Under ₹1,499", icon: "₹", to: "/products?maxPrice=1499" },
    { label: "Under ₹1,999", icon: "₹", to: "/products?maxPrice=1999" },
    { label: "Over ₹2,000", icon: "₹", to: "/products?minPrice=2000" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="rounded-lg overflow-hidden border border-brand-border">
         <div className="aspect-w-16 aspect-h-9 md:aspect-h-7">
             <img src={heroImage} alt="Featured shoe" className="w-full h-full object-cover"/>
         </div>
      </section>

      {/* Price Categories */}
      <section>
        <div className="flex justify-around items-center">
           {priceCategories.map((category) => (
             <PriceCategory key={category.label} label={category.label} icon={category.icon} to={category.to} />
           ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-brand-primary text-left">Featured Products</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
         {featuredProducts.length === 0 && (
            <p className="mt-6 text-center text-brand-secondary">No featured products at the moment. Check back later!</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;