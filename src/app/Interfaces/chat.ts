import { User } from './user';

export interface Chat {
  chatId: string;
  lastMessage: string;
  timestamp: string;
  users: { uid: User['uid']; displayName: User['displayName'] }[];
}
