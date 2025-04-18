import { Router } from 'express';
import { dailyChallenges } from './server.js';
import { getTodayUsCentral } from './helpers.js';

const router = Router();

// challenge by date
router.get('/api/daily-challenge/date/:date', async (req, res) => {
  const { date } = req.params;

  if (!/^\d{1,2}-\d{1,2}-\d{4}$/.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format. Please use M-D-YYYY or MM-DD-YYYY',
    });
  }

  const [month, day, year] = date.split('-').map(Number);

  const challengeDate = new Date(Date.UTC(year, month - 1, day));

  if (challengeDate.getUTCFullYear() !== year || challengeDate.getUTCMonth() !== month - 1 || challengeDate.getUTCDate() !== day) {
    return res.status(400).json({ error: 'Invalid calendar date' });
  }

  try {
    const challenge = await dailyChallenges.findOne({ date: challengeDate });

    const todayUsCentral = getTodayUsCentral();

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

// challengeId and date of all challenges <= today US Central
router.get('/api/daily-challenge/all', async (req, res) => {
  try {
    const todayUsCentral = getTodayUsCentral();
    const challenges = await dailyChallenges.find({ date: { $lte: todayUsCentral } }, { projection: { challengeId: 1, date: 1, _id: 0 } }).toArray();

    if (challenges.length > 0) {
      res.status(200).json(challenges);
    } else {
      res.status(404).json({ error: 'Challenges not found' });
    }
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
