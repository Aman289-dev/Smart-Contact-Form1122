import mongoose from 'mongoose';

export type DatabaseState = 'up' | 'down';

export function databaseState(): DatabaseState {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected ? 'up' : 'down';
}

const RETRY_MS = 5000;

// Connects from DATABASE_URL, which the platform passes at start, and keeps
// retrying while the database is unreachable instead of crashing the server.
// Never log the URL itself: it holds the database password.
export async function connectDatabase(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set: the platform passes it when it starts the app');
    return;
  }
  for (;;) {
    try {
      await mongoose.connect(url, { serverSelectionTimeoutMS: RETRY_MS });
      console.log('Database connected');
      return;
    } catch (err) {
      console.error(`Database unreachable, retrying in ${RETRY_MS / 1000}s: ${(err as Error).name}`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
    }
  }
}
