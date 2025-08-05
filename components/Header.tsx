import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

interface HeaderProps {
  onMenuToggle: () => void;
}

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useProducts();
  
  const isProductPage = location.pathname.startsWith('/product/');
  
  const product = isProductPage && id ? getProductById(id) : undefined;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product ? product.name : document.title,
        text: `Check out the ${product ? product.name : 'awesome shoe'} on CHAMP!`,
        // Omitting 'url' lets the browser use the page's canonical URL.
        // This is more robust and avoids 'Invalid URL' errors in some contexts.
      }).catch((error) => {
        // Don't show an error if the user cancels the share dialog.
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to clipboard if sharing fails for other reasons.
          navigator.clipboard.writeText(window.location.href);
          alert('Sharing failed. Link copied to clipboard!');
        }
      });
    } else {
      // Fallback for browsers that do not support the Web Share API.
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };


  const renderHeaderContent = () => {
    if (isProductPage) {
      return (
        <>
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-brand-primary">
            <BackArrowIcon />
          </button>
          <span className="font-semibold text-center truncate px-4">{product ? product.name : 'Product Detail'}</span>
          <button onClick={handleShare} className="p-2 -mr-2 text-brand-primary">
            <ShareIcon />
          </button>
        </>
      );
    }

    return (
      <>
        <button onClick={onMenuToggle} className="p-2 -ml-2 text-brand-primary">
          <MenuIcon />
        </button>
        <Link to="/" className="text-xl font-bold tracking-wider text-brand-primary">
          CHAMP
        </Link>
        <div className="w-6" /> 
      </>
    );
  };

  return (
    <header className="bg-brand-surface sticky top-0 z-40 border-b border-brand-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {renderHeaderContent()}
        </div>
      </div>
    </header>
  );
};

export default Header;
