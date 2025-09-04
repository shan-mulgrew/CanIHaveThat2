import { Product, AllergenStatus } from '@/types/product';
import { storageService } from './storageService';

class FoodService {
  private baseUrl = 'https://world.openfoodfacts.org/api/v0/product';

  async getProductByBarcode(barcode: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/${barcode}.json`);
      const data = await response.json();

      if (data.status === 0) {
        throw new Error('Product not found');
      }

      const product = this.parseOpenFoodFactsProduct(data.product, barcode);
      
      // Save to history
      await storageService.addToScanHistory(product);
      
      return product;
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        console.warn('Product not found in database, using mock data:', error.message);
      } else {
        console.error('Error fetching product:', error);
      }
      // Return mock data for demonstration
      return this.getMockProduct(barcode);
    }
  }

  private parseOpenFoodFactsProduct(openFoodProduct: any, barcode: string): Product {
    const allergens = this.parseAllergens(
      openFoodProduct.allergens_tags || [],
      openFoodProduct.traces_tags || [],
      openFoodProduct.ingredients_text || ''
    );

    return {
      barcode,
      name: openFoodProduct.product_name || 'Unknown Product',
      brand: openFoodProduct.brands || 'Unknown Brand',
      image: openFoodProduct.image_front_url,
      ingredients: this.parseIngredients(openFoodProduct.ingredients_text),
      allergens,
      nutritionGrade: openFoodProduct.nutrition_grades,
      scanDate: new Date(),
    };
  }

  private parseAllergens(
    allergensArray: string[],
    tracesArray: string[],
    ingredientsText: string
  ): Product['allergens'] {
    const allergens: Product['allergens'] = {
      milk: 'unknown',
      eggs: 'unknown',
      peanuts: 'unknown',
      tree_nuts: 'unknown',
      soy: 'unknown',
      wheat: 'unknown',
      fish: 'unknown',
      shellfish: 'unknown',
    };

    const allergenMapping = {
      milk: ['milk', 'dairy', 'lactose', 'cream', 'butter', 'cheese'],
      eggs: ['eggs', 'egg'],
      peanuts: ['peanuts', 'peanut'],
      tree_nuts: ['nuts', 'almonds', 'walnuts', 'cashews', 'hazelnuts'],
      soy: ['soy', 'soya'],
      wheat: ['wheat', 'gluten'],
      fish: ['fish'],
      shellfish: ['shellfish', 'crustaceans', 'molluscs'],
    };

    const ingredientsLower = ingredientsText.toLowerCase();

    // Check for present allergens
    allergensArray.forEach(allergen => {
      Object.keys(allergenMapping).forEach(key => {
        if (allergenMapping[key as keyof typeof allergenMapping].some(term => 
          allergen.includes(term)
        )) {
          allergens[key as keyof Product['allergens']] = 'present';
        }
      });
    });

    // Check for traces (may contain)
    tracesArray.forEach(trace => {
      Object.keys(allergenMapping).forEach(key => {
        if (allergenMapping[key as keyof typeof allergenMapping].some(term => 
          trace.includes(term)
        ) && allergens[key as keyof Product['allergens']] === 'unknown') {
          allergens[key as keyof Product['allergens']] = 'may_contain';
        }
      });
    });

    // Check ingredients text for additional detection
    Object.keys(allergenMapping).forEach(key => {
      if (allergens[key as keyof Product['allergens']] === 'unknown') {
        const hasAllergen = allergenMapping[key as keyof typeof allergenMapping].some(term =>
          ingredientsLower.includes(term)
        );
        if (hasAllergen) {
          allergens[key as keyof Product['allergens']] = 'present';
        } else {
          allergens[key as keyof Product['allergens']] = 'not_present';
        }
      }
    });

    return allergens;
  }

  private parseIngredients(ingredientsText: string): string[] {
    if (!ingredientsText) return [];
    
    return ingredientsText
      .split(/[,;]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0)
      .slice(0, 20); // Limit to first 20 ingredients
  }

  private getMockProduct(barcode: string): Product {
    // Mock data for demonstration
    const mockProducts = [
      {
        barcode,
        name: 'Organic Peanut Butter',
        brand: 'Nature\'s Best',
        ingredients: ['Organic Peanuts', 'Salt'],
        allergens: {
          milk: 'not_present' as AllergenStatus,
          eggs: 'not_present' as AllergenStatus,
          peanuts: 'present' as AllergenStatus,
          tree_nuts: 'may_contain' as AllergenStatus,
          soy: 'not_present' as AllergenStatus,
          wheat: 'not_present' as AllergenStatus,
          fish: 'not_present' as AllergenStatus,
          shellfish: 'not_present' as AllergenStatus,
        },
        nutritionGrade: 'b',
        scanDate: new Date(),
      },
      {
        barcode,
        name: 'Whole Wheat Bread',
        brand: 'Bakery Fresh',
        ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar'],
        allergens: {
          milk: 'not_present' as AllergenStatus,
          eggs: 'not_present' as AllergenStatus,
          peanuts: 'not_present' as AllergenStatus,
          tree_nuts: 'not_present' as AllergenStatus,
          soy: 'may_contain' as AllergenStatus,
          wheat: 'present' as AllergenStatus,
          fish: 'not_present' as AllergenStatus,
          shellfish: 'not_present' as AllergenStatus,
        },
        nutritionGrade: 'a',
        scanDate: new Date(),
      },
    ];

    return mockProducts[Math.floor(Math.random() * mockProducts.length)];
  }
}

export const foodService = new FoodService();