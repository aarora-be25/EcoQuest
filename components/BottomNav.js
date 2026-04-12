import React from 'react';
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
    backgroundColor: COLORS.primarySoft,
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
    backgroundColor: COLORS.primaryDark,
    marginTop: 2,
  },
});
