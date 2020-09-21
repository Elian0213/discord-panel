import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import { IController } from '../types/controllers';
import DiscordService from '../services/discord-service';

@autoInjectable()
export default class AuthController implements IController {
  discordService: DiscordService;

  constructor(discordService: DiscordService) {
    this.discordService = discordService;
  }

  getInitAuthDiscordAsync = async (req, res) => {
    const response = await this.discordService.initAuthorize(req.query.code);

    if (response?.error) {
      res.status(401);
      return res.json(response);
    }

    const memberInfo = await this.discordService.getParsedInfo(response.access_token);

    // If authcode is invalid for some reason, give status code 401
    if (memberInfo.error.error) {
      res.status(401);
      return res.json(memberInfo.error);
    }

    return res.json(memberInfo.user);
  }

  getAuthDiscordAsync = async (req, res) => {
    const memberInfo = await this.discordService.getParsedInfo(req.query.code);

    // If authcode is invalid for some reason, give status code 401
    if (memberInfo.error.error) {
      res.status(401);
      return res.json(memberInfo.error);
    }

    return res.json(memberInfo.user);
  }

  getRouter = (): Router => {
    const router = Router();

    global.authenticateUser = this.discordService.authenticateCurrentUser;
    global.getUserInfo = this.discordService.getParsedInfo;
    global.getDiscordUser = this.discordService.getMember;

    // Initial authentication
    router.get('/init-discord', this.getInitAuthDiscordAsync);

    // Re-authorize existing token.
    router.get('/discord', this.getAuthDiscordAsync);

    return router;
  }
}
