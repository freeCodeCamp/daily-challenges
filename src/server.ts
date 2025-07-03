import { client } from './db';
import app from './app';

import { serverLog, serverErrorLog } from './utils/logger';

const portNum = process.env.PORT || 3000;

(async function () {
  try {
    serverLog('Connecting to database...');

    await client.connect();
    await client.db().admin().ping();

    serverLog('Connected to MongoDB');
    serverLog('Starting server...');

    const server = app.listen(portNum, () => {
      serverLog(`Server listening on port ${portNum}`);
    });

    const shutdown = async (signal: string) => {
      serverLog(`${signal} received, shutting down gracefully`);

      try {
        server.close(() => {
          serverLog('HTTP server closed');
        });

        await client.close();
        serverLog('Database connection closed');

        process.exit(0);
      } catch (err) {
        serverErrorLog('Error during shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    serverErrorLog('Failed to start server:', err);
    process.exit(1);
  }
})();
