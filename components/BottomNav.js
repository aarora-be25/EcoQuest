/*import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

function TabIcon({ emoji, active }) {
  return (
    <Text style={{ fontSize: 20, opacity: active ? 1 : 0.4 }}>{emoji}</Text>
  );
}

export default function BottomNav({ active, navigation }) {
  const tabs = [
    { key: 'dashboard',   label: 'Home',  emoji: '🏠' },
    { key: 'tasksList',   label: 'Tasks', emoji: '📋' },
    { key: 'leaderboard', label: 'Ranks', emoji: '🏆' },
    { key: 'profile',     label: 'Me',    emoji: '👤' },
  ];

  return (
    <View style={styles.nav}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => navigation.navigate(tab.key)}
            activeOpacity={0.7}
          >
            <TabIcon emoji={tab.emoji} active={isActive} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  navLabelActive: {
    color: COLORS.primarySoft,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primaryDark,
    marginTop: 2,
  },
});
*/
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const TABS = [
  { key: 'dashboard', label: 'Home', icon: '🏠' },
  { key: 'tasksList', label: 'Tasks', icon: '📋' },
  { key: 'leaderboard', label: 'Ranks', icon: '🏆' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav({ active, navigation }) {
  const insets = useSafeAreaInsets();

  const handlePress = (key) => {
    if (!navigation) return;
    if (key !== active) {
      navigation.navigate(key);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TABS.map(tab => {
        const isActive = active === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handlePress(tab.key)}
            activeOpacity={0.8}
          >
            {isActive && <View style={styles.activeDot} />}

            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>

            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  activeDot: {
    position: 'absolute',
    top: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  icon: {
    fontSize: 18,
    color: COLORS.textMuted,
  },

  iconActive: {
    color: COLORS.primary,
  },

  label: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: FONTS.medium,
  },

  labelActive: {
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
});
