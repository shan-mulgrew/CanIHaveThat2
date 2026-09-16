import { AllergenPreference } from '@/types/allergen';
import { Product } from '@/types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
class StorageService {
  private readonly SCAN_HISTORY_KEY = '@allergen_scanner:scan_history';
  private readonly MAX_HISTORY_ITEMS = 50;
  private readonly ALLERGEN_PREFERENCES_KEY = '@allergen_scanner:allergen_preferences';

  async getScanHistory(): Promise<Product[]> {
    try {
      const stored = await AsyncStorage.getItem(this.SCAN_HISTORY_KEY);
      //console.log('...', stored);
      return stored ? JSON.parse(stored) : [];
  
    } catch (error) {
      console.error('Failed to get scan history:', error);
      return [];
    }
  }

  async addToScanHistory(product: Product): Promise<void> {
    try {
      const currentHistory = await this.getScanHistory();
  
      const filteredHistory = currentHistory.filter(
        item => item.barcode !== product.barcode
      );
  
      const newHistory = [
        product,
        ...filteredHistory
      ].slice(0, this.MAX_HISTORY_ITEMS);
  
      //console.log('New History:', newHistory);
  
      await AsyncStorage.setItem(
        this.SCAN_HISTORY_KEY,
        JSON.stringify(newHistory)
      );
  
      console.log('History saved');
  
    } catch (error) {
      console.error('Failed to add to scan history:', error);
    }
  }

  async clearScanHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SCAN_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear scan history:', error);
    }
  }
  async saveAllergenPreferences(
    preferences: AllergenPreference
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.ALLERGEN_PREFERENCES_KEY,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Failed to save allergen preferences:', error);
    }
  }

  async getAllergenPreferences(): Promise<AllergenPreference> {
    try {
      const stored = await AsyncStorage.getItem(
        this.ALLERGEN_PREFERENCES_KEY
      );

      if (stored) {
        return JSON.parse(stored);
      }

      return {
        milk: true,
        eggs: true,
        peanuts: true,
        tree_nuts: true,
        soy: true,
        wheat: true,
        fish: true,
        shellfish: true,
      };

    } catch (error) {
      console.error('Failed to get allergen preferences:', error);

      return {
        milk: true,
        eggs: true,
        peanuts: true,
        tree_nuts: true,
        soy: true,
        wheat: true,
        fish: true,
        shellfish: true,
      };
    }
  }
}


export const storageService = new StorageService();