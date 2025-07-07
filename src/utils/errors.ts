import express from 'express';
import {
  requestErrorLogger,
  serverErrorLogger,
  serverErrorLog
} from './logger';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function handleError(
  err: HttpError | Error | unknown,
  req: express.Request,
  res: express.Response
) {
  if (err instanceof HttpError) {
    requestErrorLogger(req, err, err.status);
    res.status(err.status).json({ error: err.message });
  } else if (err instanceof Error) {
    serverErrorLogger(req, err);
    res.status(500).json({ error: 'Internal server error' });
  } else {
    serverErrorLog(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  return;
}
