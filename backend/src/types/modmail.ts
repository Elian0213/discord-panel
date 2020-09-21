type FullConversation = {
  Error: ModmailError | boolean,
  Conversation: Conversation,
  Messages: ConversationMessage[]
};

type Conversation = {
  ConversationID: number;
  Active: boolean;
  User: {
    username: string;
    userID: string;
    AvatarURL: string;
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
};

type ConversationMessage = {
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

// Permission calls

type ModmailPermission = {
  Error: ModmailError | boolean,
  Meta: ModmailPermissionMeta,
  Roles: ModmailPermissionRole[]
}

type ModmailPermissionMeta = {
  Guild: string,
  CategoryName: string,
  CategoryID: string,
  EmoteID: string,
}

type ModmailPermissionRole = {
  Role: {
    Name: string,
    ID: string,
  },
  Active: boolean,
  UpdatedAt: string,
  CreatedAt: string,
}

// Global usage in Modmail.

type ModmailError = {
  status: number,
  message: string,
}
