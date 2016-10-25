import { Parti } from '../models/parti';

export interface Post {
  id: number;
  title: string;
  body: string;
  parti: Parti;
}
