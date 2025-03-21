import { readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { formatDateUsCentral } from '../src/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });
const { MONGO_URI } = process.env;

const seed = async () => {
  const daysToAdd = 7;

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db('curriculum');
    const collection = db.collection('dailyChallenges');
    await collection.drop();

    const baseData = JSON.parse(readFileSync(join(__dirname, 'challenges', 'challenge.json'), 'utf-8'));
    const challenges = [];

    // -1 means it will seed one day into the future
    for (let i = -1; i < daysToAdd; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      challenges.push({
        ...baseData,
        date: formatDateUsCentral(date),
      });
    }

    // Insert data into MongoDB
    const result = await collection.insertMany(challenges);
    console.log(`Inserted ${result.insertedCount} challenges`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
};

seed();
