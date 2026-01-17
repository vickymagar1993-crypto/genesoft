'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Award } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import CountingNumber from '@/components/shared/CountingNumber';


export const StatsCounterSection = ({ siteSettings = {} }) => (
  <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        className="grid md:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {[
          { label: 'Years of Experience', value: siteSettings?.statsYearsExperience || '5+' },
          { label: 'Projects Delivered', value: siteSettings?.statsProjectsDelivered || '200+' },
          { label: 'Client Satisfaction', value: siteSettings?.statsClientSatisfaction || '98%' },
          { label: 'Data Points Processed', value: siteSettings?.statsDataPoints || '50M+' },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <div className="text-center text-white bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-orange-300">
                <CountingNumber value={stat.value} duration={2} />
              </div>
              <p className="text-sm md:text-base text-orange-100">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export const WhyChooseUsSection = () => (
  <section className="py-4 md:py-6 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
    <div className="container mx-auto px-4 md:px-6 relative z-10">
      <motion.div
        className="text-center text-white mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Why Choose Us?</h2>
        <p className="text-orange-100 max-w-2xl mx-auto text-sm md:text-base">
          We deliver measurable results through proven methodologies and cutting-edge technology
        </p>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {[
          { icon: Shield, title: 'Data Security', desc: 'Enterprise-grade security protocols protect your valuable data' },
          { icon: Zap, title: 'Fast Turnaround', desc: 'Quick delivery without compromising on quality' },
          { icon: Award, title: 'Industry Expertise', desc: '4+ years of B2B sales and marketing experience' },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeInUp}>
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 text-center text-white flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-orange-100 text-xs md:text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);
