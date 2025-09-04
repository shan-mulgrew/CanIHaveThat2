import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export function ScanOverlay() {
  return (
    <View style={styles.overlay}>
      <View style={styles.scanFrame}>
        <View style={styles.corner} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7 * 0.6, // Rectangular frame for barcode
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#2563EB',
    borderWidth: 3,
    borderTopLeftRadius: 8,
    top: -2,
    left: -2,
  },
  topRight: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    top: -2,
    right: -2,
    left: 'auto',
  },
  bottomLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
    borderTopWidth: 0,
    borderRightWidth: 0,
    bottom: -2,
    left: -2,
    top: 'auto',
  },
  bottomRight: {
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 8,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
  },
});