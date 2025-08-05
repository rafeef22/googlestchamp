import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';
import ProductFormPage from './pages/ProductFormPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MobileMenu from './components/MobileMenu';

const App: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // An auth route is any admin page or the login page itself.
  const isAuthRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className={`flex flex-col min-h-screen font-sans bg-brand-background text-brand-primary ${isMenuOpen ? 'overflow-hidden' : ''}`}>
      {!isAuthRoute && <Header onMenuToggle={() => setIsMenuOpen(prev => !prev)} />}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className={`flex-grow ${!isAuthRoute ? 'container mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/product/:id" element={<ProductFormPage />} />
          </Route>
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
      {/* Spacer div for the fixed bottom nav. h-24 = 6rem, matches original pb-24 for layout consistency. */}
      {!isAuthRoute && <div className="h-24" />}
      {!isAuthRoute && <BottomNav />}
    </div>
  );
};


export default App;
