'use client';

import { motion } from 'framer-motion';
import { Briefcase, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import { iconMap } from '@/components/shared/IconMap';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const ServicesPage = ({ services, setCurrentPage, setSelectedService }) => (
  <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20 relative overflow-hidden">
    {/* Enhanced Background */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
    <FloatingOrbs />
    <div className="container mx-auto px-6 py-16 relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">
          What We Offer
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our <span className="text-gradient-orange">Services</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive B2B solutions tailored to accelerate your business growth
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {services.map((service) => {
          const IconComponent = iconMap[service.iconName] || Briefcase;
          return (
            <motion.div key={service.id} variants={fadeInUp}>
              {/* Liquid Glass Card */}
              <div className="group relative p-6 h-full cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" onClick={() => {
                setSelectedService(service);
                setCurrentPage('service-detail');
              }}>
                {/* Liquid Glass Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/50 via-pink-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
                  <div className="h-full w-full bg-white/90 backdrop-blur-xl rounded-2xl" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-orange-500 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{service.shortDescription}</p>
                  <Button
                    variant="ghost"
                    className="p-0 text-orange-500 hover:text-orange-600 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(service);
                      setCurrentPage('service-detail');
                    }}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </div>
);

export default ServicesPage;
