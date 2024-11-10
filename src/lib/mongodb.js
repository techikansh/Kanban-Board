import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db('kanban-board'); // Your database name
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
} 