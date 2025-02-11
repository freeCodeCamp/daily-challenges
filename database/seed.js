import { readFileSync } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const { MONGO_URI } = process.env;

function formatDateUsCentral(dateObj) {
  return dateObj
    .toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, '-');
}

const seed = async () => {
  const daysToAdd = 7;

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db('curriculum');
    const collection = db.collection('dailyChallenges');

    await collection.drop();

    // Read the JSON file
    const baseData = JSON.parse(readFileSync(path.join(__dirname, 'challenges', 'challenge.json'), 'utf-8'));

    // Insert the object multiple times with different dates
    const duplicatedData = [];
    for (let i = 0; i < daysToAdd; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      duplicatedData.push({
        ...baseData,
        date: formatDateUsCentral(date),
      });
    }

    // Insert data into MongoDB
    const result = await collection.insertMany(duplicatedData);
    console.log(`Inserted ${result.insertedCount} challenges`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
};

seed();
