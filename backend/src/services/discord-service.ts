import { autoInjectable, inject } from 'tsyringe';
import axios from 'axios';
import * as qs from 'qs';
import { GuildMember, Role } from 'discord.js';

@autoInjectable()
export default class DiscordService {
  config: Config;

  constructor(@inject('Config') config: Config) {
    this.config = config;
  }

  /**
   * Authorize with token returned from authorizing with Oauth
   * @param code token put in URL as query string
   */
  initAuthorize = async (code: string): Promise<any> => axios({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      client_id: this.config.DiscordAccessKey,
      client_secret: this.config.DiscordSecretKey,
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.DiscordRedirectUrl,
      scope: this.config.DiscordScopes.join(' '),
    }),
    url: 'https://discord.com/api/v6/oauth2/token',
  })
    .then((response) => response.data)
    .catch((err) => err.response);

  /**
   * Re-authorize with token returned from api/v6/oauth2/token
   * @param accessKey Discord token to authorize
   */
  getCurrentUser = async (accessKey: string): Promise<currentUser> => this.createDiscordRequest(accessKey, '/users/@me')
    .then((data) => ({
      error: !data?.username,
      user: data,
    }))

  /**
   * Returns true/false depending on if the user has the specified discord roles or not.
   * @param Code Discord token to authorize
   * @param checkRoles Array with roles on which will be checked
   */
  authenticateCurrentUser = async (Code: string, checkRoles: string[]): Promise<boolean> => this
    .getCurrentUser(Code)
    .then(async (data) => {
      if (data.error) {
        return false;
      }

      return this.getGuildRoles(data.user.id)
        .then((userRoles) => userRoles.some((role) => checkRoles.includes(role.ID)))
        .catch(() => false);
    })

  /**
   * Get all relevent user data
   * @param Code Discord token to authorize
   */
  getParsedInfo = async (code: string): Promise<ParsedUserInfo> => {
    const userData = await this.getCurrentUser(code);

    if (userData.error) {
      // Probably 401 - unauthorized. AKA Invalid auth code.
      return {
        error: {
          error: true,
          message: 'Error while authenticating user.',
        },
        user: {} as Member,
      };
    }

    const memberInfo: GuildMember = this.getMember(userData.user.id);
    const userRoles = await this.getGuildRoles(userData.user.id);

    if (!userRoles.some((role) => (this.config.Permissions.defaultRole).includes(role.ID))) {
      global.ErrorLogGlobal('Authentication', memberInfo.user.tag, {
        httpStatus: 400,
        message: 'Missing required roles, attempted to access panel.',
        path: '/auth/discord?code=HIDDEN_FOR_PRIVACY_REASONS',
      });

      return {
        error: {
          error: true,
          message: 'You are missing the required roles.',
        },
        user: {} as Member,
      };
    }

    return {
      error: {
        error: false,
        message: '',
      },
      user: {
        AccessToken: code,
        ID: userData.user.id,
        Email: userData.user.email,
        AvatarHash: userData.user.avatar,
        ProfileURL: memberInfo.user.avatarURL(),
        Username: `${userData.user.username}#${memberInfo.user.discriminator}`,
        Roles: userRoles,
      },
    };
  }

  /**
   * Get all discord roles from specified Member
   * @param memberID Discord member ID
   */
  getGuildRoles = async (memberID: string): Promise<MemberRole[]> => this
    .getMember(memberID).roles.cache
    .sort((a: Role, b: Role) => a.position - b.position || Number(a.id) - Number(b.id))
    .map((role): MemberRole => ({
      ID: role.id,
      Name: role.name,
      Color: role.hexColor,
    })).reverse();

  /**
   * Get discord member by ID
   * @param memberID Discord member ID
   */
  getMember = (memberID): GuildMember => global.DiscordBot.guilds.cache
    .get(this.config.DiscordGuildID)
    .members.cache.get(memberID)

  /**
   * Create default api/v6 discord GET request
   * @param accessKey is discord oAuth token
   * @param path Specify the path to get certain data.
   */
  createDiscordRequest = async (accessKey: string, path: string) => axios.get(`https://discord.com/api/v6${path}`, {
    headers: {
      Authorization: `Bearer ${accessKey}`,
    },
  }).then((response) => response.data)
    .catch((err) => err.response)
}
