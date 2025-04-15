import { readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });
const { MONGO_URI } = process.env;

const seed = async () => {
  const daysToAdd = 10;
  // -1 means it seeds a challenge for tomorrow (UTC) and then moves backwards daysToAdd days
  const startingDate = -1;

  const client = new MongoClient(MONGO_URI);
  // todo: use challengeId as mongo ID?
  try {
    await client.connect();
    const db = client.db('curriculum');
    const collection = db.collection('dailyChallenges');
    await collection.drop();

    const baseData = JSON.parse(readFileSync(join(__dirname, 'challenges', 'challenge.json'), 'utf-8'));
    const challenges = [];

    const today = new Date();

    for (let i = startingDate; i < daysToAdd; i++) {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));

      challenges.push({
        ...baseData,
        challengeId: new ObjectId().toHexString(),
        date,
      });
    }

    const result = await collection.insertMany(challenges);
    console.log(`Inserted ${result.insertedCount} challenges`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
};

seed();
