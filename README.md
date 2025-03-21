To Run:
- Copy `sample.env` to `.env`
- Install dependencies with `npm i`
- Make sure mongo is running, and seed the database with `num run seed`. It will seed the placeholder challenge for today, tomorrow, and the five previous days in US Central time. Change the number in `database/seed.js` to seed more days.
- Run the server with `npm run develop`
- Get challenge info at `localhost:3000/api/daily-challenge/date/:date` - e.g. `http://localhost:3000/api/daily-challenge/date/03-20-2025` <- note the date format: `MM-DD-YYYY`
