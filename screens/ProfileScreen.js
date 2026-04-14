import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { CURRENT_USER, TASKS } from '../constants/data';
import BottomNav from '../components/BottomNav';

const COMPLETED = TASKS.filter(t => t.done);
const TOTAL_PTS = COMPLETED.reduce((sum, t) => sum + t.pts, 0);

const ACHIEVEMENTS = [
  { icon: '🌱', label: 'First step',    desc: 'Completed your first task',  unlocked: true },
  { icon: '🔥', label: 'On a roll',     desc: 'Completed 3 tasks in a day', unlocked: true },
  { icon: '🏆', label: 'Top 3',         desc: 'Reached top 3 in branch',    unlocked: true },
  { icon: '🌳', label: 'Tree hugger',   desc: 'Planted 5 saplings',         unlocked: false },
  { icon: '⚡', label: 'Energy saver',  desc: 'Saved energy 10 days',       unlocked: false },
  { icon: '🥇', label: 'Eco champion',  desc: 'Rank #1 for a week',         unlocked: false },
];

export default function ProfileScreen({ navigation }) {

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'home' }],
          }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>

      // Header }
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        // Profile }
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{CURRENT_USER.initials}</Text>
          </View>

          <Text style={styles.profileName}>{CURRENT_USER.name}</Text>
          <Text style={styles.profileSub}>{CURRENT_USER.email}</Text>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{CURRENT_USER.branch}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{CURRENT_USER.year}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Roll No. {CURRENT_USER.rollNo}</Text>
            </View>
          </View>
        </View>

        // Stats }
        <View style={styles.statsRow}>
          {[
            [CURRENT_USER.pts, 'Total pts'],
            [`#${CURRENT_USER.rank}`, 'Branch rank'],
            [COMPLETED.length, 'Tasks done'],
          ].map(([val, lbl], i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        // Completed tasks }
        <Text style={styles.sectionLabel}>Completed tasks</Text>
        {COMPLETED.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 30 }}>🌱</Text>
            <Text style={styles.emptyText}>
              No completed tasks yet. Start your eco journey!
            </Text>
          </View>
        ) : (
          <View style={styles.completedCard}>
            {COMPLETED.map((t, i) => (
              <View
                key={t.id}
                style={[
                  styles.completedRow,
                  i === COMPLETED.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <Text style={{ fontSize: 18 }}>{t.icon}</Text>
                <Text style={styles.completedName}>{t.name}</Text>
                <Text style={styles.completedPts}>+{t.pts} pts</Text>
                <Text style={styles.completedCheck}>✓</Text>
              </View>
            ))}
          </View>
        )}

        // Achievements }
        <Text style={styles.sectionLabel}>Achievements</Text>
        <View style={styles.achieveGrid}>
          {ACHIEVEMENTS.map((a, i) => (
            <View
              key={i}
              style={[
                styles.achieveCard,
                !a.unlocked && styles.achieveLocked
              ]}
            >
              <Text style={{ fontSize: 28, opacity: a.unlocked ? 1 : 0.3 }}>
                {a.icon}
              </Text>

              <Text style={[
                styles.achieveLabel,
                !a.unlocked && styles.achieveTextLocked
              ]}>
                {a.label}
              </Text>

              <Text style={[
                styles.achieveDesc,
                !a.unlocked && styles.achieveTextLocked
              ]}>
                {a.desc}
              </Text>

              {!a.unlocked && (
                <Text style={styles.lockedBadge}>Locked</Text>
              )}
            </View>
          ))}
        </View>

        // Settings }
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.settingsCard}>
          {[
            { label: 'Edit profile', icon: '✏️' },
            { label: 'Change password', icon: '🔒' },
            {
              label: 'Notifications',
              icon: '🔔',
              onPress: () => navigation.navigate('notifications')
            },
            { label: 'About EcoQuest', icon: 'ℹ️' },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.settingsRow,
                i === arr.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={
                item.onPress ||
                (() => Alert.alert(item.label, 'Coming soon!'))
              }
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        // Logout }
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>

      // Bottom Nav }
      <BottomNav active="profile" navigation={navigation} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    paddingTop: SPACING.xxl,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: FONTS.heavy,
    color: COLORS.white
  },

  body: { flex: 1, padding: SPACING.base },

  profileCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: FONTS.heavy,
    color: COLORS.primaryDark
  },

  profileName: {
    fontSize: 20,
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary
  },

  profileSub: {
    fontSize: 13,
    color: COLORS.textMuted
  },

  tagRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  tag: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },

  tagText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.primaryDark
  },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md
  },

  statBox: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
  },

  statVal: {
    fontSize: 22,
    fontWeight: FONTS.heavy,
    color: COLORS.primary
  },

  statLbl: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    color: COLORS.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },

  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center'
  },

  completedCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },

  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  completedName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium
  },

  completedPts: {
    fontSize: 13,
    fontWeight: FONTS.heavy,
    color: COLORS.accent
  },

  completedCheck: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: FONTS.heavy
  },

  achieveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md
  },

  achieveCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: 4,
  },

  achieveLocked: {
    backgroundColor: COLORS.bgPage,
    borderColor: COLORS.border
  },

  achieveLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary,
    textAlign: 'center'
  },

  achieveDesc: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 13
  },

  achieveTextLocked: {
    color: COLORS.borderMid
  },

  lockedBadge: {
    fontSize: 9,
    fontWeight: FONTS.bold,
    color: COLORS.textMuted,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },

  settingsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  settingsLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium
  },

  settingsArrow: {
    fontSize: 20,
    color: COLORS.textMuted
  },

  logoutBtn: {
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    padding: SPACING.base,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.danger
  },
});
