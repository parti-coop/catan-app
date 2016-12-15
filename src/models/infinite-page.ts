export interface InfinitePage<T> {
  has_more_item: boolean;
  has_gap: boolean;
  items: T[];
}
