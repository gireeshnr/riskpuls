import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

/**
 * Returns a cached MongoClient promise. In development mode we reuse the
 * connection across hot reloads to avoid creating too many connections.
 * In production a new client is created on each cold start. The connection
 * options are deliberately kept empty to avoid passing deprecated flags
 * (`useNewUrlParser`, `useUnifiedTopology`) which are no longer required
 * with MongoDB driver v5 and above.
 */
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to your environment variables');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode use a global variable so that the client is reused
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production always create a new client and connect
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
