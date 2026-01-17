const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'genesoft_db';

async function checkContent() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);

    const servicesCount = await db.collection('services').countDocuments();
    const clientsCount = await db.collection('clients').countDocuments();

    console.log(`Services count: ${servicesCount}`);
    console.log(`Clients count: ${clientsCount}`);

    if (servicesCount === 0) {
      console.log('WARNING: No services found in database.');
    } else {
        const services = await db.collection('services').find({}).limit(1).toArray();
        console.log('Sample service:', JSON.stringify(services[0], null, 2));
    }

    if (clientsCount === 0) {
      console.log('WARNING: No clients found in database.');
    } else {
         const clients = await db.collection('clients').find({}).limit(1).toArray();
         console.log('Sample client:', JSON.stringify(clients[0], null, 2));
    }

  } catch (err) {
    console.error('Error checking content:', err);
  } finally {
    await client.close();
  }
}

checkContent();
