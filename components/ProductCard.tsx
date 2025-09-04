import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Info } from 'lucide-react-native';
import { Product, AllergenStatus } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getAllergenIcon = (status: AllergenStatus) => {
    switch (status) {
      case 'present':
        return <XCircle size={16} color="#EF4444" strokeWidth={2} />;
      case 'may_contain':
        return <AlertTriangle size={16} color="#F59E0B" strokeWidth={2} />;
      case 'not_present':
        return <CheckCircle size={16} color="#10B981" strokeWidth={2} />;
      default:
        return <Info size={16} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getAllergenColor = (status: AllergenStatus) => {
    switch (status) {
      case 'present':
        return '#FEE2E2';
      case 'may_contain':
        return '#FEF3C7';
      case 'not_present':
        return '#D1FAE5';
      default:
        return '#F3F4F6';
    }
  };

  const getAllergenTextColor = (status: AllergenStatus) => {
    switch (status) {
      case 'present':
        return '#DC2626';
      case 'may_contain':
        return '#D97706';
      case 'not_present':
        return '#047857';
      default:
        return '#6B7280';
    }
  };

  const hasAllergens = Object.values(product.allergens).some(
    status => status === 'present' || status === 'may_contain'
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.productImage} />
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.barcode}>Barcode: {product.barcode}</Text>
        </View>
      </View>

      <View style={[styles.alertSection, hasAllergens && styles.alertWarning]}>
        <View style={styles.alertHeader}>
          {hasAllergens ? (
            <AlertTriangle size={20} color="#DC2626" strokeWidth={2} />
          ) : (
            <CheckCircle size={20} color="#059669" strokeWidth={2} />
          )}
          <Text style={[styles.alertTitle, hasAllergens && styles.alertTitleWarning]}>
            {hasAllergens ? 'Allergen Warning' : 'Safe to Consume'}
          </Text>
        </View>
        <Text style={[styles.alertText, hasAllergens && styles.alertTextWarning]}>
          {hasAllergens
            ? 'This product contains or may contain allergens you should be aware of'
            : 'No known allergens detected in this product'}
        </Text>
      </View>

      <View style={styles.allergensSection}>
        <Text style={styles.sectionTitle}>Allergen Analysis</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.allergensList}>
          {Object.entries(product.allergens).map(([allergen, status]) => (
            <View
              key={allergen}
              style={[
                styles.allergenBadge,
                { backgroundColor: getAllergenColor(status) },
              ]}>
              {getAllergenIcon(status)}
              <Text
                style={[
                  styles.allergenText,
                  { color: getAllergenTextColor(status) },
                ]}>
                {allergen}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {product.ingredients && product.ingredients.length > 0 && (
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>
            {product.ingredients.join(', ')}
          </Text>
        </View>
      )}

      {product.nutritionGrade && (
        <View style={styles.nutritionSection}>
          <Text style={styles.sectionTitle}>Nutrition Grade</Text>
          <View style={styles.nutritionGrade}>
            <Text style={styles.gradeText}>{product.nutritionGrade.toUpperCase()}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  barcode: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  alertSection: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alertWarning: {
    backgroundColor: '#FEE2E2',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 8,
  },
  alertTitleWarning: {
    color: '#DC2626',
  },
  alertText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  alertTextWarning: {
    color: '#991B1B',
  },
  allergensSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  allergensList: {
    flexDirection: 'row',
  },
  allergenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  allergenText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  nutritionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nutritionGrade: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});