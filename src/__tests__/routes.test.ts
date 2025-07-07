import request from 'supertest';

import app from '../app';
import { dailyCodingChallenges } from '../db';

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

    it('should return 404 for a valid but nonexistent date', async () => {
      mockDailyCodingChallenges.findOne.mockResolvedValue(null);

      const response = await request(app).get(
        '/api/daily-challenge/date/1-1-1111'
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual(`Challenge not found for "1-1-1111"`);
    });
  });
});
