import { Thunk } from 'easy-peasy';

export interface Conversation {
  ConversationID: number;
  Active: boolean;
  User: {
    AvatarURL: string;
    username: string;
    userID: string;
  }
  Meta: {
    GuildIcon: string;
    GuildName: string;
    CategoryName: string;
    CategoryID: string;
    ChannelName: string;
    ChannelID: string;
  }
  LastUpdatedAt: string;
  CreatedAt: string;
  ClosingDate: null | string;
}

export interface FullConversation {
  Error: {
    status: number;
    message: string;
  }
  Conversation: Conversation;
  Messages: ConversationMessage[]
};

export interface ConversationMessage {
  MessageID: number;
  Author: {
    AvatarURL: string;
    Mod: boolean;
    Name: string;
    ID: string;
  }
  Message: {
    Internal: boolean;
    Content: string;
    Deleted: boolean;
  };
  attachment: string | null;
  CreatedAt: string;
}

export interface Permissions {
  Error: {
    status: number,
    message: string,
  } | boolean,
  Meta: {
    Guild: string,
    CategoryName: string,
    CategoryID: string,
    EmoteID: string,
  },
  Roles: {
    Role: {
      Name: string,
      ID: string,
    },
    Active: boolean,
    UpdatedAt: string,
    CreatedAt: string,
  }[]
}

export interface ModmailModel {
  //State
  currentConversation: number | null;

  // Getters & Setters
  getActiveConversations: Thunk
  getConversationLogs: Thunk<String>
}
