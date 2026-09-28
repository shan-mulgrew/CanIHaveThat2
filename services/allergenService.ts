import {
    Product,
    AllergenStatus,
  } from '@/types/product';
  
  import { AllergenPreference } from '@/types/allergen';
  
  export interface AllergenWarning {
    allergen: keyof AllergenPreference;
    status: AllergenStatus;
  }
  
  class AllergenService {
  
    checkProduct(
      product: Product,
      preferences: AllergenPreference,
      strictMode: boolean
    ): AllergenWarning[] {
  
      const warnings: AllergenWarning[] = [];
      console.log(product.allergens);
  
      Object.keys(preferences).forEach(key => {
       
        const allergen = key as keyof AllergenPreference;
        
        console.log(allergen);
        if (!preferences[allergen]) {
          return;
        }
       
  
        const status = product.allergens[allergen];
  
        if (status === 'present') {
          warnings.push({
            allergen,
            status,
          });
        }
  
        if (status === 'may_contain' && strictMode) {
          warnings.push({
            allergen,
            status,
          });
        }
      });
  
      return warnings;
    }

    getSortedAllergens(product: Product): [string, AllergenStatus][] {
      const priority: Record<AllergenStatus, number> = {
        present: 0,
        may_contain: 1,
        unknown: 2,
        not_present: 3,
      };
    
      return Object.entries(product.allergens).sort(
        ([, statusA], [, statusB]) =>
          priority[statusA] - priority[statusB]
      );
    }
  }
  
  export const allergenService = new AllergenService();