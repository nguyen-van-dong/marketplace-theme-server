// bull-ui-secure.middleware.ts
import { RequestHandler } from 'express';
import * as basicAuth from 'express-basic-auth';
import { Request, Response, NextFunction } from 'express';

const ipWhitelist = (req: Request, res: Response, next: NextFunction): void => {
  const ip = (req.ip || req.connection.remoteAddress || '').toString();
  const allowedIps = (process.env.BULL_UI_WHITELIST || '127.0.0.1,::1,::ffff:127.0.0.1')
    .split(',')
    .map(i => i.trim());

  if (!allowedIps.includes(ip)) {
    res.status(403).send('🚫 Access denied');
    return;
  }

  next();
};

const basicAuthMiddleware = basicAuth({
  users: {
    [process.env.BULL_UI_USER || 'admin']: process.env.BULL_UI_PASS || 'secret',
  },
  challenge: true,
});

export const secureBullUiMiddleware: RequestHandler[] = [
  ipWhitelist,
  basicAuthMiddleware,
];
