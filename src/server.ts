import { client } from './db';
import app from './app';
import debug from 'debug';

const log = debug('app:server');

const portNum = process.env.PORT || 3000;

(async function() {
  try {
    log('Connecting to database...');
    await client.connect();
    log('Connected to MongoDB');
    log('Starting server...');
    app.listen(portNum, () => {
      log(`Server listening on port ${portNum}`);
    });
  } catch (err) {
    log('MongoDB connection error:', err);
  }
}
)();
