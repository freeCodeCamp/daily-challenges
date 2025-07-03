import debug from 'debug';
import { Request, Response, NextFunction } from 'express';

export const serverLog = debug('app:server');

export const serverErrorLog = debug('app:server:error');
export const requestLog = debug('app:request');
export const requestErrorLog = debug('app:request:error');

function getRequestInfo(req: Request) {
  return {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: Object.keys(req.params).length > 0 ? JSON.stringify(req.params) : ''
  };
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { timestamp, method, url, params } = getRequestInfo(req);

  requestLog(`${timestamp} - ${method} ${url}${params}`);

  next();
};

export const requestErrorLogger = (
  req: Request,
  err: Error,
  statusCode: number
) => {
  const { timestamp, method, url, params } = getRequestInfo(req);

  requestErrorLog(`${timestamp} - ${method} ${url}${params}`);
  requestErrorLog(`⚠️ ${statusCode}: ${err.message}`);
};

export const serverErrorLogger = (req: Request, err: Error) => {
  const { timestamp, method, url, params } = getRequestInfo(req);

  serverErrorLog(`${timestamp} - ${method} ${url}${params}`);
  serverErrorLog(`❌ 500: ${err.message}`);
  serverErrorLog(`Stack: ${err.stack || 'No stack trace available'}`);
};
