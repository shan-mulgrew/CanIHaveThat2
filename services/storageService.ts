import { Product } from '@/types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
class StorageService {
  private readonly SCAN_HISTORY_KEY = '@allergen_scanner:scan_history';
  private readonly MAX_HISTORY_ITEMS = 50;

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
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.SCAN_HISTORY_KEY);
      }
    } catch (error) {
      console.error('Failed to clear scan history:', error);
    }
  }
}

export const storageService = new StorageService();