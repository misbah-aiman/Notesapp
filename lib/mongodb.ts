import { MongoClient, MongoClientOptions } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// ✅ PRODUCTION-OPTIMIZED OPTIONS
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  retryWrites: true,
  retryReads: true,
};

// Global variables for connection caching
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Development: use global variable
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production: don't use global variable (Vercel serverless)
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;