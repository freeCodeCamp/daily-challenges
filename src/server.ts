import express from 'express';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import routes from './routes.js';
import assert from 'node:assert';

const app = express();
const portNum = process.env.PORT || 3000;

assert.ok(process.env.MONGO_URI)

const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectDB();

const db = client.db('curriculum');
export const dailyChallenges = db.collection('dailyChallenges');

app.use(express.json());
app.use(routes);

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});
