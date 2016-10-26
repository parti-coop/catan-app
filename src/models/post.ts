import { Parti } from '../models/parti';
import { User } from '../models/user';

export interface Post {
  id: number;
  title: string;
  body: string;
  parti: Parti;
  user: User;
  created_at: string;
}
