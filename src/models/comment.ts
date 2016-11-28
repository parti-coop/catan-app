import { User } from '../models/user';

export interface Comment {
  id: number;
  body: string;
  upvotes_count: number;
  user: User;
  created_at: string;
  is_mentionable: boolean;
  is_upvotable: boolean;
  is_blinded: boolean;
  choice: string;
}
