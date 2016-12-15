import { User } from '../models/user';
import { UserAction } from '../models/user-action';

export interface Voting extends UserAction {
  id: number;
  user: User;
}
