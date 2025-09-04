import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, FlashlightOff as FlashOff, Slash as FlashOn, RotateCcw } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { ScanOverlay } from '@/components/ScanOverlay';
import { foodService } from '@/services/foodService';
import { Product } from '@/types/product';

const { width, height } = Dimensions.get('window');

export default function ScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const scanAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <Camera size={80} color="#2563EB" strokeWidth={1.5} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan barcodes and identify food allergens
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (hasScanned || isLoading) return;
    
    setHasScanned(true);
    setIsLoading(true);

    try {
      const product = await foodService.getProductByBarcode(data);
      setScannedProduct(product);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product information. Please try again.');
      console.error('Barcode scan error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setScannedProduct(null);
    setHasScanned(false);
    setIsLoading(false);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => !current);
  };

  if (scannedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.resultContainer}>
          <ProductCard product={scannedProduct} />
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetScan}>
            <Text style={styles.scanAgainText}>Scan Another Product</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Allergen Scanner</Text>
        <Text style={styles.headerSubtitle}>
          Point camera at barcode to scan
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'code128'],
          }}
        />
        
        <ScanOverlay />
        
        <Animated.View
          style={[
            styles.scanLine,
            {
              opacity: scanAnimation,
            },
          ]}
        />

        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}>
            {flash ? (
              <FlashOn size={24} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <FlashOff size={24} color="#FFFFFF" strokeWidth={2} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Scanning product...</Text>
          </View>
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Position the barcode within the frame to scan
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scanLine: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.15,
    right: width * 0.15,
    height: 2,
    backgroundColor: '#2563EB',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scanAgainButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});