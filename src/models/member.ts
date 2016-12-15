import { User } from '../models/user';
import { Parti } from '../models/parti';
import { UserAction } from '../models/user-action';

export interface Member extends UserAction {
  id: number;
  parti: Parti;
  user: User;
  is_maker: boolean;
}
