export type AllergenKey =
  | 'milk'
  | 'eggs'
  | 'peanuts'
  | 'tree_nuts'
  | 'soy'
  | 'wheat'
  | 'fish'
  | 'shellfish';

export interface AllergenPreference {
  milk: boolean;
  eggs: boolean;
  peanuts: boolean;
  tree_nuts: boolean;
  soy: boolean;
  wheat: boolean;
  fish: boolean;
  shellfish: boolean;
}