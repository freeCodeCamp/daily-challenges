To Run:
- Copy `sample.env` to `.env` - if seeding the development database, set `ALLOW_SEED` to `true`
- Install dependencies with `pnpm i`
- Make sure mongo is running, and seed the database with `pnum run seed`. It will seed the placeholder challenge for the numbers of days according to the variables in the seed script
- Run the server with `pnpm run develop`
- Get challenge info at `localhost:3000/api/daily-challenge/date/:date` - e.g. `http://localhost:3000/api/daily-challenge/date/3-20-2025` <- note the date format: `M-D-YYYY`
