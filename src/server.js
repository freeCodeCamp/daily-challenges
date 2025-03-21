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

// Fetch daily challenge by date
app.get('/api/daily-challenge/date/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const challenge = await dailyChallenges.findOne({ date });
    const todayUsCentral = formatDateUsCentral(new Date());

    // do not send challenge back if it's in the future (relative to today US Central)
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

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});
