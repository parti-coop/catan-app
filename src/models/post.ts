import { Parti } from '../models/parti';
import { User } from '../models/user';
import { Comment } from '../models/comment';
import { LinkSource } from '../models/link-source';
import { FileSource } from '../models/file-source';
import { Poll } from '../models/poll';

export interface Post {
  id: number;
  title: string;
  body: string;
  parti: Parti;
  user: User;
  created_at: string;
  is_upvotable: boolean;
  upvotes_count: number;
  comments_count: number;
  comments: Comment[];
  link_reference: LinkSource;
  file_reference: FileSource;
  poll: Poll;
}
