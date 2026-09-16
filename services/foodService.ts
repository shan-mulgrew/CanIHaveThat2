import { Product } from '@/types/product';
import { storageService } from './storageService';

class FoodService {
  private baseUrl = 'https://world.openfoodfacts.org/api/v0/product';

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      //console.log("barcode");
      //console.log(barcode);
      const response = await fetch(`${this.baseUrl}/${barcode}.json`);
      const data = await response.json();

      if (data.status === 0) {
        throw new Error('Product not found');
      }

      const product = this.parseOpenFoodFactsProduct(data.product, barcode);
      
      
      // Save to history
     // console.log('adding to history :' ,{product});
      await storageService.addToScanHistory(product);
      
      return product;
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        console.warn('Product not found in database, using mock data:', error.message);
      } else {
        console.error('Error fetching product:', error);
      }
      // Return mock data for demonstration
      //return this.getMockProduct(barcode);
      return null;
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
      milk: ['milk', 'dairy', 'lactose', 'skimmed-milk', 'milk-powder'],
      eggs: ['eggs', 'egg'],
      peanuts: ['peanuts', 'peanut',],
      tree_nuts: ['almonds', 'walnuts', 'cashews', 'hazelnuts'],
      soy: ['soy', 'soya'],
      wheat: ['wheat'],
      fish: ['fish'],
      shellfish: ['shellfish', 'crustaceans', 'molluscs'],
    };
  
    //   // 1. Check OpenFoodFacts confirmed allergens
    allergensArray.forEach(allergen => {
      Object.keys(allergenMapping).forEach(key => {
  
        const allergenKey = key as keyof typeof allergenMapping;
  
        if (
          allergenMapping[allergenKey].some(term =>
            allergen.includes(term)
          )
        ) {
          allergens[allergenKey] = 'present';
        }
      });
    });
  
    // Check traces / may contain
    tracesArray.forEach(trace => {
      Object.keys(allergenMapping).forEach(key => {
  
        const allergenKey = key as keyof typeof allergenMapping;
  
        if (
          allergenMapping[allergenKey].some(term =>
            trace.includes(term)
          ) &&
          allergens[allergenKey] === 'unknown'
        ) {
          allergens[allergenKey] = 'may_contain';
        }
      });
    });
  
    // text checker incase an allergen is missed 
    // Check ingredient text
    const ingredientsLower = ingredientsText.toLowerCase();

    console.log('ingredientsLower');
    console.log(ingredientsLower);
    const ingredientSection = ingredientsLower.split(
      /allergy advice|may contain|may also contain/
    )[0];

    Object.keys(allergenMapping).forEach(key => {
      const allergenKey = key as keyof typeof allergenMapping;

      const foundInIngredients = allergenMapping[allergenKey].some(term =>
        ingredientSection.includes(term.toLowerCase())
      );

      console.log('[INGREDIENT CHECK]');
      console.log('Allergen:', allergenKey);
      console.log('Looking for:', allergenMapping[allergenKey]);
      console.log('Found:', foundInIngredients);

      if (foundInIngredients) {
        // Explicit ingredient evidence takes priority over may_contain
        allergens[allergenKey] = 'present';
      }
    });
    // i dont want to label an unknown allergen as not present when not info is given about it
    // Anything not identify
    // Object.keys(allergens).forEach(key => {
  
    //   const allergenKey = key as keyof Product['allergens'];
  
    //   if (allergens[allergenKey] === 'unknown') {
    //     allergens[allergenKey] = 'not_present';
    //   }
    // });
  
    return allergens;
  }

  private parseIngredients(ingredientsText: string): string[] {

    if (!ingredientsText) return [];
    console.log("Ingredients text:", ingredientsText);
    console.log("Length:", ingredientsText.length);
    return ingredientsText
      .split(/[,;]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0)

  }
}

export const foodService = new FoodService();