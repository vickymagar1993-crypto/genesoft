const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'genesoft_db';

// New services to add
const NEW_SERVICES = [
  {
    id: '11',
    title: 'Demand Generation',
    shortDescription: 'Drive qualified pipeline with integrated demand generation campaigns.',
    description: 'Fuel your sales pipeline with comprehensive demand generation strategies that combine inbound and outbound tactics. Our approach integrates content marketing, email nurture campaigns, webinars, paid advertising, and social media to attract, engage, and convert high-quality prospects. We create targeted campaigns aligned with buyer personas and journey stages, using marketing automation and lead scoring to identify sales-ready opportunities. Deliverables include campaign strategy and execution, content calendar and asset creation, multi-channel campaign management, lead nurture workflows, performance analytics and optimization reports, and MQL/SQL conversion tracking. Whether launching new products, entering new markets, or accelerating pipeline velocity, our demand generation programs deliver measurable results.',
    iconName: 'Megaphone',
    features: [
      'Multi-channel campaign strategy',
      'Content marketing & SEO',
      'Email nurture workflows',
      'Webinar & event programs',
      'Paid advertising (PPC, LinkedIn, etc.)',
      'Marketing automation setup',
      'Lead scoring & qualification',
      'Performance analytics & reporting'
    ],
    isFeatured: false
  },
  {
    id: '12',
    title: 'Content Syndication',
    shortDescription: 'Amplify your content reach and generate qualified leads through strategic distribution.',
    description: 'Extend the reach of your valuable content to targeted audiences across premium B2B publisher networks and industry-specific platforms. Our content syndication services place your whitepapers, eBooks, case studies, and thought leadership pieces in front of decision-makers actively researching solutions in your space. We manage the entire process from content optimization and distribution partner selection to lead delivery and quality assurance. Deliverables include syndication strategy and partner network access, content optimization for maximum engagement, targeted audience profiling and segmentation, real-time lead delivery with full contact details, lead validation and quality scoring, and detailed performance reporting with engagement metrics. Our syndication campaigns generate high-intent leads already familiar with your expertise, shortening sales cycles and improving conversion rates.',
    iconName: 'Share',
    features: [
      'Premium publisher network access',
      'Content optimization for syndication',
      'Targeted audience segmentation',
      'Multi-format content distribution',
      'Real-time lead delivery',
      'Lead validation & scoring',
      'Engagement tracking & analytics',
      'ROI and performance reporting'
    ],
    isFeatured: false
  }
];

async function addNewServices() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);

    // Check if services already exist
    const existing = await db.collection('services').findOne({ id: { $in: ['11', '12'] } });
    
    if (existing) {
      console.log('Services with ID 11 or 12 already exist. Updating instead...');
      for (const service of NEW_SERVICES) {
        await db.collection('services').updateOne(
          { id: service.id },
          { $set: service },
          { upsert: true }
        );
      }
      console.log('Updated 2 services.');
    } else {
      const result = await db.collection('services').insertMany(NEW_SERVICES);
      console.log(`Inserted ${result.insertedCount} new services (Demand Generation & Content Syndication).`);
    }

  } catch (err) {
    console.error('Error adding services:', err);
  } finally {
    await client.close();
  }
}

addNewServices();
