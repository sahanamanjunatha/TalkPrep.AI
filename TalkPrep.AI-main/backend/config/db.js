const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedDB } = require('../utils/seeder');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-mock-interview';
    let isInMemory = false;

    // Use in-memory MongoDB if running in development and URI points to localhost
    const isLocalhost = dbUri.includes('localhost') || dbUri.includes('127.0.0.1') || dbUri.includes('::1');
    if (process.env.NODE_ENV !== 'production' && isLocalhost) {
      console.log('Starting in-memory MongoDB server (mongodb-memory-server)...');
      mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
      isInMemory = true;
      console.log(`In-memory MongoDB started at: ${dbUri}`);
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // If using in-memory DB, automatically seed it since it starts empty
    if (isInMemory) {
      console.log('Seeding in-memory database with default data...');
      await seedDB(false); // Do not exit process after seeding
      console.log('In-memory database seeding complete.');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
