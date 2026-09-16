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
        console.log("all allergens");
        console.log(allergen);
        if (!preferences[allergen]) {
          return;
        }
        console.log("allergen that user has selected as yes");
        console.log(allergen);
  
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
  }
  
  export const allergenService = new AllergenService();