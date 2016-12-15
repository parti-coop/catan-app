import { User } from '../models/user';

export interface UserAction {
  id: number;
  user: User;
  is_maker: boolean;
}
