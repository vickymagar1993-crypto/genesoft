'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, MapPin, Clock, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FloatingOrbs from '@/components/shared/FloatingOrbs';
import GlassCard from '@/components/shared/GlassCard';
import PhoneInputWithCode from '@/components/shared/PhoneInputWithCode';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const CareersPage = ({ careers }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', coverLetter: '', countryCode: '+1' });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('fullName', formData.fullName);
      formDataObj.append('email', formData.email);
      formDataObj.append('phone', `${formData.countryCode} ${formData.phone}`);
      formDataObj.append('coverLetter', formData.coverLetter);
      formDataObj.append('jobId', selectedJob.id);
      if (resumeFile) formDataObj.append('resume', resumeFile);

      const res = await fetch('/api/applicants', { method: 'POST', body: formDataObj });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowApplyDialog(false);
          setSubmitSuccess(false);
          setFormData({ fullName: '', email: '', phone: '', coverLetter: '', countryCode: '+1' });
          setResumeFile(null);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const openJobs = careers.filter((c) => c.status === 'Open');

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-white">
      <FloatingOrbs />
      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">
            <Briefcase className="w-4 h-4 mr-2" />
            Join Our Team
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Career <span className="text-gradient-orange">Opportunities</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join a team of passionate professionals dedicated to transforming B2B growth
          </p>
        </motion.div>

        {openJobs.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Open Positions</h3>
            <p className="text-gray-500">Check back later for new opportunities!</p>
          </GlassCard>
        ) : (
          <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
            {openJobs.map((job) => (
              <motion.div key={job.id} variants={fadeInUp}>
                <GlassCard className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="border-orange-200 text-orange-600">
                          <Building2 className="w-3 h-3 mr-1" />
                          {job.department}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </Badge>
                      </div>
                      {job.salary && <p className="text-sm text-gray-600">{job.salary}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedJob(job)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{job.jobTitle}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <p className="text-gray-600">{job.description}</p>
                            {job.requirements?.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Requirements</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {job.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {job.responsibilities?.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">Responsibilities</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {job.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowApplyDialog(true);
                        }}
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Apply Dialog */}
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.jobTitle}</DialogTitle>
            </DialogHeader>
            {submitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Application Submitted!</h3>
                <p className="text-gray-500">We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="apply-name">Full Name *</Label>
                  <Input
                    id="apply-name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apply-email">Email *</Label>
                  <Input
                    id="apply-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apply-phone">Phone</Label>
                  <PhoneInputWithCode
                    id="apply-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    countryCode={formData.countryCode}
                    onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                  />
                </div>
                <div>
                  <Label htmlFor="apply-resume">Resume (PDF/DOC) *</Label>
                  <Input
                    id="apply-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="apply-cover">Cover Letter</Label>
                  <Textarea
                    id="apply-cover"
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CareersPage;
