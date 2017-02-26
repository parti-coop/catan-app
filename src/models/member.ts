import { User } from '../models/user';
import { Parti } from '../models/parti';
import { Group } from '../models/group';
import { UserAction } from '../models/user-action';

export interface Member extends UserAction {
  id: number;
  parti_joinable: Parti;
  group_joinable: Group;
  joinable_type: string;
  user: User;
  is_maker: boolean;
}
