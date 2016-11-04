import { Comment } from '../models/comment';
import { Upvote } from '../models/upvote';
import { User } from '../models/user';
import { Post } from '../models/post';

export interface Message {
  id: number;
  comment_messagable: Comment;
  upvote_messagable: Upvote;
  messagable_type: string;
  sender: User;
  user: User;
  created_at: string;
  post: Post;
  desc: string;
}
