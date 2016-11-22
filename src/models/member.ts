import { User } from '../models/user';
import { Parti } from '../models/parti';

export interface Member {
  id: number;
  parti: Parti;
  user: User;
  is_maker: boolean;
}
