import { User } from '../models/user';

export interface Poll {
  id: number;
  title: string;
  votings_count: number;
  agreed_votings_count: number;
  disagreed_votings_count: number;
  latest_agreed_voting_users: User[];
  latest_disagreed_voting_users: User[];
  my_choice: string;
}
