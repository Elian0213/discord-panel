import { autoInjectable, inject } from 'tsyringe';
import { Pool } from 'pg';
import * as discordjs from 'discord.js';

@autoInjectable()
export default class RuleManagerService {
  config: Config;

  postgres: Pool;

  constructor(@inject('Config') config: Config) {
    this.postgres = new Pool(config.Database);
    this.config = config;
  }

  getServerRules = async () => this.postgres
    .query(`select * from ${this.config.Rules.tableName} order by id desc  limit 1`)
    .then((res) => res.rows[0].rules)
    .catch(() => ({
      error: true,
    }))

  logRuleChange = async (newRules, userID) => this.postgres
    .query(`INSERT INTO ${this.config.Rules.tableName} (user_id, rules) VALUES ($1, $2)`, [userID, JSON.stringify(newRules)])
    .then(() => true)
    .catch(() => false)

  setServerRules = async (newRules, ChannelID, userID): Promise<{ success: boolean }> => (global
    .DiscordBot.channels.cache
    .get(ChannelID) as discordjs.TextChannel).messages.fetch({ limit: 100 })
    .then(async (messageCollection: discordjs.Collection<string, discordjs.Message>) => {
      messageCollection.map((msg: discordjs.Message) => msg.delete());
      newRules.map((ruleEmbed) => this.sendChannelMessage(ChannelID, { embed: ruleEmbed }));

      return {
        success: await this.logRuleChange(newRules, userID),
      };
    })
    .catch((err) => {
      global.ErrorLogGlobal('setServerRules', global.DiscordBot.users.cache.get(userID).tag, err);

      return {
        success: false,
      };
    })

  sendChannelMessage = (channelID, message): void => {
    (global.DiscordBot.channels.cache.get(channelID) as discordjs.TextChannel).send(message);
  }

  getServerChannelData = () => global.DiscordBot.guilds.cache
    .get(this.config.DiscordGuildID)
    .channels.cache
    .filter((channel) => channel.parentID === this.config.Rules.categoryID)
    .map((channel): any => ({
      id: channel.id,
      name: `#${channel.name}`,
    }))
    .filter((channel) => channel)
}
