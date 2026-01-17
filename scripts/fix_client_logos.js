const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'genesoft_db';

async function fixClientLogos() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);

    // Use the existing header logo as a placeholder for client logos
    const validLogo = '/uploads/logos/header-logo-1768443799732-GENESOFT INFOTECH FINAL ctc.png';
    console.log(`Updating all clients to use logo: ${validLogo}`);

    const result = await db.collection('clients').updateMany(
      {},
      { $set: { logo: validLogo, logoUrl: validLogo } }
    );

    console.log(`Updated ${result.modifiedCount} client records.`);

  } catch (err) {
    console.error('Error fixing client logos:', err);
  } finally {
    await client.close();
  }
}

fixClientLogos();
