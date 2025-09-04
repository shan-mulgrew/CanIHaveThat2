import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Shield, Info, ChevronRight, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  const allergens = [
    { name: 'Milk', enabled: true },
    { name: 'Eggs', enabled: true },
    { name: 'Peanuts', enabled: true },
    { name: 'Tree Nuts', enabled: true },
    { name: 'Soy', enabled: false },
    { name: 'Wheat', enabled: false },
    { name: 'Fish', enabled: false },
    { name: 'Shellfish', enabled: false },
  ];

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    rightContent,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightContent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightContent}
        {showChevron && onPress && (
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon={<Bell size={20} color="#2563EB" strokeWidth={2} />}
            title="Allergen Alerts"
            subtitle="Get notified about potential allergens"
            showChevron={false}
            rightContent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={notifications ? '#2563EB' : '#F3F4F6'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergen Detection</Text>
          <SettingItem
            icon={<Shield size={20} color="#10B981" strokeWidth={2} />}
            title="Strict Mode"
            subtitle="Show warnings for 'may contain' ingredients"
            showChevron={false}
            rightContent={
              <Switch
                value={strictMode}
                onValueChange={setStrictMode}
                trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
                thumbColor={strictMode ? '#10B981' : '#F3F4F6'}
              />
            }
          />

          <View style={styles.allergenList}>
            <Text style={styles.allergenTitle}>Track These Allergens:</Text>
            {allergens.map((allergen, index) => (
              <View key={index} style={styles.allergenItem}>
                <Text
                  style={[
                    styles.allergenName,
                    allergen.enabled && styles.allergenEnabled,
                  ]}>
                  {allergen.name}
                </Text>
                <Switch
                  value={allergen.enabled}
                  onValueChange={() => {}}
                  trackColor={{ false: '#D1D5DB', true: '#FEF3C7' }}
                  thumbColor={allergen.enabled ? '#F59E0B' : '#F3F4F6'}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon={<Info size={20} color="#6B7280" strokeWidth={2} />}
            title="App Information"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
          <SettingItem
            icon={<AlertTriangle size={20} color="#F59E0B" strokeWidth={2} />}
            title="Disclaimer"
            subtitle="Always verify allergen information"
            onPress={() => {}}
          />
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This app is for informational purposes only. Always check product
            labels and consult healthcare professionals for severe allergies.
            We are not responsible for any adverse reactions.
          </Text>
        </View>
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
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allergenList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  allergenTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  allergenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  allergenName: {
    fontSize: 16,
    color: '#6B7280',
  },
  allergenEnabled: {
    color: '#111827',
    fontWeight: '500',
  },
  disclaimer: {
    padding: 20,
    margin: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});