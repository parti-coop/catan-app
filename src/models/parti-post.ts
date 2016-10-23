import { Parti } from '../models/parti';

export interface PartiPost {
  id: number;
  title: string;
  body: string;
  parti: Parti;
}
