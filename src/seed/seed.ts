/*
 * Script to seed the Daily Coding Challenges
 * Not for production use, only for development purposes.
 * To seed actual challenges, use the script in the main freeCodeCamp repo
 * This script should seed the challenges in the same format as that though
 */

import 'dotenv/config';
import { ObjectId } from 'mongodb';
import { addDays } from 'date-fns';

import { challenge } from './challenge';
import { client, dailyCodingChallenges } from '../db';
import { getUtcMidnight } from '../utils/helpers';

const seed = async () => {
  const daysToAdd = 100;
  // 2 means it seeds a challenge for the day after tomorrow (UTC) and then move backwards daysToAdd days
  const futureDaysToAdd = 2;

  try {
    await client.connect();

    const collections = await client
      .db()
      .listCollections({ name: dailyCodingChallenges.collectionName })
      .toArray();

    if (collections.length > 0) {
      await dailyCodingChallenges.drop();
    }

    const challenges = [];
    const todayUtcMidnight = getUtcMidnight(new Date());

    for (let i = -futureDaysToAdd; i < daysToAdd - futureDaysToAdd; i++) {
      const date = addDays(todayUtcMidnight, -i);

      challenges.push({
        _id: new ObjectId(),
        challengeNumber: daysToAdd - i - futureDaysToAdd,
        date,
        ...challenge
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

if (process.env.NODE_ENV === 'development') {
  seed();
} else {
  console.error('Seeding is not allowed in this environment.');
  process.exit(1);
}
