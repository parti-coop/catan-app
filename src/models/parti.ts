import { Group } from '../models/group';

export interface Parti {
  id: number;
  title: string;
  slug: string;
  logo_url: string;
  group: Group;
}
