'use client';

import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/shared/GlassCard';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import { iconMap } from '@/components/shared/IconMap';

import NextImage from 'next/image';

const ServiceDetailPage = ({ service, setCurrentPage }) => {
  const IconComponent = iconMap[service?.iconName] || Briefcase;

  if (!service) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>
      <FloatingOrbs />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="ghost"
            className="mb-8 text-orange-500"
            onClick={() => setCurrentPage('services')}
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Services
          </Button>

          <div className="max-w-5xl mx-auto">
            {/* Hero Banner with Image Background */}
            <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
              {/* Background Image */}
              {service.imageUrl ? (
                <div className="relative h-48 md:h-64">
                  <NextImage 
                    src={service.imageUrl} 
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/5" />
                  {/* Content over image */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-xl">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg">{service.title}</h1>
                    <p className="text-base text-white/90 max-w-xl drop-shadow-md">{service.shortDescription}</p>
                  </div>
                </div>
              ) : (
                /* Fallback gradient banner if no image */
                <div className="relative h-48 md:h-64 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
                  <div className="absolute inset-0 bg-black/5" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center mb-4 shadow-xl">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg">{service.title}</h1>
                    <p className="text-base text-white/90 max-w-xl drop-shadow-md">{service.shortDescription}</p>
                  </div>
                </div>
              )}
            </div>

            <GlassCard className="p-8 md:p-12 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-orange-600">Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line">{service.description}</p>

              <h3 className="text-xl font-semibold mb-6 text-orange-600">Key Features & Deliverables</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {service.features?.map((feature, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <div className="text-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 shadow-xl hover:shadow-2xl transition-all"
                onClick={() => setCurrentPage('contact')}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
