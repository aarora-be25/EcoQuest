import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { NOTIFICATIONS } from '../constants/data';
import BottomNav from '../components/BottomNav';

const DOT_COLORS = {
  success: COLORS.primary,
  warning: COLORS.accent,
  danger:  COLORS.danger,
  info:    '#378ADD',
};

export default function NotificationsScreen({ navigate }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const clearAll = () => setNotifs([]);

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAll} activeOpacity={0.7}>
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {notifs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 44 }}>🔔</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyDesc}>No new notifications right now.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {notifs.map((n, i) => (
              <TouchableOpacity
                key={n.id}
                style={[styles.row, i === notifs.length - 1 && { borderBottomWidth: 0 }]}
                activeOpacity={0.75}
                onPress={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
              >
                <View style={[styles.dot, { backgroundColor: DOT_COLORS[n.type] || COLORS.textMuted }]} />
                <View style={styles.content}>
                  <Text style={styles.notifText}>{n.text}</Text>
                  <Text style={styles.notifTime}>{n.time}</Text>
                </View>
                <Text style={styles.dismiss}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.hint}>Tap a notification to dismiss it.</Text>
        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>

      <BottomNav active="dashboard" navigate={navigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, padding: SPACING.base, paddingTop: SPACING.md,
  },
  headerTitle: { fontSize: 17, fontWeight: FONTS.heavy, color: COLORS.white },
  clearText: { fontSize: 13, fontWeight: FONTS.semibold, color: COLORS.primarySoft },

  body: { flex: 1, padding: SPACING.base },

  emptyState: {
    alignItems: 'center', paddingVertical: SPACING.xxl * 2,
    gap: SPACING.sm,
  },
  emptyTitle: { fontSize: 18, fontWeight: FONTS.heavy, color: COLORS.textPrimary },
  emptyDesc: { fontSize: 13, color: COLORS.textMuted },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md,
    padding: SPACING.base, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  content: { flex: 1 },
  notifText: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 20, fontWeight: FONTS.medium },
  notifTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },
  dismiss: { fontSize: 20, color: COLORS.textMuted, lineHeight: 22 },

  hint: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.md },
});
