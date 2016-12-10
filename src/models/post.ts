import { Parti } from '../models/parti';
import { User } from '../models/user';
import { Comment } from '../models/comment';
import { Upvote } from '../models/upvote';
import { LinkSource } from '../models/link-source';
import { FileSource } from '../models/file-source';
import { Poll } from '../models/poll';
import { Share } from '../models/share';

export interface Post {
  id: number;
  full: boolean;
  parsed_title: string;
  parsed_body: string;
  truncated_parsed_body: string;
  specific_desc_striped_tags: string;
  parti: Parti;
  user: User;
  created_at: string;
  last_touched_at: string;
  is_upvotable: boolean;
  upvotes_count: number;
  latest_upvote_users: User[];
  latest_upvotes: Upvote[];
  comments_count: number;
  latest_comments: Comment[];
  link_reference: LinkSource;
  file_reference: FileSource;
  poll: Poll;
  share: Share;
}
