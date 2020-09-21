import { createStore, createTypedHooks } from 'easy-peasy';
import { MemberModel, memberModel } from './member';
import { ModmailModel, modmailModel } from './modmail';

export interface StoreModel {
  modmail: ModmailModel;
  member: MemberModel;
}

const store = createStore<StoreModel>({
  member: memberModel,
  modmail: modmailModel
});

export const {
  useStoreActions,
  useStoreDispatch,
  useStoreState,
} = createTypedHooks<StoreModel>();

export default store;
