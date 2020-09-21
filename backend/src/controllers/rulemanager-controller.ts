import { Router } from 'express';
import { autoInjectable, inject } from 'tsyringe';
import RuleManagerService from '../services/rulemanager-service';
import { IController } from '../types/controllers';

type resp = {
  success: boolean
}

@autoInjectable()
export default class RuleManagerController implements IController {
  ruleManagerService: RuleManagerService;

  Config: Config;

  constructor(@inject('Config') config: Config, service: RuleManagerService) {
    this.ruleManagerService = service;
    this.Config = config;
  }

  getRuleSettings = async (req, res) => res.json(await this.ruleManagerService.getServerRules())

  setRuleSettings = async (req, res) => {
    const data: postRules = req.body;
    const response: resp = await this.ruleManagerService
      .setServerRules(data.rules, data.channel, req.user.ID);

    if (!response.success) {
      res.status(401);
    }

    return res.json(response);
  }

  getChannels = async (req, res) => res.json(await this.ruleManagerService.getServerChannelData())

  getRouter = (): Router => {
    const router = Router();

    // Authenticate
    global.middlewareRoles(this.Config.Permissions.ruleManager);

    // Get current rules.
    router.get('/get', this.getRuleSettings);

    // Update rules.
    router.post('/set', this.setRuleSettings);

    // Get the channels from the defined category in the config.Rules.categoryID
    router.get('/channels', this.getChannels);

    return router;
  }
}
