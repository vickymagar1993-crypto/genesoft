const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'genesoft_db';

const NEW_SERVICES = [
  {
    id: '1',
    title: 'Quantitative Research',
    shortDescription: 'Data-driven insights through large-scale surveys, market sizing, and brand tracking studies.',
    description: 'Our Quantitative Research Services provide statistical precision to your decision-making. We conduct large-scale surveys, customer satisfaction tracking, market sizing, and advanced pricing studies like Conjoint and MaxDiff analysis.',
    iconName: 'BarChart3',
    features: [
      'Large-scale surveys and statistical studies',
      'Customer satisfaction tracking',
      'Market sizing and forecasting',
      'Product pricing studies (Conjoint, MaxDiff)',
      'Brand tracking studies'
    ],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Qualitative Research',
    shortDescription: 'Deep understanding of consumer behavior via focus groups and in-depth interviews.',
    description: 'Understand the "why" behind the numbers. Our Qualitative Research includes online communities, focus groups, in-depth interviews (IDIs), and persona development to uncover deep consumer motivations and journey maps.',
    iconName: 'Users',
    features: [
      'Focus groups (in-person or online)',
      'In-depth interviews (IDIs)',
      'Persona development & Journey mapping',
      'Usability and Concept testing',
      'Emotion and sentiment analysis'
    ],
    isFeatured: true
  },
  {
    id: '3',
    title: 'Digital & Social Media',
    shortDescription: 'Social listening, sentiment analysis, and digital UX analytics.',
    description: 'Tap into the digital pulse. We offer social listening, influencer impact analysis, and digital ad testing to understand online behavior and optimize user experience (UX) and web traffic.',
    iconName: 'Globe',
    features: [
      'Social listening and sentiment analysis',
      'Influencer impact analysis',
      'Digital ad testing and optimization',
      'Audience segmentation from online behavior',
      'Web traffic and UX analysis'
    ],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Strategic Consulting',
    shortDescription: 'Actionable roadmaps, workshops, and high-level research reporting.',
    description: 'We move beyond raw data to provide executive summary decks, full-length research reports, and strategic recommendations. We facilitate workshops to align stakeholders and build actionable roadmaps based on findings.',
    iconName: 'Target',
    features: [
      'Executive summary decks',
      'Full-length research reports',
      'Strategic recommendations',
      'Workshops to align stakeholders',
      'Actionable roadmaps'
    ],
    isFeatured: true
  },
  {
    id: '5',
    title: 'Continuous Tracking',
    shortDescription: 'Monitoring brand health, customer satisfaction, and market trends.',
    description: 'Keep a finger on the pulse of your market. Our tracking services monitor brand health, customer satisfaction (CSAT/NPS), campaign performance, and emerging market trends with real-time dashboards.',
    iconName: 'TrendingUp',
    features: [
      'Brand health tracking',
      'Customer satisfaction (CSAT/NPS)',
      'Campaign performance monitoring',
      'Market trend tracking dashboards'
    ],
    isFeatured: false
  },
  {
    id: '6',
    title: 'Market Intelligence',
    shortDescription: 'Competitor benchmarking, SWOT analysis, and trend forecasting.',
    description: 'Stay ahead of the competition. We provide competitor benchmarking, SWOT and Porter’s 5 Forces analysis, market entry strategies, and white space identification to find your next growth opportunity.',
    iconName: 'Zap',
    features: [
      'Competitor benchmarking',
      'SWOT and Porter’s 5 Forces analysis',
      'Market entry & expansion analysis',
      'White space opportunity mapping',
      'Trend forecasting'
    ],
    isFeatured: true
  },
  {
    id: '7',
    title: 'Geographic Studies',
    shortDescription: 'Regional market segmentation and cultural preference insights.',
    description: 'Navigate global markets with local precision. Our granular geographic studies analyze regional segmentation, urban/rural behaviors, and cultural preferences for successful global/local market adaptation.',
    iconName: 'Map',
    features: [
      'Regional market segmentation',
      'Urban vs rural behaviors insights',
      'Cultural/language preference studies',
      'Global/local market adaptation'
    ],
    isFeatured: false
  },
  {
    id: '8',
    title: 'Analytics & Data',
    shortDescription: 'Data visualization, predictive modeling, and CRM integration.',
    description: 'Unlock the power of your data. We specialize in data visualization, predictive analytics, customer segmentation models, and advanced statistical modeling including regression and cluster analysis.',
    iconName: 'Database',
    features: [
      'Data visualization & dashboards',
      'Predictive analytics',
      'Customer segmentation models',
      'CRM & sales data integration',
      'Advanced statistical modeling'
    ],
    isFeatured: true
  }
];

async function updateServices() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);

    // clear existing services
    await db.collection('services').deleteMany({});
    console.log('Cleared existing services.');

    // insert new services
    const result = await db.collection('services').insertMany(NEW_SERVICES);
    console.log(`Inserted ${result.insertedCount} new services based on Quantifie.co.uk.`);

  } catch (err) {
    console.error('Error updating services:', err);
  } finally {
    await client.close();
  }
}

updateServices();
