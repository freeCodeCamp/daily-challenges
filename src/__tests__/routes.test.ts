import request from 'supertest';

import app from '../app';

describe('routes', () => {
  afterEach(() => {
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
      const response = await request(app).get(
        '/api/daily-challenge/date/1-1-1111'
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toEqual(`Challenge not found for "1-1-1111"`);
    });
  });
});
