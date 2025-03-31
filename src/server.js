import express from 'express';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { formatDateUsCentral } from './helpers.js';

const app = express();
const portNum = process.env.PORT || 3000;

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
const dailyChallenges = db.collection('dailyChallenges');

// challenge by date
app.get('/api/daily-challenge/date/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const challenge = await dailyChallenges.findOne({ date });
    const todayUsCentral = formatDateUsCentral(new Date());

    // do not send challenge back if it's for a future date (relative to today US Central)
    if (challenge && challenge.date <= todayUsCentral) {
      res.status(200).json(challenge);
    } else {
      res.status(404).json({ error: 'Challenge not found for this date' });
    }
  } catch (err) {
    console.error('Error fetching challenge:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// challengeId and date of all challenges <= today
app.get('/api/daily-challenge/all', async (req, res) => {
  try {
    const todayUsCentral = formatDateUsCentral(new Date());
    const challenges = await dailyChallenges.find(
      {},
      { projection: { challengeId: 1, date: 1, _id: 0 } }
    ).toArray();

    if (challenges) {
      // only send challenges <= today
      const availableChallenges = challenges.filter((c) => c.date <= todayUsCentral);

      res.status(200).json(availableChallenges);
    } else {
      res.status(404).json({ error: 'Challenges not found' });
    }
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});
