To Run:
- Copy `sample.env` to `.env`
- Install dependencies with `pnpm i`
- Make sure mongo is running, and seed the database with `pnpm run seed`. It will seed the placeholder challenge for today, tomorrow, and the five previous days in US Central time. Change the number in `database/seed.js` to seed more days.
- Run the server with `pnpm run develop`
- Get challenge info at `localhost:3000/api/daily-challenge/date/:date` - e.g. `http://localhost:3000/api/daily-challenge/date/3-20-2025` <- note the date format: `M-D-YYYY`
