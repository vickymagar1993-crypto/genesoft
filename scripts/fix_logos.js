const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'genesoft_db';

async function fixDatabase() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    constdb = client.db(DB_NAME);

    // 1. Fix Settings (Header/Footer Logos)
    const settingsCol = constdb.collection('settings');
    
    // Use the latest files found in public/uploads/logos
    const headerLogo = '/uploads/logos/header-logo-1768443799732-GENESOFT INFOTECH FINAL ctc.png';
    const footerLogo = '/uploads/logos/footer-logo-1768443799735-GENESOFT INFOTECH FINAL white color.png';

    const updateResult = await settingsCol.updateOne(
      { type: 'general' },
      { 
        $set: { 
          headerLogo: headerLogo, 
          // Set both fields to be safe as per our component logic
          headerLogoUrl: headerLogo,
          footerLogo: footerLogo,
          footerLogoUrl: footerLogo, 
          updatedAt: new Date().toISOString() 
        } 
      },
      { upsert: true }
    );
    console.log('Settings updated:', updateResult.modifiedCount || updateResult.upsertedCount ? 'Success' : 'No change needed');

    // 2. Verify Clients
    const clientsCol = constdb.collection('clients');
    const clientCount = await clientsCol.countDocuments();
    console.log(`Found ${clientCount} clients in database.`);
    
    // If no clients, we should probably insert some, but the user asked "can we not seed".
    // I will explicitly NOT seed clients here to respect the user's intent of "direct access", 
    // implying they want to control the data. 
    // However, if the count is 0, the section will definitely be empty.
    // I'll just log it.

  } catch (err) {
    console.error('Error fixing database:', err);
  } finally {
    await client.close();
  }
}

fixDatabase();
