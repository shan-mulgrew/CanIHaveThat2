import { Product } from '@/types/product';

class StorageService {
  private readonly SCAN_HISTORY_KEY = '@allergen_scanner:scan_history';
  private readonly MAX_HISTORY_ITEMS = 50;

  async getScanHistory(): Promise<Product[]> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.SCAN_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to get scan history:', error);
      return [];
    }
  }

  async addToScanHistory(product: Product): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const currentHistory = await this.getScanHistory();
        
        // Remove duplicate if exists (same barcode)
        const filteredHistory = currentHistory.filter(
          item => item.barcode !== product.barcode
        );
        
        // Add new product to beginning of array
        const newHistory = [product, ...filteredHistory].slice(0, this.MAX_HISTORY_ITEMS);
        
        localStorage.setItem(this.SCAN_HISTORY_KEY, JSON.stringify(newHistory));
      }
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