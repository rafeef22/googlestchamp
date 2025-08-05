import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const HomeIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? '#1F2937' : '#6B7281'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const SearchIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? '#1F2937' : '#6B7281'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CategoryIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isActive ? '#1F2937' : '#6B7281'} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);


const WhatsappIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.94L2 22l5.25-1.38c1.41.81 3.02 1.29 4.79 1.29h.01c5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zM17.52 16.04c-.22-.11-.76-.38-1.04-.44-.28-.06-.48-.09-.68.09-.2.18-.62.77-.76.92-.14.15-.28.17-.52.06-1.24-.54-2.26-1.12-3.15-2.01-.8-.79-1.42-1.77-1.58-2.07-.16-.3-.02-.46.09-.57.1-.1.22-.26.33-.39.11-.13.15-.22.22-.36.07-.15.04-.28-.02-.38-.06-.11-.68-1.63-.93-2.23-.24-.6-.49-.52-.67-.52-.17 0-.37-.03-.57-.03-.2 0-.52.07-.79.35-.27.28-.93.91-.93 2.22 0 1.31.96 2.57 1.09 2.75.13.18 1.83 2.91 4.58 4.04.63.26 1.12.42 1.51.53.6.18 1.15.15 1.58.1.48-.06 1.34-.55 1.53-1.07.19-.53.19-.97.13-1.07c-.05-.1-.19-.16-.4-.27z"/>
    </svg>
);

const NavItem = ({ to, label, icon: Icon, isActive }: { to: string, label: string, icon: React.FC<{ isActive: boolean }>, isActive: boolean }) => (
    <NavLink to={to} className={`flex flex-col items-center justify-center space-y-1 ${isActive ? 'text-brand-primary' : 'text-brand-secondary'} hover:text-brand-primary transition-colors`}>
        <Icon isActive={isActive} />
        <span className="text-xs">{label}</span>
    </NavLink>
);

const BottomNav: React.FC = () => {
    const { whatsappNumber } = useProducts();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I would like to inquire about your products.")}`;
    const location = useLocation();

    const isHomeActive = location.pathname === '/';
    const onProductsPage = location.pathname === '/products';
    const isFilterView = onProductsPage && location.search.includes('filter=open');
    
    const isSearchActive = onProductsPage && !isFilterView;
    const isCategoryActive = isFilterView;
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-brand-surface border-t border-brand-border shadow-lg z-40 grid grid-cols-4">
            <NavItem to="/" label="Home" icon={HomeIcon} isActive={isHomeActive} />
            <NavItem to="/products" label="Search" icon={SearchIcon} isActive={isSearchActive} />
            <NavItem to="/products?filter=open" label="Category" icon={CategoryIcon} isActive={isCategoryActive} />
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center space-y-1 text-brand-secondary hover:text-brand-primary transition-colors">
                <WhatsappIcon />
                <span className="text-xs">WhatsApp</span>
            </a>
        </nav>
    );
};

export default BottomNav;