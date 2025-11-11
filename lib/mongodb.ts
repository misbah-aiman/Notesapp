import { MongoClient, MongoClientOptions } from 'mongodb';

// ✅ BETTER ERROR MESSAGE
if (!process.env.MONGODB_URI) {
  throw new Error(`
    ❌ MONGODB_URI is missing!
    Please add it to Vercel Environment Variables:
    1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
    2. Add: MONGODB_URI = your-mongodb-atlas-connection-string
  `);
}

// ✅ VALIDATE CONNECTION STRING FORMAT
if (!process.env.MONGODB_URI.includes('mongodb+srv://')) {
  throw new Error(`
    ❌ Invalid MONGODB_URI format!
    Your URI: ${process.env.MONGODB_URI}
    It should start with: mongodb+srv://
    Get the correct string from MongoDB Atlas → Connect → Connect your application
  `);
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;