import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Trash2 } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { storageService } from '@/services/storageService';
import { Product } from '@/types/product';

export default function HistoryScreen() {
  const [scanHistory, setScanHistory] = useState<Product[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await storageService.getScanHistory();
      setScanHistory(history);
    } catch (error) {
      console.error('Failed to load scan history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await storageService.clearScanHistory();
      setScanHistory([]);
    } catch (error) {
      console.error('Failed to clear scan history:', error);
    }
  };

  if (scanHistory.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scan History</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Clock size={80} color="#D1D5DB" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptyText}>
            Start scanning food products to see your history here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Trash2 size={20} color="#EF4444" strokeWidth={2} />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {scanHistory.map((product, index) => (
          <ProductCard key={`${product.barcode}-${index}`} product={product} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});