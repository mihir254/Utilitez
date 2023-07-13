import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

if (!process.env.MONGODB_URI || !uri) {
  throw new Error('Add Mongo URI to .env.local');
}

let client: MongoClient | null = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient> | null = null;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
