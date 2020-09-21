import { autoInjectable } from 'tsyringe';
import { Client, CategoryChannel } from 'discord.js';

@autoInjectable()
export default class ModmailHelper {
  discordBot: Client;

  constructor(discordClient: Client) {
    this.discordBot = discordClient;
  }

  formatConversation = (conversationColumn): Conversation => {
    const { user } = global.getDiscordUser(conversationColumn.user_id);
    const category = this.discordBot.channels.cache
      .find((cat) => cat.id === conversationColumn.category_id) as CategoryChannel;

    return {
      ConversationID: Number(conversationColumn.conversation_id),
      Active: conversationColumn.active,
      User: {
        username: `${user.username}#${user.discriminator}`,
        userID: conversationColumn.user_id,
        AvatarURL: user.displayAvatarURL({ dynamic: true }),
      },
      Meta: {
        GuildIcon: category ? category.guild.iconURL({ dynamic: true }) : 'no_permission',
        GuildName: category ? category.guild.name : 'no_permission',
        CategoryName: category ? category.name : 'no_permission',
        CategoryID: conversationColumn.category_id,
        ChannelName: `#${(user.username).toLowerCase()}-${user.discriminator}`,
        ChannelID: conversationColumn.channel_id,
      },
      LastUpdatedAt: conversationColumn.last_update_at,
      CreatedAt: conversationColumn.created_at,
      ClosingDate: conversationColumn.closing_date,
    };
  }

  formatConversationMessage = (message, reqUrl): ConversationMessage => ({
    MessageID: message.message_id,
    Author: {
      AvatarURL: global.getDiscordUser(message.author_id).user.displayAvatarURL({ dynamic: true }),
      Mod: message.made_by_mod,
      Name: global.getDiscordUser(message.author_id).user.username,
      ID: message.author_id,
    },
    Message: {
      Internal: message.internal,
      Content: message.message,
      Deleted: message.deleted,
    },
    attachment: message.attachment === null ? null : `${reqUrl}/modmail/attachment/${message.message_id}`,
    CreatedAt: message.created_at,
  })

  formatPermissionMeta = (column): ModmailPermissionMeta => {
    const category = this.discordBot.channels.cache
      .find((cat) => cat.id === column.category_id) as CategoryChannel;

    return {
      Guild: category ? category.guild.name : 'no_permission',
      CategoryName: category ? category.name : 'no_permission',
      CategoryID: category ? category.id : 'no_permission',
      EmoteID: column.emote_id,
    };
  }

  formatPermissionRole = (data): ModmailPermissionRole => ({
    Role: {
      Name: data.role_name,
      ID: data.role_id,
    },
    Active: data.active,
    UpdatedAt: data.last_update_at,
    CreatedAt: data.created_at,
  })
}
