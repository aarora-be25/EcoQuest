import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const TABS = [
  {
    key: 'dashboard',
    label: 'Home',
    icon: (active) => (
      <Svg active={active} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" filled />
    ),
  },
  {
    key: 'tasks',
    label: 'Tasks',
    icon: (active) => <GridIcon active={active} />,
  },
  {
    key: 'leaderboard',
    label: 'Ranks',
    icon: (active) => <RanksIcon active={active} />,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (active) => <ProfileIcon active={active} />,
  },
];

// Because React Native doesn't support SVG natively without a library,
// we use emoji + text icons as a lightweight substitute.
// Install react-native-svg if you want proper SVG icons.

function TabIcon({ emoji, active }) {
  return (
    <Text style={{ fontSize: 20, opacity: active ? 1 : 0.4 }}>{emoji}</Text>
  );
}

export default function BottomNav({ active, navigate }) {
  const tabs = [
    { key: 'dashboard',   label: 'Home',   emoji: '🏠' },
    { key: 'tasksList',   label: 'Tasks',  emoji: '📋' },
    { key: 'leaderboard', label: 'Ranks',  emoji: '🏆' },
    { key: 'profile',     label: 'Me',     emoji: '👤' },
  ];

  return (
    <View style={styles.nav}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => navigate(tab.key)}
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
    backgroundColor: COLORS.white,
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
    color: COLORS.primary,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});
