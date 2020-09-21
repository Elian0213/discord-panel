type Config = {
  ExpressPort: number,
  ErrorLogChannel: string,
  ErrorLoggingEnabled: boolean,
  DiscordToken: string;
  DiscordAccessKey: string;
  DiscordSecretKey: string;
  DiscordRedirectUrl: string;
  DiscordGuildID: string;
  DiscordScopes: string[];
  Database: object;
  Rules: {
    tableName: string;
    categoryID: string;
  }
  Permissions: {
    defaultRole: string[];
    ruleManager: string[];
  }
}

type postRules = {
  rules: object[];
  channel: string;
}

type discordError = {
  path: string;
  message: string;
  httpStatus: number;
}
