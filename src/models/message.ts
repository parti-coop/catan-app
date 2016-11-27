import { Comment } from '../models/comment';
import { Upvote } from '../models/upvote';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Invitation } from '../models/invitation';
import { Parti } from '../models/parti';
import { Member } from '../models/member';

export interface Message {
  id: number;
  comment_messagable: Comment;
  upvote_messagable: Upvote;
  invitation_messagable: Invitation;
  parti_messagable: Parti;
  member_messagable: Member;

  messagable_type: string;
  sender: User;
  user: User;
  created_at: string;
  post: Post;
  parti: Parti;
  desc: string;
  read_at: string;
}
