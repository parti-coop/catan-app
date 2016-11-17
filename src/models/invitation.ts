import { User } from '../models/user';
import { Parti } from '../models/parti';
import { Post } from '../models/post';

export interface Invitation {
  id: number;
  parti: Post;
  user: User;
  recipient: User;
}
