import express from 'express';
import { requestErrorLogger, serverErrorLogger } from './logger';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function handleError(err: any, req: express.Request, res: express.Response) {
  if (err instanceof HttpError ) {
    requestErrorLogger(req, err, err.status);
    res.status(err.status).json({ error: err.message })
  } else {
    serverErrorLogger(req, err);
    res.status(500).json({ error: 'Internal server error' })
  }

  return;
}
