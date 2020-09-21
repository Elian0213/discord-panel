import { Thunk, Action } from 'easy-peasy';

export interface Member {
  AccessToken: string;
  ID: string;
  Email: string;
  AvatarHash: string,
  ProfileURL: string,
  Username: string,
  Roles: {
    ID: string;
    Name: string;
    Color: string,
  }[];
}

export interface MemberModel {
  //State
  currentMember: Member | null;

  // Getters & Setters
  setCurrentMember: Action<MemberModel, Member>;
  logoutCurrentMember: Action<MemberModel, null>;

  // Thunks: Http calls
  getCurrentMember: Thunk<MemberModel, string>;
  verifyOauth: Thunk<MemberModel>;
}
