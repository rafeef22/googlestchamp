import React from 'react';
import { NavLink } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const activeLinkStyle = {
    color: '#C09A2A',
    fontWeight: 600,
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Menu Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-brand-surface p-6 shadow-xl transform transition-transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-wider text-brand-primary">CHAMP</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-brand-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/"
            onClick={onClose}
            className="text-lg text-brand-primary hover:text-brand-accent transition-colors"
            style={({ isActive }) => isActive ? activeLinkStyle : {}}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={onClose}
            className="text-lg text-brand-primary hover:text-brand-accent transition-colors"
            style={({ isActive }) => isActive ? activeLinkStyle : {}}
          >
            Shop All
          </NavLink>
           <NavLink
            to="/about"
            onClick={onClose}
            className="text-lg text-brand-primary hover:text-brand-accent transition-colors"
            style={({ isActive }) => isActive ? activeLinkStyle : {}}
          >
            About Us
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;