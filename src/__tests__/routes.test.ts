import request from 'supertest';
import { addDays } from 'date-fns';

import app from '../app';
import { dailyCodingChallenges, client } from '../db';
import { getNowUsCentral, getUtcMidnight } from '../utils/helpers';

jest.mock('../db', () => ({
  dailyCodingChallenges: {
    findOne: jest.fn(),
    find: jest.fn(() => ({
      toArray: jest.fn()
    }))
  },
  client: {
    db: jest.fn(() => ({
      admin: jest.fn(() => ({
        ping: jest.fn()
      }))
    }))
  }
}));

const mockDailyCodingChallenges = dailyCodingChallenges as jest.Mocked<
  typeof dailyCodingChallenges
>;
const mockClient = client as jest.Mocked<typeof client>;

function isoToSimpleDate(isoDate: string): string {
  const date = isoDate.split('T')[0] as string;
  const [year, month, day] = date.split('-') as [string, string, string];
  return `${parseInt(month)}-${parseInt(day)}-${year}`;
}

const todayUsCentral = getNowUsCentral();
const todayUtcMidnight = getUtcMidnight(todayUsCentral);
const todayDateParam = isoToSimpleDate(todayUtcMidnight.toISOString());

const yesterdayUsCentral = addDays(todayUsCentral, -1);
const yesterdayUtcMidnight = getUtcMidnight(yesterdayUsCentral);

const tomorrowUsCentral = addDays(todayUsCentral, 1);
const tomorrowUtcMidnight = getUtcMidnight(tomorrowUsCentral);
const tomorrowDateParam = isoToSimpleDate(tomorrowUtcMidnight.toISOString());

const yesterdaysChallenge = {
  _id: 'yesterdays-id',
  challengeNumber: 1,
  date: yesterdayUtcMidnight,
  title: "Yesterday's Title"
};

const todaysChallenge = {
  _id: 'todays-id',
  challengeNumber: 2,
  date: todayUtcMidnight,
  title: "Today's Title"
};

const tomorrowsChallenge = {
  _id: 'tomorrows-id',
  challengeNumber: 3,
  date: tomorrowUtcMidnight,
  title: "Tomorrow's Title"
};

const mockChallenges = [
  yesterdaysChallenge,
  todaysChallenge,
  tomorrowsChallenge
];

describe('routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/daily-challenge/date/:date', () => {
    it('should return 400 for an invalid date format', async () => {
      const response = await request(app).get(
        '/api/daily-challenge/date/invalid-format'
      );
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual(
        'Invalid date format: "invalid-format". Please use "M-D-YYYY"'
      );
    });

    it('should return 400 for an invalid calendar date', async () => {
      const response = await request(app).get(
        '/api/daily-challenge/date/99-99-9999'
      );
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual(
        'Invalid date format: "99-99-9999". Please use "M-D-YYYY"'
      );
    });

    it('should return 404 for a date without a challenge', async () => {
      mockDailyCodingChallenges.findOne.mockResolvedValue(null);

      const response = await request(app).get(
        '/api/daily-challenge/date/1-1-1111'
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual(`Challenge not found for "1-1-1111"`);
    });

    it("should return 404 for tomorrow's date", async () => {
      mockDailyCodingChallenges.findOne.mockResolvedValue(tomorrowsChallenge);

      const response = await request(app).get(
        `/api/daily-challenge/date/${tomorrowDateParam}`
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual(
        `Challenge not found for "${tomorrowDateParam}"`
      );
    });

    it("should return a challenge for today's date", async () => {
      mockDailyCodingChallenges.findOne.mockResolvedValue(todaysChallenge);

      const response = await request(app).get(
        `/api/daily-challenge/date/${todayDateParam}`
      );

      expect(response.status).toBe(200);

      const expectedResponse = {
        ...todaysChallenge,
        date: todaysChallenge.date.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('GET /api/daily-challenge/all', () => {
    it('should return all challenges <= today US Central', async () => {
      const pastChallenges = mockChallenges.slice(0, 2);

      const mockFind = {
        toArray: jest.fn().mockResolvedValue(pastChallenges)
      };
      mockDailyCodingChallenges.find.mockReturnValue(mockFind as any);

      const expectedResponse = pastChallenges.map(challenge => ({
        ...challenge,
        date: challenge.date.toISOString()
      }));

      const response = await request(app).get('/api/daily-challenge/all');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('GET /api/daily-challenge/newest', () => {
    it('should return the newest challenge', async () => {
      mockDailyCodingChallenges.findOne.mockResolvedValue(tomorrowsChallenge);

      const expectedResponse = {
        ...tomorrowsChallenge,
        date: tomorrowsChallenge.date.toISOString()
      };

      const response = await request(app).get('/api/daily-challenge/newest');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });
  });

  describe('GET /status/health', () => {
    it('should return healthy status when database is connected', async () => {
      const mockPing = jest.fn().mockResolvedValue({});
      mockClient.db.mockReturnValue({
        admin: () => ({ ping: mockPing })
      } as any);

      const response = await request(app).get('/status/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.database).toBe('connected');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return unhealthy status when database ping fails', async () => {
      const mockPing = jest
        .fn()
        .mockRejectedValue(new Error('Connection failed'));
      mockClient.db.mockReturnValue({
        admin: () => ({ ping: mockPing })
      } as any);

      const response = await request(app).get('/status/health');
      expect(response.status).toBe(503);
      expect(response.body.status).toBe('unhealthy');
      expect(response.body.database).toBe('disconnected');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Route not found');
    });
  });
});
