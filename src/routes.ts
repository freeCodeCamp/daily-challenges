import { Router } from 'express';
import { parse, isValid } from 'date-fns';

import { dailyCodingChallenges } from './db';
import { getNowUsCentral, getUtcMidnight } from './utils/helpers';
import { handleError, HttpError } from './utils/errors';

const router = Router();

// challenge by date
router.get('/api/daily-challenge/date/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const parsedDate = parse(date, 'M-d-yyyy', new Date());

    if (!isValid(parsedDate)) {
      throw new HttpError(400, `Invalid date: "${date}". Please use "M-D-YYYY"`);
    }

    // Convert parsed date to UTC at midnight for database lookup
    const challengeDate = getUtcMidnight(parsedDate);

    const challenge = await dailyCodingChallenges.findOne({ date: challengeDate });

    // do not send challenge back if it's for a future date (relative to today US Central)
    if (challenge && challenge.date <= getNowUsCentral()) {
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
    const challenges = await dailyCodingChallenges.find({ date: { $lte: getNowUsCentral() } }, { projection: { challengeId: 1, date: 1, _id: 0 } }).toArray();

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

// return { date } of the newest challenge so we can check how many challenges are available
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
