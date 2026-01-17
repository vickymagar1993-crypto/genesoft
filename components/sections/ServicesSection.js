'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, Grid3x3, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import GlassCard from '@/components/shared/GlassCard';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import { iconMap } from '@/components/shared/IconMap';
import { staggerContainer } from '@/lib/animations';

const ServicesSection = ({ services, setCurrentPage, setSelectedService }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  
  // Filter featured services from database
  const featuredServices = services.filter(s => s.isFeatured).slice(0, 6);
  
  // If no featured services, show first 6
  const displayServices = featuredServices.length > 0 ? featuredServices : services.slice(0, 6);
  
  return (
    <>
      <section className="py-24 bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20 relative overflow-hidden">
        {/* Enhanced Cool Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <FloatingOrbs />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Solutions That <span className="text-gradient-orange">Drive Results</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive B2B services designed to accelerate your growth and maximize ROI
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {displayServices.map((service, i) => {
              const IconComponent = iconMap[service.iconName] || Briefcase;
              return (
                <motion.div 
                  key={service.id} 
                  variants={{
                    initial: { opacity: 0, y: 40, scale: 0.95 },
                    animate: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { duration: 0.5, ease: "easeOut" }
                    }
                  }}
                >
                  {/* Liquid Glass Card */}
                  <div className="group relative p-6 h-full cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Liquid Glass Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 " />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/50 via-pink-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
                      <div className="h-full w-full bg-white/90  rounded-2xl" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-500 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.shortDescription}</p>
                      <Button
                        variant="ghost"
                        className="p-0 text-orange-500 hover:text-orange-600 group/btn"
                        onClick={() => {
                          setSelectedService(service);
                          setCurrentPage('service-detail');
                        }}
                      >
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View All Services Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              onClick={() => setShowAllModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Grid3x3 className="w-5 h-5 mr-2" />
              View All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* All Services Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center">
              All Our <span className="text-gradient-orange">Services</span>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
              {services.map((service) => {
                const IconComponent = iconMap[service.iconName] || Briefcase;
                return (
                  <div key={service.id}>
                    {/* Liquid Glass Card - Same as Homepage */}
                    <div className="group relative p-5 h-full cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      {/* Liquid Glass Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 " />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Animated Border Glow */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(251,146,60,0.5)]" />
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.shortDescription}</p>
                        <Button
                          variant="ghost"
                          className="p-0 text-orange-500 hover:text-orange-600 group/btn text-sm"
                          onClick={() => {
                            setSelectedService(service);
                            setCurrentPage('service-detail');
                            setShowAllModal(false);
                          }}
                        >
                          Learn More
                          <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesSection;
