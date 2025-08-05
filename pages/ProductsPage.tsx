import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product, Filters } from '../types';
import { MAX_PRICE, QUALITIES, CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const PRODUCTS_PER_PAGE = 8; // Number of products to show initially and load more
type SortOption = 'newest' | 'price-asc' | 'price-desc';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


const ProductsPage: React.FC = () => {
  const { products, brands: allBrands } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    brands: [],
    priceRange: [0, MAX_PRICE],
    qualities: [],
    categories: [],
  });
  
  // Effect to handle body scroll lock when filter panel is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    
    setIsFilterOpen(params.get('filter') === 'open');

    const newFilters = { ...filters };

    if (minPrice !== null || maxPrice !== null) {
      newFilters.priceRange = [minPrice ? Number(minPrice) : 0, maxPrice ? Number(maxPrice) : MAX_PRICE];
    }
    
    setFilters(newFilters);

  }, [location.search]);

  const handleFilterToggle = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('filter') === 'open') {
      navigate('/products', { replace: true });
    } else {
      navigate('/products?filter=open', { replace: true });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };
  
  const handleQualityChange = (quality: string) => {
    const newQualities = filters.qualities.includes(quality)
      ? filters.qualities.filter(q => q !== quality)
      : [...filters.qualities, quality];
    setFilters({ ...filters, qualities: newQualities });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] });
  };

  const filteredProducts = useMemo(() => {
    let sortedProducts = [...products];
    
    // Sorting logic
    if (sortOption === 'price-asc') {
      sortedProducts.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOption === 'price-desc') {
      sortedProducts.sort((a, b) => b.offerPrice - a.offerPrice);
    }
    // 'newest' is the default as products are fetched with newest first

    return sortedProducts.filter(product => {
      const { searchQuery, brands, priceRange, qualities, categories } = filters;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (brands.length > 0 && !brands.includes(product.brand)) {
        return false;
      }
      if (product.offerPrice < priceRange[0] || product.offerPrice > priceRange[1]) {
        return false;
      }
      if (qualities.length > 0 && !qualities.includes(product.quality)) {
        return false;
      }
      if (categories.length > 0 && !categories.includes(product.category)) {
        return false;
      }
      return true;
    });
  }, [products, filters, sortOption]);

  // Reset visible count whenever filters change (and thus filteredProducts changes)
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [filteredProducts]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + PRODUCTS_PER_PAGE);
  };

  const SortDropdown = () => (
    <div className="relative">
      <select 
        id="sort-options"
        value={sortOption} 
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="appearance-none pl-3 pr-8 py-2 bg-brand-surface border border-brand-border rounded-md text-sm font-medium text-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-accent"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );


  const FilterPanel = () => (
     <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={handleFilterToggle}>
      <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-brand-surface p-6 shadow-xl transform transition-transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filter</h2>
          <button onClick={handleFilterToggle} className="p-2 -mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-6 text-brand-primary overflow-y-auto h-[calc(100%-4rem)] pb-6 no-scrollbar">
          <div>
            <h3 className="text-lg font-semibold">Price Range</h3>
            <input type="range" min="0" max={MAX_PRICE} value={filters.priceRange[1]} onChange={handlePriceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4" />
            <div className="flex justify-between text-sm mt-2">
              <span>₹0</span>
              <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Brands</h3>
            <div className="mt-4 space-y-2">
              {allBrands.map(brand => (
                <div key={brand} className="flex items-center">
                  <input id={`brand-${brand}`} type="checkbox" checked={filters.brands.includes(brand)} onChange={() => handleBrandChange(brand)} className="h-4 w-4 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent" />
                  <label htmlFor={`brand-${brand}`} className="ml-3 text-sm">{brand}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quality</h3>
            <div className="mt-4 space-y-2">
              {QUALITIES.map(quality => (
                <div key={quality} className="flex items-center">
                  <input id={`quality-${quality}`} type="checkbox" checked={filters.qualities.includes(quality)} onChange={() => handleQualityChange(quality)} className="h-4 w-4 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent" />
                  <label htmlFor={`quality-${quality}`} className="ml-3 text-sm">{quality}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Category</h3>
            <div className="mt-4 space-y-2">
              {CATEGORIES.map(category => (
                <div key={category} className="flex items-center">
                  <input id={`category-${category}`} type="checkbox" checked={filters.categories.includes(category)} onChange={() => handleCategoryChange(category)} className="h-4 w-4 text-brand-accent bg-gray-100 border-gray-300 rounded focus:ring-brand-accent" />
                  <label htmlFor={`category-${category}`} className="ml-3 text-sm">{category}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <FilterPanel />

      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon />
        </div>
        <input 
          type="text" 
          value={filters.searchQuery} 
          onChange={handleSearchChange} 
          className="block w-full bg-brand-surface border-brand-border rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-brand-accent focus:border-brand-accent" 
          placeholder="Search for sneakers..."
        />
      </div>


      <div className="flex justify-between items-center">
        <SortDropdown />
        <button onClick={handleFilterToggle} className="px-4 py-2 bg-brand-surface border border-brand-border rounded-md text-sm font-medium text-brand-primary">Filter</button>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6">
          {visibleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="mt-2 text-lg font-medium">No sneakers found</h3>
          <p className="mt-1 text-sm text-brand-secondary">Try adjusting your filters or search.</p>
        </div>
      )}

      {visibleCount < filteredProducts.length && (
        <div className="mt-12 flex justify-center">
          <Button variant="primary" className="px-10" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
