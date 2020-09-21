import 'reflect-metadata';

import * as express from 'express';
import { container } from 'tsyringe';
import * as bodyParser from 'body-parser';
import * as discordjs from 'discord.js';
import * as cors from 'cors';
import { IController } from './types/controllers';
import ConfigService from './services/config-service';
import ExpressHelper from './helpers/express-helper';

// Controllers
import AuthController from './controllers/auth-controller';
import ModmailController from './controllers/modmail-controller';
import RuleManagerController from './controllers/rulemanager-controller';

// Entry point for the app.
const mainAsync = async () => {
  const app = express();

  const config = new ConfigService<Config>().loadConfigFromPath('./config.json');
  if (config == null) {
    throw new Error('config was not read properly. Please copy config.example.json and fill in the properties.');
  }

  const expressHelper = new ExpressHelper(config);

  container.register<Config>('Config', { useValue: config });

  // Initialize the discord bot
  global.DiscordBot = new discordjs.Client();
  global.DiscordBot.login(config.DiscordToken);

  // Formatting data & CORS
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Middleware
  app.use(expressHelper.headerMiddleware);

  app.use(expressHelper.authenticateMiddleware);

  // Authentication for inside the controller
  global.middlewareRoles = (checkRoles: string[]) => {
    app.use((req: any, res, next) => {
      if (!req.user.Roles.some((role) => checkRoles.includes(role.ID))) {
        return expressHelper.unauthorizedError(res);
      }

      return next();
    });
  };

  // Attach controllers
  app.use('/auth', container.resolve<IController>(AuthController).getRouter());
  app.use('/modmail', container.resolve<IController>(ModmailController).getRouter());
  app.use('/rule-manager', container.resolve<IController>(RuleManagerController).getRouter());

  // Start that boy
  app.listen(config.ExpressPort, () => {
    // eslint-disable-next-line no-console
    console.log('Starting the bot...');
  });

  global.DiscordBot.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log('Started! Backend running');
  });

  // Send error in config.ErrorLogChannel
  global.ErrorLogGlobal = async (title, tagUser, err) => {
    if (config.ErrorLoggingEnabled) {
      return (global.DiscordBot.channels.cache
        .get(config.ErrorLogChannel) as discordjs.TextChannel)
        .send(new discordjs.MessageEmbed()
          .setColor('#d13434')
          .setTitle(`Fatal error ${title}`)
          .setDescription(`Action ran by **${tagUser}**`)
          .addField('Error', err.message, false)
          .addField('Path', err.path, false)
          .setTimestamp()
          .setFooter(`HTTP Status: ${err.httpStatus}`, global.DiscordBot.user.avatarURL()))
        .then(() => true)
        .catch(() => false);
    }

    return true;
  };
};

mainAsync();
