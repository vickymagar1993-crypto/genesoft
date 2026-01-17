const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'genesoft_db';

// Combined services from both Quantifie.co.uk AND Genesoft Infotech
const ENHANCED_SERVICES = [
  // Core Research Services (from Quantifie)
  {
    id: '1',
    title: 'Market Research & Intelligence',
    shortDescription: 'Comprehensive B2B market research combining qualitative and quantitative methodologies.',
    description: 'Gain actionable insights through in-depth interviews with decision-makers, focus groups, surveys, and competitive intelligence. We deliver market sizing, segmentation, growth forecasts, customer journey maps, and pricing optimization strategies using AI-powered analysis tools.',
    iconName: 'BarChart3',
    features: [
      'In-Depth Interviews (IDIs)',
      'Focus Groups & Surveys',
      'Competitive Benchmarking',
      'Market Sizing & Forecasting',
      'Customer Journey Mapping',
      'AI-Powered Insights'
    ],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Data Analytics & Business Intelligence',
    shortDescription: 'Transform enterprise data into competitive advantage with AI-powered analytics.',
    description: 'Unlock the power of your data with predictive models, real-time dashboards, and advanced statistical modeling. We integrate CRM, ERP, and HRM data to provide unified operational views and self-service analytics.',
    iconName: 'Database',
    features: [
      'Data visualization & dashboards',
      'Predictive analytics',
      'Customer segmentation models',
      'CRM & sales data integration',
      'Advanced statistical modeling',
      'Real-time KPI monitoring'
    ],
    isFeatured: true
  },
  
  // B2B Growth Services (from Genesoft)
  {
    id: '3',
    title: 'BANT Qualification Campaigns',
    shortDescription: 'Generate high-quality MQLs vetted against Budget, Authority, Need, and Timeline.',
    description: 'Our systematic BANT qualification ensures you connect only with prospects who have allocated budget, possess decision-making authority, demonstrate genuine business need, and operate within an appropriate buying timeline.',
    iconName: 'Shield',
    features: [
      'Budget Qualification',
      'Authority Verification',
      'Need Assessment',
      'Timeline Mapping',
      'Lead Scoring System',
      'CRM Enrichment',
      'Multi-Channel Campaigns',
      'Sales-Ready Leads'
    ],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Lead Generation & Growth',
    shortDescription: 'Accelerate your B2B sales pipeline with targeted lead generation strategies.',
    description: 'Our comprehensive approach combines targeted outreach, sophisticated email marketing, lead scoring using BANT criteria, account-based marketing (ABM), and inbound strategies including content creation and SEO.',
    iconName: 'Target',
    features: [
      'Targeted B2B Outreach',
      'Email Marketing Campaigns',
      'Lead Scoring & Qualification',
      'Account-Based Marketing (ABM)',
      'Marketing Automation',
      'Content Marketing & SEO',
      'Pipeline Development',
      'Conversion Optimization'
    ],
    isFeatured: true
  },
  {
    id: '5',
    title: 'Appointment Generation',
    shortDescription: 'Secure qualified meetings with key decision-makers through strategic SDR outreach.',
    description: 'Our experienced SDR team conducts multi-touch campaigns via phone, email, and LinkedIn, qualifying prospects against your criteria before booking meetings. Complete calendar coordination and pre-meeting briefs included.',
    iconName: 'CheckCircle2',
    features: [
      'Decision-Maker Outreach',
      'Multi-Touch Campaigns',
      'Prospect Qualification',
      'Calendar Management',
      'Meeting Confirmation',
      'Pre-Meeting Research',
      'CRM Integration',
      'Performance Analytics'
    ],
    isFeatured: true
  },
  
  // Digital & Strategic Services
  {
    id: '6',
    title: 'Digital & Social Media Research',
    shortDescription: 'Social listening, sentiment analysis, and digital UX analytics.',
    description: 'Transform social conversations into actionable intelligence. We monitor brand mentions, competitor activities, and industry trends across all major platforms with advanced sentiment analysis and influencer identification.',
    iconName: 'Globe',
    features: [
      'Social listening and sentiment analysis',
      'Influencer impact analysis',
      'Digital ad testing and optimization',
      'Audience segmentation from online behavior',
      'Web traffic and UX analysis',
      'Competitor tracking'
    ],
    isFeatured: true
  },
  {
    id: '7',
    title: 'Strategic Consulting',
    shortDescription: 'Actionable roadmaps, workshops, and high-level research reporting.',
    description: 'We move beyond raw data to provide executive summary decks, full-length research reports, and strategic recommendations. We facilitate workshops to align stakeholders and build actionable roadmaps based on findings.',
    iconName: 'Sparkles',
    features: [
      'Executive summary decks',
      'Full-length research reports',
      'Strategic recommendations',
      'Workshops to align stakeholders',
      'Actionable roadmaps',
      'Digital transformation consulting'
    ],
    isFeatured: false
  },
  {
    id: '8',
    title: 'Brand Perception & Tracking',
    shortDescription: 'Monitor and enhance how your brand is perceived in the market.',
    description: 'Real-time social listening, sentiment analysis, and brand health monitoring. Track key metrics including awareness, recall, preference, and loyalty across demographics with comprehensive reputation management.',
    iconName: 'Award',
    features: [
      'Real-Time Social Listening',
      'Sentiment Analysis',
      'Brand Health Metrics',
      'Reputation Monitoring',
      'Competitor Benchmarking',
      'Crisis Management Insights',
      'Market Positioning Analysis'
    ],
    isFeatured: false
  },
  {
    id: '9',
    title: 'Market Intelligence',
    shortDescription: 'Competitor benchmarking, SWOT analysis, and trend forecasting.',
    description: 'Stay ahead of the competition with comprehensive competitor analysis, SWOT and Porter\'s 5 Forces frameworks, market entry strategies, and white space identification to find your next growth opportunity.',
    iconName: 'Zap',
    features: [
      'Competitor benchmarking',
      'SWOT and Porter\'s 5 Forces analysis',
      'Market entry & expansion analysis',
      'White space opportunity mapping',
      'Trend forecasting',
      'TAM/SAM/SOM Analysis'
    ],
    isFeatured: false
  },
  {
    id: '10',
    title: 'Continuous Tracking & Monitoring',
    shortDescription: 'Real-time monitoring of brand health, customer satisfaction, and market trends.',
    description: 'Keep a finger on the pulse of your market with continuous brand health tracking, customer satisfaction (CSAT/NPS) monitoring, campaign performance analysis, and emerging market trends via real-time dashboards.',
    iconName: 'TrendingUp',
    features: [
      'Brand health tracking',
      'Customer satisfaction (CSAT/NPS)',
      'Campaign performance monitoring',
      'Market trend tracking dashboards',
      'Automated alerts',
      'Performance forecasting'
    ],
    isFeatured: false
  }
];

async function updateServicesEnhanced() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);

    // clear existing services
    await db.collection('services').deleteMany({});
    console.log('Cleared existing services.');

    // insert enhanced services
    const result = await db.collection('services').insertMany(ENHANCED_SERVICES);
    console.log(`Inserted ${result.insertedCount} enhanced services (Quantifie + Genesoft combined).`);

  } catch (err) {
    console.error('Error updating services:', err);
  } finally {
    await client.close();
  }
}

updateServicesEnhanced();
