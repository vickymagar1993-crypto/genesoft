'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import PhoneInputWithCode from '@/components/shared/PhoneInputWithCode';

const HeroSection = ({ setCurrentPage, siteSettings }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const [showMediaKitModal, setShowMediaKitModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleMediaKitSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/mediakit/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        setDownloadReady(true);
        // Auto download trigger
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = 'Genesoft_MediaKit.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-orange-100 text-orange-600 border-orange-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              B2B Growth Solutions
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 leading-tight">
              {siteSettings?.tagline || "We Transform Data into Growth"}
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Empowering enterprises with premium market research, strategic digital solutions, and actionable insights that drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8 h-12 text-lg shadow-lg shadow-orange-500/25"
                onClick={() => setCurrentPage('contact')}
              >
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-12 text-lg"
                onClick={() => setCurrentPage('services')}
              >
                Explore Services
              </Button>
              
              <Dialog open={showMediaKitModal} onOpenChange={setShowMediaKitModal}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="lg" className="rounded-full h-12 text-lg text-gray-600 hover:text-orange-600">
                    <Download className="mr-2 w-5 h-5" /> Media Kit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Download Media Kit</DialogTitle>
                    <DialogDescription className="text-center">
                      Enter your details to receive our comprehensive media kit.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {downloadReady ? (
                     <div className="text-center py-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Download Started!</h3>
                        <p className="text-gray-500 mb-6">If it didn&apos;t start automatically, click below.</p>
                        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                          <a href={downloadUrl} download>Download Again</a>
                        </Button>
                     </div>
                  ) : (
                    <form onSubmit={handleMediaKitSubmit} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="mk-name">Full Name</Label>
                        <Input 
                          id="mk-name" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mk-email">Email Address</Label>
                        <Input 
                          id="mk-email" 
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mk-company">Company Name</Label>
                        <Input 
                          id="mk-company" 
                          required 
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Number</Label>
                        <PhoneInputWithCode 
                          value={formData.phone}
                          onChange={(val) => setFormData({...formData, phone: val})}
                        />
                      </div>
                      
                      <div className="space-y-2 flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="mk-consent"
                          required
                          checked={formData.consent || false}
                          onChange={e => setFormData({...formData, consent: e.target.checked})}
                          className="mt-1"
                        />
                        <label htmlFor="mk-consent" className="text-xs text-gray-600">
                          I consent to the collection and processing of my information for the purpose of receiving the media kit. I agree to be contacted by Genesoft Infotech regarding relevant updates and offers.
                        </label>
                      </div>
                      <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={submitting}>
                        {submitting ? 'Processing...' : 'Download Media Kit'}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
