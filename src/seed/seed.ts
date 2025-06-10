/*
 * Script to seed the Daily Coding Challenges
 * Not for production use, only for development purposes.
 * To seed actualy challenges, use the script in the main freeCodeCamp repo
*/

import 'dotenv/config';
import { ObjectId } from 'mongodb';
import assert from 'node:assert';
import { challenge } from './challenge';
import { client, dailyCodingChallenges } from '../db';

const seed = async () => {
  if (process.env.ALLOW_SEED !== 'true') {
    console.error('Seeding is not allowed in this environment.');
    process.exit(1);
  }

  const daysToAdd = 10;
  // 2 means it seeds a challenge for the day after tomorrow (UTC) and then move backwards daysToAdd days
  const futureDaysToAdd = 2;
  

  try {
    await client.connect();
    await dailyCodingChallenges.drop();

    const challenges = [];

    const today = new Date();

    for (let i = -futureDaysToAdd; i < daysToAdd - futureDaysToAdd; i++) {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));

      challenges.push({
        _id: new ObjectId(),
        challengeNumber: daysToAdd - i - futureDaysToAdd,
        date,
        ...challenge,
      });
    }

    const result = await dailyCodingChallenges.insertMany(challenges);
    console.log(`Inserted ${result.insertedCount} challenges`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
};

seed();
