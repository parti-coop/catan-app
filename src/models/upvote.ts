import { User } from '../models/user';
import { Comment } from '../models/comment';
import { Post } from '../models/post';

export interface Upvote {
  id: number;
  post_upvotable: Post;
  comment_upvotable: Comment;
  user: User;
  upvotable_type: string;
}
