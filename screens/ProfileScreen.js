import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import BottomNav from '../components/BottomNav';

import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

// ── Achievements — computed from real profile data ────────────────────────────
const computeAchievements = (profile) => {
  const allTime     = profile?.points?.allTime   ?? 0;
  const streak      = profile?.streak?.current   ?? 0;
  const longestStreak = profile?.streak?.longest ?? 0;

  return [
    {
      icon: '🌱',
      label: 'First step',
      desc: 'Earn your first point',
      unlocked: allTime >= 1,
    },
    {
      icon: '🔥',
      label: 'On a roll',
      desc: '3-day streak',
      unlocked: longestStreak >= 3,
    },
    {
      icon: '🏆',
      label: 'Point chaser',
      desc: 'Earn 50+ points',
      unlocked: allTime >= 50,
    },
    {
      icon: '🌳',
      label: 'Tree hugger',
      desc: 'Earn 100+ points',
      unlocked: allTime >= 100,
    },
    {
      icon: '⚡',
      label: 'Energy saver',
      desc: '7-day streak',
      unlocked: longestStreak >= 7,
    },
    {
      icon: '🥇',
      label: 'Eco champion',
      desc: 'Earn 500+ points',
      unlocked: allTime >= 500,
    },
  ];
};

export default function ProfileScreen({ navigation }) {
  const { profile } = useAuth();

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const achievements = computeAchievements(profile);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try { await logoutUser(); } catch (e) { console.log(e); }
          navigation.reset({ index: 0, routes: [{ name: 'home' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{profile?.name || 'Student'}</Text>
          <Text style={styles.profileSub}>{profile?.email || ''}</Text>

          {/* Info tags */}
          <View style={styles.tagRow}>
            {profile?.department ? (
              <View style={styles.tag}><Text style={styles.tagText}>{profile.department}</Text></View>
            ) : null}
            {profile?.year ? (
              <View style={styles.tag}><Text style={styles.tagText}>{profile.year}</Text></View>
            ) : null}
            {profile?.rollNo ? (
              <View style={styles.tag}><Text style={styles.tagText}>Roll No. {profile.rollNo}</Text></View>
            ) : null}
          </View>

          {/* Extra info box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoRow}>📧  {profile?.email || '—'}</Text>
            <Text style={styles.infoRow}>🏫  {profile?.department || '—'}  ·  {profile?.year || '—'}</Text>
            <Text style={styles.infoRow}>🪪  Roll No. {profile?.rollNo || '—'}</Text>
            <Text style={styles.infoRow}>🔥  Longest streak: {profile?.streak?.longest ?? 0} days</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            [profile?.points?.allTime  ?? 0, 'Total pts'],
            [profile?.points?.monthly  ?? 0, 'Monthly pts'],
            [profile?.streak?.current  ?? 0, '🔥 Streak'],
          ].map(([val, lbl], i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <Text style={styles.sectionLabel}>Achievements</Text>
        <View style={styles.achieveGrid}>
          {achievements.map((a, i) => (
            <View key={i} style={[styles.achieveCard, !a.unlocked && styles.achieveLocked]}>
              <Text style={{ fontSize: 28, opacity: a.unlocked ? 1 : 0.25 }}>{a.icon}</Text>
              <Text style={[styles.achieveLabel, !a.unlocked && styles.achieveTextLocked]}>
                {a.label}
              </Text>
              <Text style={[styles.achieveDesc, !a.unlocked && styles.achieveTextLocked]}>
                {a.desc}
              </Text>
              {!a.unlocked && <Text style={styles.lockedBadge}>Locked</Text>}
            </View>
          ))}
        </View>

        {/* Account settings */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.settingsCard}>
          {[
            { label: 'Edit profile',     icon: '👤', onPress: () => navigation.navigate('editProfile') },
            { label: 'Notifications',    icon: '🔔', onPress: () => navigation.navigate('notifications') },
            { label: 'Change password',  icon: '🔒', onPress: () => navigation.navigate('changePassword') },
            { label: 'About EcoQuest',   icon: 'ℹ️', onPress: () => navigation.navigate('about') },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={i}
              style={[styles.settingsRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNav active="profile" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, padding: SPACING.base, paddingTop: SPACING.xxl,
  },
  headerTitle: { fontSize: 17, fontWeight: FONTS.heavy, color: COLORS.white },

  body: { flex: 1, padding: SPACING.base },

  profileCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md,
  },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText:  { fontSize: 24, fontWeight: FONTS.heavy, color: COLORS.primaryDark },
  profileName: { fontSize: 20, fontWeight: FONTS.heavy, color: COLORS.textPrimary },
  profileSub:  { fontSize: 13, color: COLORS.textMuted },
  tagRow:      { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, flexWrap: 'wrap', justifyContent: 'center' },
  tag:         { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  tagText:     { fontSize: 11, fontWeight: FONTS.bold, color: COLORS.primaryDark },

  infoBox: {
    width: '100%', backgroundColor: COLORS.bgPage,
    borderRadius: RADIUS.md, padding: SPACING.md,
    marginTop: SPACING.sm, gap: SPACING.xs,
  },
  infoRow: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 20 },

  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  statBox:  { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, alignItems: 'center' },
  statVal:  { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.primary },
  statLbl:  { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },

  sectionLabel: {
    fontSize: 11, fontWeight: FONTS.heavy, color: COLORS.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: SPACING.sm, marginTop: SPACING.md,
  },

  achieveGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  achieveCard: {
    width: '30%', flexGrow: 1, backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.sm, alignItems: 'center', gap: 4,
  },
  achieveLocked:     { backgroundColor: COLORS.bgPage },
  achieveLabel:      { fontSize: 11, fontWeight: FONTS.heavy, color: COLORS.textPrimary, textAlign: 'center' },
  achieveDesc:       { fontSize: 9, color: COLORS.textMuted, textAlign: 'center', lineHeight: 13 },
  achieveTextLocked: { color: COLORS.borderMid },
  lockedBadge: {
    fontSize: 9, fontWeight: FONTS.bold, color: COLORS.textMuted,
    backgroundColor: COLORS.border, borderRadius: RADIUS.pill,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 2,
  },

  settingsCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md,
  },
  settingsRow:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingsLabel: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: FONTS.medium },
  settingsArrow: { fontSize: 20, color: COLORS.textMuted },

  logoutBtn:  { borderRadius: RADIUS.pill, borderWidth: 1.5, borderColor: COLORS.danger, padding: SPACING.base, alignItems: 'center', marginTop: SPACING.sm },
  logoutText: { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.danger },
});