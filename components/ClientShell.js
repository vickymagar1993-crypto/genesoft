'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

// Pages
import HomePage from '@/components/pages/HomePage';
import ServicesPage from '@/components/pages/ServicesPage';
import ServiceDetailPage from '@/components/pages/ServiceDetailPage';
import BlogPage from '@/components/pages/BlogPage';
import BlogDetailPage from '@/components/pages/BlogDetailPage';
import CareersPage from '@/components/pages/CareersPage';
import ContactPage from '@/components/pages/ContactPage';
import AdminLogin from '@/components/auth/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard'; // Import dynamically if large

export default function ClientShell({ 
  initialServices = [], 
  initialClients = [], 
  initialCareers = [], 
  initialSettings = {} 
}) {
  // --- STATE ---
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // Data State (hydrated with initial props)
  const [services] = useState(initialServices);
  const [clients] = useState(initialClients);
  const [careers] = useState(initialCareers);
  const [siteSettings] = useState(initialSettings);

  // --- ADMIN SHORTCUT ---
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Shift + A to toggle admin
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentPage('admin');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // --- RENDER LOGIC ---
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            services={services} 
            clients={clients} 
            setCurrentPage={setCurrentPage} 
            setSelectedService={setSelectedService} 
            siteSettings={siteSettings} 
          />
        );
      case 'services':
        return (
          <ServicesPage 
            services={services} 
            setCurrentPage={setCurrentPage} 
            setSelectedService={setSelectedService} 
          />
        );
      case 'service-detail':
        return (
          <ServiceDetailPage 
            service={selectedService} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'blog':
        return (
          <BlogPage 
            setCurrentPage={setCurrentPage} 
            setSelectedBlog={setSelectedBlog} 
          />
        );
      case 'blog-detail':
        return (
          <BlogDetailPage 
            blog={selectedBlog} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'careers':
        return <CareersPage careers={careers} />;
      case 'contact':
        return <ContactPage services={services} />;
      case 'admin':
        return isAdminAuthenticated ? (
          <AdminDashboard setCurrentPage={setCurrentPage} onLogout={() => setIsAdminAuthenticated(false)} />
        ) : (
          <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />
        );
      default:
        return (
          <HomePage 
            services={services} 
            clients={clients} 
            setCurrentPage={setCurrentPage} 
            setSelectedService={setSelectedService} 
            siteSettings={siteSettings} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Layer */}
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        siteSettings={siteSettings} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Layer (hidden in Admin) */}
      {currentPage !== 'admin' && (
        <Footer setCurrentPage={setCurrentPage} siteSettings={siteSettings} />
      )}
    </div>
  );
}
