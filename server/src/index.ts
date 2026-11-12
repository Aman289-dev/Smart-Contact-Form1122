import express from 'express';
import type { Request, Response } from 'express';
import { connectDatabase, databaseState } from './db';
import { errorHandler } from './middleware/errorMiddleware';
import { UPLOADS_DIR } from './paths';
import contactRouter from './routes/contact';

// The platform passes PORT (and DATABASE_URL) when it starts the app; nothing
// is read from a file. Keep this as it is.
const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error('PORT is not set: the platform passes it when it starts the app');
}

const app = express();
app.use(express.json());

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/api/uploads', express.static(UPLOADS_DIR));

// ─── Health ───────────────────────────────────────────────────────────────────
// The platform uses this to tell whether the server and its database are up.
// Keep it: 503 while the database is unreachable, 200 once it is connected.
app.get('/api/health', (_req: Request, res: Response) => {
  const db = databaseState();
  res.status(db === 'up' ? 200 : 503).json({ status: db === 'up' ? 'ok' : 'degraded', db });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRouter);

// ─── Errors ───────────────────────────────────────────────────────────────────
app.use(errorHandler);

// Listen first, then connect: the server stays up and reports the database as
// down while it is unreachable, rather than crashing.
app.listen(port, '0.0.0.0', () => {
  console.log(`API listening on port ${port}`);
});
void connectDatabase();
