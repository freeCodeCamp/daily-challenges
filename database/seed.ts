import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import assert from 'node:assert';
import { baseChallenge } from './challenges/challenge';

const seed = async () => {
  const daysToAdd = 100;
  // -1 means it seeds a challenge for tomorrow (UTC) and then moves backwards daysToAdd days
  const startingDate = -1;

  assert.ok(process.env.MONGO_URI);

  const client = new MongoClient(process.env.MONGO_URI);
  // todo: use challengeId as mongo ID?
  try {
    await client.connect();
    const db = client.db('curriculum');
    const collection = db.collection('dailyChallenges');
    await collection.drop();

    const challenges = [];

    const today = new Date();

    for (let i = startingDate; i < daysToAdd; i++) {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));

      challenges.push({
        ...baseChallenge,
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
