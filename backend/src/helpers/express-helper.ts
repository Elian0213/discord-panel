import { autoInjectable } from 'tsyringe';
import { Request, Response } from 'express';

@autoInjectable()
export default class ExpressHelper {
  config: Config

  constructor(config: Config) {
    this.config = config;
  }

  headerMiddleware = async (req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Intended log for live debugging.
    // eslint-disable-next-line no-console
    console.log(`${req.method} - ${req.url}\n`);
    next();
  }

  authenticateMiddleware = async (req: Request, res: Response, next) => {
    if (req.url.startsWith('/auth/')) {
      // URL Starts with /auth/ AKA is authorizing / logging in.
      return next();
    }

    const authCode = req.header('Authorization');

    if (!authCode) {
      return this.unauthorizedError(res);
    }

    if (await global.authenticateUser(authCode, this.config.Permissions.defaultRole)) {
      const userData = await global.getUserInfo(req.header('Authorization'));

      if (userData.error.error) {
        return this.unauthorizedError(res);
      }

      req.user = userData.user;

      return next();
    }

    return this.unauthorizedError(res);
  }

  unauthorizedError = async (res: Response) => res.status(401)
    .json({
      status: 401,
      message: 'Unauthorized',
    })
}
