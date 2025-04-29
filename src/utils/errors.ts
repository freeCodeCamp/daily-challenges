import express from 'express';
import debug from 'debug';

const log = debug('app:errors');

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function handleError(err: any, res: express.Response) {
  if (err instanceof HttpError ) {
    log(err);
    res.status(err.status).json({ error: err.message })
  } else {
    log(err);
    res.status(500).json({ error: 'Internal server error' })
  }

  return;
}
