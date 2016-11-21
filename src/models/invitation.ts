import { User } from '../models/user';
import { Parti } from '../models/parti';

export interface Invitation {
  id: number;
  parti: Parti;
  user: User;
  recipient: User;
}
