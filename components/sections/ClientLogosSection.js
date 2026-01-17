'use client';

import { motion } from 'framer-motion';

import NextImage from 'next/image';

const ClientLogosSection = ({ clients }) => {
  // Duplicate clients array multiple times for seamless infinite loop
  const duplicatedClients = [...clients, ...clients, ...clients];
  
  return (
    <section className="py-16 bg-gradient-to-r from-orange-50/50 to-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-500 uppercase tracking-wider text-sm font-medium">Trusted By Industry Leaders</p>
        </motion.div>

        {/* Scrolling Container */}
        <div className="relative w-full">
          <motion.div
            className="flex gap-16 items-center"
            animate={{
              x: ["0%", "-33.33%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {duplicatedClients.map((client, i) => (
              <a
                key={`${client.id}-${i}`}
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center justify-center cursor-pointer hover:opacity-100 transition-opacity"
                style={{ minWidth: '150px' }}
              >
                <NextImage 
                  src={client.logoUrl} 
                  alt={client.companyName} 
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: 'auto', height: '48px' }}
                  className="object-contain opacity-80"
                />
              </a>
            ))}
          </motion.div>
          
          {/* Gradient Overlays for fade effect */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-orange-50/50 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
