'use client';

import HeroSection from '@/components/sections/HeroSection';
import ClientLogosSection from '@/components/sections/ClientLogosSection';
import ServicesSection from '@/components/sections/ServicesSection';
import { StatsCounterSection, WhyChooseUsSection } from '@/components/sections/SocialProofSection';

const HomePage = ({ services, clients, setCurrentPage, setSelectedService, siteSettings }) => (
  <>
    <HeroSection setCurrentPage={setCurrentPage} siteSettings={siteSettings} />
    <StatsCounterSection siteSettings={siteSettings} />
    {services.length > 0 && <ServicesSection services={services} setCurrentPage={setCurrentPage} setSelectedService={setSelectedService} />}
    {clients.length > 0 && <ClientLogosSection clients={clients} />}
    <WhyChooseUsSection />
  </>
);

export default HomePage;
