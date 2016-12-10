import { User } from '../models/user';
import { Comment } from '../models/comment';
import { Post } from '../models/post';

export interface Upvote {
  id: number;
  user: User;
  upvotable_id: number;
  upvotable_type: string;
}
