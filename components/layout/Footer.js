'use client';

import { Sparkles, Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


const Footer = ({ setCurrentPage, siteSettings }) => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {siteSettings?.footerLogoUrl ? (
          <img
            src={siteSettings.footerLogoUrl}
            alt="Genesoft Infotech"
            className="h-10 w-auto"
          />  ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm max-w-xs mb-6">
            Empowering B2B enterprises with premium market research, strategic digital solutions, and actionable insights.
          </p>
          <div className="flex gap-4">
            <a href={siteSettings?.linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href={siteSettings?.twitterUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={siteSettings?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={siteSettings?.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><button onClick={() => setCurrentPage('services')} className="hover:text-orange-400 transition-colors">Market Research</button></li>
            <li><button onClick={() => setCurrentPage('services')} className="hover:text-orange-400 transition-colors">Data Analytics</button></li>
            <li><button onClick={() => setCurrentPage('services')} className="hover:text-orange-400 transition-colors">Lead Generation</button></li>
            <li><button onClick={() => setCurrentPage('services')} className="hover:text-orange-400 transition-colors">Digital Solutions</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><button onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition-colors">About Us</button></li>
            <li><button onClick={() => setCurrentPage('careers')} className="hover:text-orange-400 transition-colors">Careers</button></li>
            <li><button onClick={() => setCurrentPage('contact')} className="hover:text-orange-400 transition-colors">Contact</button></li>
            <li><button onClick={() => setCurrentPage('blog')} className="hover:text-orange-400 transition-colors">Blog</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {siteSettings?.companyEmail || 'info@genesoftinfotech.com'}
            </li>
            {siteSettings?.companyPhone && (
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {siteSettings.companyPhone}
              </li>
            )}
            {siteSettings?.companyAddress && (
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-xs">{siteSettings.companyAddress}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Genesoft Infotech. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-gray-400">
          <button onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition-colors">Privacy Policy</button>
          <button onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition-colors">Terms of Service</button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
