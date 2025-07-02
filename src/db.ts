import { MongoClient } from 'mongodb';
import assert from 'node:assert';
import 'dotenv/config';

assert.ok(process.env.MONGO_URI, 'MONGO_URI is required');

const client = new MongoClient(process.env.MONGO_URI, {
  maxPoolSize: 10,           // 10 concurrent connections should handle hundreds of req/sec
  minPoolSize: 2,            // Keep 2 connections warm
  maxIdleTimeMS: 30000,      // Close idle after 30s

  // Timeouts - prevent hanging requests
  serverSelectionTimeoutMS: 5000,   // 5s to find server
  socketTimeoutMS: 30000,           // 30s per operation
  connectTimeoutMS: 10000,          // 10s to connect

  // Retry logic
  retryWrites: true,
  retryReads: true
});

const db = client.db('freecodecamp'); 

export const dailyCodingChallenges = db.collection('DailyCodingChallenges');
export { client };
