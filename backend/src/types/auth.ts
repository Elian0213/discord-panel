type ParsedUserInfo = {
  error: {
    error: boolean,
    message: string,
  },
  user: Member
}

type Member = {
  AccessToken: string;
  ID: string;
  Email: string;
  AvatarHash: string,
  ProfileURL: string,
  Username: string,
  Roles: MemberRole[]
}

type MemberRole = {
  ID: string;
  Name: string;
  Color: string;
}

type currentUser = {
  error: boolean,
  user: any,
}
