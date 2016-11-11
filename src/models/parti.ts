import { Group } from '../models/group';

export interface Parti {
  id: number;
  title: string;
  body: string;
  slug: string;
  logo_url: string;
  group: Group;
  updated_at: string;
  latest_members_count: number;
  latest_posts_count: number;
  members_count: number;
  posts_count: number;
  is_member: boolean;
  is_made_by: boolean;
}
