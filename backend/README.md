# discord-panel-backend

Backend service for the frontend to connect to.

## Setup

How to set the backend up.

## Install packages

Install packages by either running `npm i` or `yarn`

### Config setup

Copy `config.example.json` and rename it to `config.json` and fill in the needed variables

```json
{
  "ExpressPort": 8080,
  "ErrorLogChannel": "",
  "ErrorLoggingEnabled": true,
  "DiscordToken": "",
  "DiscordAccessKey": "",
  "DiscordSecretKey": "",
  "DiscordRedirectUrl": "http://localhost:3000/discord-auth",
  "DiscordGuildID": "",
  "DiscordScopes": ["identify", "email", "guilds"],
  "Database": {
    "user": "user",
    "host": "127.0.0.1",
    "database": "postgres",
    "password": "",
    "port": "5432"
  },
  "Rules": {
    "tableName": "discordpanel.rule_manager",
    "categoryID": ""
  },
  "Permissions": {
    "defaultRole": [""],
    "ruleManager": [""]
  }
}
```

### Run

Run it by using one of the predefined scripts in `package.json` and.
e.g. `yarn dev`

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "dev": "tsc && node dist/app"
  },
```

# Make sure you have Node and/or Yarn installed

download [nodejs](https://nodejs.org/en/) and download [yarn](https://yarnpkg.com/)
