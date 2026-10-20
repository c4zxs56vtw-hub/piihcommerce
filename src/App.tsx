/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TopGearSection } from './components/TopGearSection';
import { SegmentedShowcase } from './components/SegmentedShowcase';
import { ProductCatalog } from './components/ProductCatalog';
import { LookbookCarousel } from './components/LookbookCarousel';
import { MaterialScience } from './components/MaterialScience';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LookbookStudioModal } from './components/LookbookStudioModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ToastContainer } from './components/ToastContainer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { AuthModal } from './components/AuthModal';
import { authService } from './features/auth/services/authService';
import { useAuth } from './hooks/useAuth';

export default function App() {
  // Détecte si l'URL courante correspond à l'administration (#admin ou /admin)
  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');
  };

  const [isAdmin, setIsAdmin] = useState(checkIsAdminRoute);

  // État de la modale Connexion / Inscription
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // État d'authentification réactif (connexion, déconnexion, expiration, 401)
  const auth = useAuth();
  // L'espace admin exige un compte ADMIN, pas seulement un jeton valide
  const canAccessAdmin = auth.isAuthenticated && auth.isAdmin;

  // Écoute les changements d'ancre URL (#admin) et de navigation historique (popstate)
  useEffect(() => {
    const handleRouteSync = () => {
      setIsAdmin(checkIsAdminRoute());
    };

    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  const handleOpenAdmin = () => {
    setIsAdmin(true);
    window.location.hash = '#admin';
  };

  const handleCloseAdmin = () => {
    setIsAdmin(false);
    if (window.location.hash === '#admin') {
      history.pushState(null, '', window.location.pathname);
    } else if (window.location.pathname.startsWith('/admin')) {
      history.pushState(null, '', '/');
    }
  };

  const handleLogout = () => {
    authService.logout();
    handleCloseAdmin();
  };

  return (
    <CartProvider>
      {isAdmin ? (
        canAccessAdmin ? (
          <AdminDashboard
            onLogout={handleLogout}
            onBackToStore={handleCloseAdmin}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={() => {
              /* L'état se met à jour via useAuth */
            }}
            onCancel={handleCloseAdmin}
          />
        )
      ) : (
        <div className="min-h-screen bg-[#E8ECEE] text-[#111315] font-sans antialiased selection:bg-black selection:text-white flex flex-col relative">
          {/* Navigation avec bouton Compte / Connexion */}
          <Header onOpenAuth={() => setIsAuthModalOpen(true)} />

          {/* Main Content Sections */}
          <main className="flex-1">
            <HeroSection />
            <TopGearSection />
            <SegmentedShowcase />
            <ProductCatalog />
            <LookbookCarousel />
            <MaterialScience />
            <NewsletterSection />
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Interactive Modals, Drawers & Feedback Overlays */}
          <ProductDetailModal />
          <LookbookStudioModal />
          <CartDrawer />
          <WishlistDrawer />
          <ToastContainer />
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onOpenAdmin={() => {
              setIsAuthModalOpen(false);
              handleOpenAdmin();
            }}
          />
        </div>
      )}
    </CartProvider>
  );
}
