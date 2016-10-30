import { Parti } from '../models/parti';
import { User } from '../models/user';
import { Comment } from '../models/comment';

export interface Post {
  id: number;
  title: string;
  body: string;
  parti: Parti;
  user: User;
  created_at: string;
  is_upvotable: boolean;
  comments: Comment[];
}
