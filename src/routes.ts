import { Router } from 'express';

import { dailyCodingChallenges } from './db';
import { getTodayUsCentral } from './utils/helpers';
import { handleError, HttpError } from './utils/errors';

const router = Router();

// challenge by date
router.get('/api/daily-challenge/date/:date', async (req, res) => {
  const { date } = req.params;

  try {
    if (!/^\d{1,2}-\d{1,2}-\d{4}$/.test(date)) {
      throw new HttpError(400, `Invalid date format: "${date}". Please use "M-D-YYYY"`);
    }

    const [month, day, year] = date.split('-').map(Number) as [number, number, number];
    const challengeDate = new Date(Date.UTC(year, month - 1, day));

    if (challengeDate.getUTCFullYear() !== year || challengeDate.getUTCMonth() !== month - 1 || challengeDate.getUTCDate() !== day) {
      throw new HttpError(400, `Invalid calendar date: "${date}"`);
    }

    const challenge = await dailyCodingChallenges.findOne({ date: challengeDate });
    const todayUsCentral = getTodayUsCentral();

    // do not send challenge back if it's for a future date (relative to today US Central)
    if (challenge && challenge.date <= todayUsCentral) {
      res.status(200).json(challenge);
      return;
    } else {
      throw new HttpError(404, `Challenge not found for "${date}"`);
    }
  } catch (err) {
    handleError(err, res);
  }
});

// challengeId and date of all challenges <= today US Central
router.get('/api/daily-challenge/all', async (req, res) => {
  try {
    const todayUsCentral = getTodayUsCentral();
    const challenges = await dailyCodingChallenges.find({ date: { $lte: todayUsCentral } }, { projection: { challengeId: 1, date: 1, _id: 0 } }).toArray();

    if (challenges.length > 0) {
      res.status(200).json(challenges);
      return;
    } else {
      throw new HttpError(404, 'No Challenges found');
    }
  } catch (err) {
    handleError(err, res);
  }
});

// return the { date } of the newest challenge so we can check how many challenges are available
router.get('/api/daily-challenge/newest', async (req, res) => {
  try {
    const newestChallenge = await dailyCodingChallenges.findOne(
      {},
      {
        sort: { date: -1 },
        projection: { date: 1, _id: 0 },
      }
    );

    if (!newestChallenge) {
      throw new HttpError(204, 'No Challenge found');
    }

    res.status(200).json(newestChallenge);
    return;
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
