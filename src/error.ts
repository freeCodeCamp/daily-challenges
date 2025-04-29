import express from 'express';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function handleError(err: any, res: express.Response) {
  if (err instanceof HttpError ) {
    console.warn(err);
    res.status(err.status).json({ error: err.message })
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' })
  }

  return;
}
