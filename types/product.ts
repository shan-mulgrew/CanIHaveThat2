export type AllergenStatus = 'present' | 'may_contain' | 'not_present' | 'unknown';

export interface Product {
  barcode: string;
  name: string;
  brand: string;
  image?: string;
  ingredients?: string[];
  allergens: {
    milk: AllergenStatus;
    eggs: AllergenStatus;
    peanuts: AllergenStatus;
    tree_nuts: AllergenStatus;
    soy: AllergenStatus;
    wheat: AllergenStatus;
    fish: AllergenStatus;
    shellfish: AllergenStatus;
  };
  nutritionGrade?: string;
  scanDate?: Date;
}