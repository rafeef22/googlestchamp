import React from 'react';
import { Link } from 'react-router-dom';

const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.316 1.363.364 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.048 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.316-2.427.364-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.048-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.316-1.363-.364-2.427C2.013 15.098 2 14.744 2 12.315s.012-2.784.06-3.808c.048-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.47 3.665c.636-.247 1.363.316 2.427-.364C8.93 2.013 9.284 2 12.315 2zM8.447 12.315a3.868 3.868 0 117.736 0 3.868 3.868 0 01-7.736 0zM12.315 14.5a2.185 2.185 0 100-4.37 2.185 2.185 0 000 4.37zM18.848 7.347a1.172 1.172 0 11-2.344 0 1.172 1.172 0 012.344 0z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-brand-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-3 sm:gap-x-4 gap-y-2 text-sm font-medium">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <span className="text-brand-secondary">|</span>
            <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Shop</Link>
            <span className="text-brand-secondary">|</span>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <span className="text-brand-secondary">|</span>
            <a href="mailto:contact@champ.com" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6">
            <a href="#" aria-label="Instagram" className="text-brand-secondary hover:text-white transition-colors">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Twitter" className="text-brand-secondary hover:text-white transition-colors">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="Facebook" className="text-brand-secondary hover:text-white transition-colors">
              <FacebookIcon />
            </a>
          </div>

          {/* Copyright */}
          <Link to="/admin" aria-label="Admin Panel" className="text-sm text-brand-secondary hover:text-white transition-colors">
            &copy; 2025 CHAMP
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;