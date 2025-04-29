import { MongoClient } from 'mongodb';
import express from 'express';
import assert from 'node:assert';
import 'dotenv/config';

import routes from './routes.js';

assert.ok(process.env.MONGO_URI);
const client = new MongoClient(process.env.MONGO_URI);
const portNum = process.env.PORT || 3000;

const app = express();

const db = client.db('curriculum');
export const dailyChallenges = db.collection('dailyChallenges');

app.use(express.json());
app.use(routes);

async function startServer() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to MongoDB');
    console.log('Starting server...');
    app.listen(portNum, () => {
      console.log(`Listening on port ${portNum}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();
