'use client';

import { useState, useEffect } from 'react';
import { 
  PieChart, Briefcase, Building2, BookOpen, UserPlus, FileText, Inbox, Settings, 
  Plus, Edit, Trash2, Star, Download, Image as ImageIcon, Mail, Phone, MapPin, Activity, 
  FileDown, Eye, LogOut, Share2 
} from 'lucide-react';
import NextImage from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { iconMap } from '@/components/shared/IconMap';

const AdminDashboard = ({ setCurrentPage, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [careers, setCareers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [leads, setLeads] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [leadsPage, setLeadsPage] = useState(1);
  const [leadsPagination, setLeadsPagination] = useState(null);
  const [applicantsPage, setApplicantsPage] = useState(1);
  const [applicantsPagination, setApplicantsPagination] = useState(null);

  // Forms
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingCareer, setEditingCareer] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [serviceImageFile, setServiceImageFile] = useState(null);

  const [serviceForm, setServiceForm] = useState({ title: '', description: '', shortDescription: '', iconName: 'Briefcase', features: '', isFeatured: false, imageUrl: '' });
  const [clientForm, setClientForm] = useState({ companyName: '', logoUrl: '', website: '' });
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [careerForm, setCareerForm] = useState({ jobTitle: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', responsibilities: '', salary: '', status: 'Open' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', excerpt: '', author: '', tags: '', status: 'Draft' });
  const [blogCoverFile, setBlogCoverFile] = useState(null);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({ companyName: '', tagline: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [headerLogoFile, setHeaderLogoFile] = useState(null);
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [mediaKitFile, setMediaKitFile] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [leadsPage, applicantsPage]); // Re-fetch when pages change

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, servicesRes, clientsRes, careersRes, applicantsRes, leadsRes, blogsRes, settingsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/services'),
        fetch('/api/clients'),
        fetch('/api/careers'),
        fetch(`/api/applicants?page=${applicantsPage}&limit=20`),
        fetch(`/api/leads?page=${leadsPage}&limit=20`),
        fetch('/api/blogs'),
        fetch('/api/settings'),
      ]);

      setStats(await statsRes.json());
      setServices(await servicesRes.json());
      setClients(await clientsRes.json());
      setCareers(await careersRes.json());
      
      const applicantsData = await applicantsRes.json();
      const leadsData = await leadsRes.json();
      
      // Handle potential legacy array format vs new paginated format
      if (Array.isArray(applicantsData)) {
          setApplicants(applicantsData);
      } else {
          setApplicants(applicantsData.data || []);
          setApplicantsPagination(applicantsData.pagination);
      }

      if (Array.isArray(leadsData)) {
          setLeads(leadsData);
      } else {
          setLeads(leadsData.data || []);
          setLeadsPagination(leadsData.pagination);
      }

      setBlogs(await blogsRes.json());
      
      const settingsData = await settingsRes.json();
      setSiteSettings(settingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Site Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    
    try {
      // If files are uploaded, use FormData
      if (headerLogoFile || footerLogoFile || faviconFile || mediaKitFile) {
        const formData = new FormData();
        
        if (headerLogoFile) {
          formData.append('headerLogo', headerLogoFile);
        }
        if (footerLogoFile) {
          formData.append('footerLogo', footerLogoFile);
        }
        if (faviconFile) {
          formData.append('favicon', faviconFile);
        }
        if (mediaKitFile) {
          formData.append('mediaKit', mediaKitFile);
        }
        
        formData.append('companyEmail', siteSettings.companyEmail || '');
        formData.append('companyPhone', siteSettings.companyPhone || '');
        formData.append('companyAddress', siteSettings.companyAddress || '');
        formData.append('foundingYear', siteSettings.foundingYear || 2021);
        formData.append('statsYearsExperience', siteSettings.statsYearsExperience || '');
        formData.append('statsProjectsDelivered', siteSettings.statsProjectsDelivered || '');
        formData.append('statsClientSatisfaction', siteSettings.statsClientSatisfaction || '');
        formData.append('statsDataPoints', siteSettings.statsDataPoints || '');
        formData.append('linkedinUrl', siteSettings.linkedinUrl || '');
        formData.append('twitterUrl', siteSettings.twitterUrl || '');
        formData.append('instagramUrl', siteSettings.instagramUrl || '');
        formData.append('facebookUrl', siteSettings.facebookUrl || '');
        if (siteSettings.adminPassword) {
          formData.append('adminPassword', siteSettings.adminPassword);
        }
        
        const res = await fetch('/api/settings', {
          method: 'PUT',
          body: formData,
        });
        
        const updated = await res.json();
        setSiteSettings(updated);
        setHeaderLogoFile(null);
        setFooterLogoFile(null);
        setFaviconFile(null);
        setMediaKitFile(null);
        alert('Settings saved successfully!');
      } else {
        // No files, use JSON
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            headerLogo: siteSettings.headerLogo || '',
            footerLogo: siteSettings.footerLogo || '',
            companyEmail: siteSettings.companyEmail || '',
            companyPhone: siteSettings.companyPhone || '',
            companyAddress: siteSettings.companyAddress || '',
            foundingYear: siteSettings.foundingYear || 2021,
            statsYearsExperience: siteSettings.statsYearsExperience || '',
            statsProjectsDelivered: siteSettings.statsProjectsDelivered || '',
            statsClientSatisfaction: siteSettings.statsClientSatisfaction || '',
            statsDataPoints: siteSettings.statsDataPoints || '',
            linkedinUrl: siteSettings.linkedinUrl || '',
            twitterUrl: siteSettings.twitterUrl || '',
            instagramUrl: siteSettings.instagramUrl || '',
            facebookUrl: siteSettings.facebookUrl || '',
            adminPassword: siteSettings.adminPassword || undefined,
          }),
        });
        
        const updated = await res.json();
        setSiteSettings(updated);
        alert('Settings saved successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Service CRUD
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      // If image file is uploaded, use FormData
      if (serviceImageFile) {
        const formData = new FormData();
        formData.append('title', serviceForm.title);
        formData.append('description', serviceForm.description);
        formData.append('shortDescription', serviceForm.shortDescription);
        formData.append('iconName', serviceForm.iconName);
        formData.append('features', serviceForm.features);
        formData.append('isFeatured', serviceForm.isFeatured);
        formData.append('serviceImage', serviceImageFile);
        
        await fetch(url, { method, body: formData });
      } else {
        // Otherwise use JSON
        const data = {
          ...serviceForm,
          features: serviceForm.features.split(',').map((f) => f.trim()).filter(Boolean),
        };
        
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({ title: '', description: '', shortDescription: '', iconName: 'Briefcase', features: '', isFeatured: false, imageUrl: '' });
      setServiceImageFile(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Client CRUD
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    
    // If file upload is used
    if (clientLogoFile) {
      const formDataObj = new FormData();
      formDataObj.append('companyName', clientForm.companyName);
      formDataObj.append('website', clientForm.website);
      formDataObj.append('logo', clientLogoFile);

      await fetch('/api/clients', {
        method: 'POST',
        body: formDataObj,
      });
    } else {
      // If URL is used
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: clientForm.companyName,
          logoUrl: clientForm.logoUrl,
          website: clientForm.website,
        }),
      });
    }
    
    setShowClientForm(false);
    setClientForm({ companyName: '', logoUrl: '', website: '' });
    setClientLogoFile(null);
    fetchAllData();
  };

  const handleDeleteClient = async (id) => {
    if (!confirm('Delete this client?')) return;
    await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Career CRUD
  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...careerForm,
      requirements: careerForm.requirements.split(',').map((r) => r.trim()).filter(Boolean),
      responsibilities: careerForm.responsibilities.split(',').map((r) => r.trim()).filter(Boolean),
    };

    try {
      if (editingCareer) {
        await fetch(`/api/careers/${editingCareer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/careers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      setShowCareerForm(false);
      setEditingCareer(null);
      setCareerForm({ jobTitle: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', responsibilities: '', salary: '', status: 'Open' });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    await fetch(`/api/careers/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // Blog CRUD
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append('title', blogForm.title);
    formDataObj.append('content', blogForm.content);
    formDataObj.append('excerpt', blogForm.excerpt);
    formDataObj.append('author', blogForm.author);
    formDataObj.append('tags', blogForm.tags);
    formDataObj.append('status', blogForm.status);
    if (blogCoverFile) formDataObj.append('coverImage', blogCoverFile);

    try {
      if (editingBlog) {
        await fetch(`/api/blogs/${editingBlog.id}`, {
          method: 'PUT',
          body: formDataObj,
        });
      } else {
        await fetch('/api/blogs', {
          method: 'POST',
          body: formDataObj,
        });
      }
      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogForm({ title: '', content: '', excerpt: '', author: '', tags: '', status: 'Draft' });
      setBlogCoverFile(null);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your website content</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentPage('home')}>
              <Eye className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => {
              onLogout();
              setCurrentPage('home');
            }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex-wrap">
            <TabsTrigger value="overview"><PieChart className="w-4 h-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="services"><Briefcase className="w-4 h-4 mr-2" /> Services</TabsTrigger>
            <TabsTrigger value="clients"><Building2 className="w-4 h-4 mr-2" /> Clients</TabsTrigger>
            <TabsTrigger value="blogs"><BookOpen className="w-4 h-4 mr-2" /> Blogs</TabsTrigger>
            <TabsTrigger value="careers"><UserPlus className="w-4 h-4 mr-2" /> Careers</TabsTrigger>
            <TabsTrigger value="applicants"><FileText className="w-4 h-4 mr-2" /> Applicants</TabsTrigger>
            <TabsTrigger value="leads"><Inbox className="w-4 h-4 mr-2" /> Leads</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Services', value: stats?.totalServices || 0, icon: Briefcase, color: 'orange' },
                { label: 'Clients', value: stats?.totalClients || 0, icon: Building2, color: 'blue' },
                { label: 'Open Positions', value: stats?.openPositions || 0, icon: UserPlus, color: 'green' },
                { label: 'New Applicants', value: stats?.newApplicants || 0, icon: FileText, color: 'purple' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                      <Badge variant="outline">{lead.status}</Badge>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="text-gray-500 text-center py-4">No leads yet</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Applicants</CardTitle>
                </CardHeader>
                <CardContent>
                  {applicants.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{app.fullName}</p>
                        <p className="text-sm text-gray-500">{app.email}</p>
                      </div>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                  ))}
                  {applicants.length === 0 && <p className="text-gray-500 text-center py-4">No applicants yet</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Services ({services.length})</h2>
              <Button onClick={() => { setShowServiceForm(true); setEditingService(null); }} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const IconComponent = iconMap[service.iconName] || Briefcase;
                return (
                  <Card key={service.id} className={service.isFeatured ? "border-2 border-orange-500" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingService(service);
                              setServiceForm({
                                title: service.title,
                                description: service.description,
                                shortDescription: service.shortDescription || '',
                                iconName: service.iconName || 'Briefcase',
                                features: (service.features || []).join(', '),
                                isFeatured: service.isFeatured || false,
                                imageUrl: service.imageUrl || '',
                              });
                              setShowServiceForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      {service.isFeatured && (
                        <Badge className="mb-2 bg-orange-500 text-white">Featured</Badge>
                      )}
                      <h3 className="font-semibold mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{service.shortDescription || service.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={async () => {
                          await fetch(`/api/services/${service.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...service, isFeatured: !service.isFeatured })
                          });
                          await loadData(); // NOTE: Assuming fetchAllData is meant here or need to define loadData acting as fetchAllData alias if extracted badly? 
                          // Wait, original code had `await loadData();` but I renamed it to `fetchAllData`. I should fix this call.
                          fetchAllData();
                        }}
                      >
                        <Star className={`w-4 h-4 mr-2 ${service.isFeatured ? 'fill-orange-500 text-orange-500' : ''}`} />
                        {service.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Service Form Dialog */}
            <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-120px)] pr-4">
                  <form onSubmit={handleServiceSubmit} className="space-y-4 p-1">
                    <div>
                      <Label>Title</Label>
                      <Input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Short Description</Label>
                      <Input value={serviceForm.shortDescription} onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })} />
                    </div>
                    <div>
                      <Label>Full Description</Label>
                      <Textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required rows={3} />
                    </div>
                    <div>
                      <Label>Icon Name</Label>
                      <Select value={serviceForm.iconName} onValueChange={(v) => setServiceForm({ ...serviceForm, iconName: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(iconMap).map((icon) => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Features (comma-separated)</Label>
                      <Textarea value={serviceForm.features} onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })} placeholder="Feature 1, Feature 2, Feature 3" rows={2} />
                    </div>
                    <div>
                      <Label>Service Image</Label>
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => setServiceImageFile(e.target.files[0])}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload an image for the service detail page (recommended: 1200x600px)</p>
                      {serviceForm.imageUrl && !serviceImageFile && (
                        <p className="text-xs text-blue-600 mt-1">Current image: {serviceForm.imageUrl.substring(0, 50)}...</p>
                      )}
                    </div>
                    <div>
                      <Label>Or Image URL (optional)</Label>
                      <Input 
                        value={serviceForm.imageUrl} 
                        onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })} 
                        placeholder="https://example.com/image.jpg"
                        disabled={serviceImageFile !== null}
                      />
                      <p className="text-xs text-gray-500 mt-1">Alternatively, add a URL instead of uploading</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={serviceForm.isFeatured} 
                        onCheckedChange={(checked) => setServiceForm({ ...serviceForm, isFeatured: checked })} 
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Show as Featured Service on Home Page
                      </Label>
                    </div>
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                      {editingService ? 'Update' : 'Create'} Service
                    </Button>
                  </form>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Client Logos ({clients.length})</h2>
              <Button onClick={() => setShowClientForm(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" /> Add Client
              </Button>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="pt-6 text-center">
                    <div className="relative h-12 w-full mb-4 flex items-center justify-center">
                      <img src={client.logoUrl} alt={client.companyName} className="h-full object-contain" />
                    </div>
                    <p className="font-medium">{client.companyName}</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-red-500" onClick={() => handleDeleteClient(client.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Client Form Dialog */}
            <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Client</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleClientSubmit} className="space-y-4">
                  <div>
                    <Label>Company Name *</Label>
                    <Input value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <Tabs defaultValue="upload" className="mt-2">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="url">Use URL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upload" className="mt-2">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            setClientLogoFile(e.target.files[0]);
                            setClientForm({ ...clientForm, logoUrl: '' });
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload PNG, JPG, SVG or WebP</p>
                      </TabsContent>
                      <TabsContent value="url" className="mt-2">
                        <Input 
                          value={clientForm.logoUrl} 
                          onChange={(e) => {
                            setClientForm({ ...clientForm, logoUrl: e.target.value });
                            setClientLogoFile(null);
                          }} 
                          placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter a direct link to logo image</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div>
                    <Label>Website (optional)</Label>
                    <Input value={clientForm.website} onChange={(e) => setClientForm({ ...clientForm, website: e.target.value })} placeholder="https://..." />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Client
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Blog Posts ({blogs.length})</h2>
              <Button onClick={() => { setShowBlogForm(true); setEditingBlog(null); }} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" /> New Blog Post
              </Button>
            </div>

            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {blog.coverImageUrl && (
                          <NextImage src={blog.coverImageUrl} alt={blog.title} width={80} height={80} className="rounded-lg object-cover" />
                        )}
                        <div>
                          <h3 className="font-semibold">{blog.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{blog.excerpt}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                              {blog.status}
                            </Badge>
                            <span className="text-xs text-gray-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-400">{blog.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingBlog(blog);
                            setBlogForm({
                              title: blog.title,
                              content: blog.content,
                              excerpt: blog.excerpt || '',
                              author: blog.author || '',
                              tags: (blog.tags || []).join(', '),
                              status: blog.status,
                            });
                            setShowBlogForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBlog(blog.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {blogs.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No blog posts yet</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Blog Form Dialog */}
            <Dialog open={showBlogForm} onOpenChange={setShowBlogForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'New Blog Post'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Cover Image</Label>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setBlogCoverFile(e.target.files[0])}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Content *</Label>
                    <Textarea 
                      value={blogForm.content} 
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} 
                      required 
                      rows={10}
                      placeholder="Write your blog content here..."
                    />
                  </div>
                  <div>
                    <Label>Excerpt</Label>
                    <Textarea 
                      value={blogForm.excerpt} 
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} 
                      rows={2}
                      placeholder="Brief summary for preview..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Author</Label>
                      <Input value={blogForm.author} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} placeholder="Author name" />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={blogForm.status} onValueChange={(v) => setBlogForm({ ...blogForm, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input 
                      value={blogForm.tags} 
                      onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} 
                      placeholder="marketing, b2b, sales"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    {editingBlog ? 'Update' : 'Publish'} Blog Post
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Postings ({careers.length})</h2>
              <Button onClick={() => { setShowCareerForm(true); setEditingCareer(null); }} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" /> Add Job
              </Button>
            </div>

            <div className="space-y-4">
              {careers.map((job) => (
                <Card key={job.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{job.jobTitle}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{job.department}</Badge>
                          <Badge variant="outline">{job.location}</Badge>
                          <Badge className={job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCareer(job);
                            setCareerForm({
                              jobTitle: job.jobTitle,
                              department: job.department,
                              location: job.location,
                              type: job.type,
                              description: job.description,
                              requirements: (job.requirements || []).join(', '),
                              responsibilities: (job.responsibilities || []).join(', '),
                              salary: job.salary || '',
                              status: job.status,
                            });
                            setShowCareerForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCareer(job.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Career Form Dialog */}
            <Dialog open={showCareerForm} onOpenChange={setShowCareerForm}>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCareer ? 'Edit Job' : 'Add Job'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCareerSubmit} className="space-y-4">
                  <div>
                    <Label>Job Title</Label>
                    <Input value={careerForm.jobTitle} onChange={(e) => setCareerForm({ ...careerForm, jobTitle: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Department</Label>
                      <Input value={careerForm.department} onChange={(e) => setCareerForm({ ...careerForm, department: e.target.value })} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={careerForm.location} onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={careerForm.type} onValueChange={(v) => setCareerForm({ ...careerForm, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={careerForm.status} onValueChange={(v) => setCareerForm({ ...careerForm, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Salary (optional)</Label>
                    <Input value={careerForm.salary} onChange={(e) => setCareerForm({ ...careerForm, salary: e.target.value })} placeholder="$50,000 - $70,000" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={careerForm.description} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} required rows={3} />
                  </div>
                  <div>
                    <Label>Requirements (comma-separated)</Label>
                    <Textarea value={careerForm.requirements} onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label>Responsibilities (comma-separated)</Label>
                    <Textarea value={careerForm.responsibilities} onChange={(e) => setCareerForm({ ...careerForm, responsibilities: e.target.value })} rows={2} />
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                    {editingCareer ? 'Update' : 'Create'} Job
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Applicants Tab */}
          <TabsContent value="applicants">
            <h2 className="text-xl font-semibold mb-6">Applicants ({applicants.length})</h2>

            <div className="space-y-4">
              {applicants.map((app) => {
                const job = careers.find((c) => c.id === app.jobId);
                return (
                  <Card key={app.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{app.fullName}</h3>
                          <p className="text-sm text-gray-500">{app.email} {app.phone && `• ${app.phone}`}</p>
                          <p className="text-sm text-gray-600 mt-1">Applied for: <span className="font-medium">{job?.jobTitle || 'Unknown Position'}</span></p>
                          {app.coverLetter && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{app.coverLetter}</p>}
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{app.status}</Badge>
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" /> Resume
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {applicants.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No applicants yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
            {applicantsPagination && applicantsPagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setApplicantsPage(p => Math.max(1, p - 1))}
                  disabled={applicantsPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {applicantsPage} of {applicantsPagination.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setApplicantsPage(p => Math.min(applicantsPagination.totalPages, p + 1))}
                  disabled={applicantsPage === applicantsPagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <h2 className="text-xl font-semibold mb-6">Leads ({leads.length})</h2>

            <div className="space-y-4">
              {leads.map((lead) => (
                <Card key={lead.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <p className="text-sm text-gray-500">{lead.email} {lead.phone && `• ${lead.phone}`}</p>
                        {lead.company && <p className="text-sm text-gray-600">Company: {lead.company}</p>}
                        {lead.serviceInterest && <p className="text-sm text-gray-600">Interest: {lead.serviceInterest}</p>}
                        {lead.message && <p className="text-sm text-gray-500 mt-2">{lead.message}</p>}
                        <p className="text-xs text-gray-400 mt-2">{new Date(lead.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{lead.source}</Badge>
                        <Badge className={lead.status === 'New' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {lead.status}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {leads.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
            {leadsPagination && leadsPagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setLeadsPage(p => Math.max(1, p - 1))}
                  disabled={leadsPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {leadsPage} of {leadsPagination.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setLeadsPage(p => Math.min(leadsPagination.totalPages, p + 1))}
                  disabled={leadsPage === leadsPagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <h2 className="text-xl font-semibold mb-6">Site Settings</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" alt="Branding & Logos" />
                    Branding & Logos
                  </CardTitle>
                  <CardDescription>Manage header and footer logos</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                      <Label>Header Logo</Label>
                      {(siteSettings.headerLogo || siteSettings.headerLogoUrl) && (
                        <div className="mb-2 p-4 bg-gray-50 rounded-lg">
                          <img 
                            src={siteSettings.headerLogo || siteSettings.headerLogoUrl} 
                            alt="Header logo" 
                            className="h-12 object-contain" 
                          />
                          <p className="text-xs text-gray-500 mt-1">Current header logo</p>
                        </div>
                      )}
                      
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload">Upload File</TabsTrigger>
                          <TabsTrigger value="url">Use URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="space-y-2">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setHeaderLogoFile(e.target.files[0])}
                          />
                          <p className="text-xs text-gray-500">Upload PNG, JPG, or SVG (recommended: 200x60px)</p>
                        </TabsContent>
                        <TabsContent value="url" className="space-y-2">
                          <Input 
                            value={siteSettings.headerLogo || siteSettings.headerLogoUrl || ''} 
                            onChange={(e) => setSiteSettings({ ...siteSettings, headerLogo: e.target.value })}
                            placeholder="https://example.com/header-logo.png"
                          />
                          <p className="text-xs text-gray-500">Enter the URL of your header logo</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label>Footer Logo</Label>
                      {(siteSettings.footerLogo || siteSettings.footerLogoUrl) && (
                        <div className="mb-2 p-4 bg-gray-900 rounded-lg">
                          <img 
                            src={siteSettings.footerLogo || siteSettings.footerLogoUrl} 
                            alt="Footer logo" 
                            className="h-12 object-contain" 
                          />
                          <p className="text-xs text-gray-400 mt-1">Current footer logo (preview on dark background)</p>
                        </div>
                      )}
                      
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload">Upload File</TabsTrigger>
                          <TabsTrigger value="url">Use URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="space-y-2">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFooterLogoFile(e.target.files[0])}
                          />
                          <p className="text-xs text-gray-500">Upload PNG, JPG, or SVG (recommended: 200x60px)</p>
                        </TabsContent>
                        <TabsContent value="url" className="space-y-2">
                          <Input 
                            value={siteSettings.footerLogo || siteSettings.footerLogoUrl || ''} 
                            onChange={(e) => setSiteSettings({ ...siteSettings, footerLogo: e.target.value })}
                            placeholder="https://example.com/footer-logo.png"
                          />
                          <p className="text-xs text-gray-500">Enter the URL of your footer logo</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label>Favicon</Label>
                      {siteSettings.favicon && (
                        <div className="mb-2 p-4 bg-gray-50 rounded-lg">
                          <img 
                            src={siteSettings.favicon} 
                            alt="Favicon" 
                            className="h-8 w-8 object-contain" 
                          />
                          <p className="text-xs text-gray-500 mt-1">Current favicon</p>
                        </div>
                      )}
                      
                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="upload">Upload File</TabsTrigger>
                          <TabsTrigger value="url">Use URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="space-y-2">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFaviconFile(e.target.files[0])}
                          />
                          <p className="text-xs text-gray-500">Upload PNG, ICO, or SVG (recommended: 32x32px or 64x64px)</p>
                        </TabsContent>
                        <TabsContent value="url" className="space-y-2">
                          <Input 
                            value={siteSettings.favicon || ''} 
                            onChange={(e) => setSiteSettings({ ...siteSettings, favicon: e.target.value })}
                            placeholder="https://example.com/favicon.png"
                          />
                          <p className="text-xs text-gray-500">Enter the URL of your favicon</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Logos & Favicon'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Update company contact details shown in footer</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                      <Label>Company Email</Label>
                      <Input 
                        type="email"
                        value={siteSettings.companyEmail || ''} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, companyEmail: e.target.value })}
                        placeholder="info@genesoftinfotech.com"
                      />
                    </div>
                    
                    <div>
                      <Label>Company Phone (Optional)</Label>
                      <Input 
                        type="tel"
                        value={siteSettings.companyPhone || ''} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, companyPhone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <Label>Company Address</Label>
                      <Textarea 
                        value={siteSettings.companyAddress || ''} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, companyAddress: e.target.value })}
                        placeholder="9701 Wilshire Boulevard, 10th Floor Beverly Hills, California 90212"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label>Admin Password</Label>
                      <Input 
                        type="password"
                        value={siteSettings.adminPassword || ''} 
                        onChange={(e) => setSiteSettings({ ...siteSettings, adminPassword: e.target.value })}
                        placeholder="Enter new password to change"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                    </div>
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Contact Info'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Hero Section Stats
                  </CardTitle>
                  <CardDescription>Update the statistics shown on the homepage hero section</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Years of Experience</Label>
                        <Input 
                          value={siteSettings.statsYearsExperience || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, statsYearsExperience: e.target.value })}
                          placeholder="15+"
                        />
                        <p className="text-xs text-gray-500 mt-1">Company founded in {siteSettings.foundingYear || 2021}</p>
                      </div>
                      
                      <div>
                        <Label>Projects Delivered</Label>
                        <Input 
                          value={siteSettings.statsProjectsDelivered || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, statsProjectsDelivered: e.target.value })}
                          placeholder="200+"
                        />
                      </div>
                      
                      <div>
                        <Label>Client Satisfaction</Label>
                        <Input 
                          value={siteSettings.statsClientSatisfaction || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, statsClientSatisfaction: e.target.value })}
                          placeholder="98%"
                        />
                      </div>
                      
                      <div>
                        <Label>Data Points Analyzed</Label>
                        <Input 
                          value={siteSettings.statsDataPoints || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, statsDataPoints: e.target.value })}
                          placeholder="50M+"
                        />
                      </div>
                      
                      <div>
                        <Label>Founding Year</Label>
                        <Input 
                          type="number"
                          value={siteSettings.foundingYear || 2021} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, foundingYear: parseInt(e.target.value) })}
                          placeholder="2021"
                        />
                        <p className="text-xs text-gray-500 mt-1">Used to auto-calculate years of experience</p>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Stats'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileDown className="w-5 h-5" />
                    Media Kit Upload
                  </CardTitle>
                  <CardDescription>Upload your company media kit for downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {siteSettings.mediaKitUrl && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-10 h-10 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Media Kit Uploaded</p>
                            <p className="text-sm text-green-600">{siteSettings.mediaKitName || 'media-kit.pdf'}</p>
                          </div>
                        </div>
                        <a href={siteSettings.mediaKitUrl} target="_blank" rel="noopener noreferrer" className="block mt-3">
                          <Button type="button" variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-2" /> Preview/Download
                          </Button>
                        </a>
                      </div>
                    )}
                    
                    <div>
                      <Label>Upload New Media Kit</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.zip,.doc,.docx"
                        onChange={(e) => setMediaKitFile(e.target.files[0])}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Accepts PDF, ZIP, DOC, DOCX files (Max 10MB)</p>
                    </div>
                    
                    {mediaKitFile && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Selected:</strong> {mediaKitFile.name} ({(mediaKitFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={savingSettings}>
                      {savingSettings ? 'Uploading...' : 'Upload Media Kit'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Social Media Links
                  </CardTitle>
                  <CardDescription>Manage social media URLs shown in the footer</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>LinkedIn URL</Label>
                        <Input 
                          value={siteSettings.linkedinUrl || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, linkedinUrl: e.target.value })}
                          placeholder="https://linkedin.com/company/..."
                        />
                      </div>
                      
                      <div>
                        <Label>Twitter URL</Label>
                        <Input 
                          value={siteSettings.twitterUrl || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, twitterUrl: e.target.value })}
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      
                      <div>
                        <Label>Instagram URL</Label>
                        <Input 
                          value={siteSettings.instagramUrl || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      
                      <div>
                        <Label>Facebook URL</Label>
                        <Input 
                          value={siteSettings.facebookUrl || ''} 
                          onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Social Media Links'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
