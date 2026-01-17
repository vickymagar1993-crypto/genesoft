import { getCollection } from '@/lib/db';
import ClientShell from '@/components/ClientShell';

// Force dynamic rendering to ensure data is always fresh
export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1. Fetch Data on SERVER
  const servicesCol = await getCollection('services');
  const servicesData = await servicesCol.find({}).sort({ sortOrder: 1 }).toArray();

  const clientsCol = await getCollection('clients');
  const clientsData = await clientsCol.find({}).sort({ sortOrder: 1 }).toArray();

  const careersCol = await getCollection('careers');
  const careersData = await careersCol.find({ status: 'Open' }).sort({ createdAt: -1 }).toArray();

  const settingsCol = await getCollection('settings');
  const settingsData = await settingsCol.findOne({ type: 'general' });

  // 2. Serialize Data (Mongo IDs are objects, must be strings for props)
  const serialize = (data) => JSON.parse(JSON.stringify(data));

  const safeServices = serialize(servicesData || []).map(s => ({
    ...s,
    title: s.title || s.name,
    iconName: s.iconName || s.icon || 'Sparkles',
    shortDescription: s.shortDescription || s.description,
    features: s.features || [],
  }));

  const safeClients = serialize(clientsData || []).map(c => ({
    ...c,
    companyName: c.companyName || c.name,
    logoUrl: c.logoUrl || c.logo,
    website: c.website || '#',
  }));

  const safeCareers = serialize(careersData || []);
  const safeSettings = serialize(settingsData || {});
  
  // Don't leak admin password to client!
  if (safeSettings.adminPassword) delete safeSettings.adminPassword;

  // 3. Render Client Shell with PRE-LOADED data
  return (
    <ClientShell
      initialServices={safeServices}
      initialClients={safeClients}
      initialCareers={safeCareers}
      initialSettings={safeSettings}
    />
  );
}