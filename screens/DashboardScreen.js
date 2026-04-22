import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { TASKS, BRANCH_LEADERBOARD } from '../constants/data';
import TaskCard from '../components/TaskCard';
import BottomNav from '../components/BottomNav';

// ── Firebase ──────────────────────────────────────────────────────────────────
import { useAuth } from '../context/AuthContext';
import { getUserRank } from '../services/leaderboardService';

export default function DashboardScreen({ navigation }) {
  const { profile } = useAuth();

  const [tasks, setTasks]   = useState(TASKS);
  const [rank, setRank]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch live rank from Firestore on mount
  useEffect(() => {
    const loadRank = async () => {
      try {
        if (profile?.uid) {
          const r = await getUserRank(profile.uid);
          setRank(r);
        }
      } catch (e) {
        console.log('Rank fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadRank();
  }, [profile]);

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
  const topThree = BRANCH_LEADERBOARD.slice(0, 3);

  // Initials from real name
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const handleTaskPress = (task) => {
    if (task.done || task.flagged) return;
    if (!task.live) {
      alert(`🔒 "${task.name}" is coming soon!`);
      return;
    }
    navigation.navigate('taskDetail', {
      task,
      onComplete: (taskId) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t));
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userRow}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              {/* Real name from Firebase */}
              <Text style={styles.userName}>{profile?.name || 'Student'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate('notifications')}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.rankPill}>
          <View>
            <Text style={styles.rankSub}>Current rank</Text>
            {/* Live rank from Firestore */}
            <Text style={styles.rankNum}>#{rank ?? '—'}</Text>
          </View>

          <View style={styles.dividerV} />

          <View>
            <Text style={styles.rankSub}>Points this month</Text>
            {/* Live monthly points from Firebase */}
            <Text style={styles.ptsNum}>{profile?.points?.monthly ?? 0} pts</Text>
          </View>

          <Text style={styles.branchTag}>
            {profile?.department || ''}{'\n'}{profile?.year || ''}
          </Text>
        </View>

        {/* Streak row */}
        {profile?.streak?.current > 0 && (
          <View style={styles.streakRow}>
            <Text style={styles.streakText}>
              🔥 {profile.streak.current} day streak — keep it going!
            </Text>
          </View>
        )}
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Stats */}
        <Text style={styles.sectionLabel}>Today's overview</Text>
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>{done}</Text>
            <Text style={styles.statSub}>Tasks completed</Text>
          </View>
          <View style={styles.statCard}>
            {/* All-time points from Firebase */}
            <Text style={[styles.statNum, { color: COLORS.accent }]}>
              {profile?.points?.allTime ?? 0}
            </Text>
            <Text style={styles.statSub}>All-time pts</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily progress</Text>
            <Text style={styles.progressCount}>
              {done} / {total} tasks · {pct}%
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
        </View>

        {/* Tasks */}
        <Text style={styles.sectionLabel}>Today's tasks</Text>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onPress={handleTaskPress} />
        ))}

        {/* Leaderboard preview — still mock, real data on leaderboard screen */}
        <Text style={styles.sectionLabel}>Top 3 this month</Text>
        <TouchableOpacity
          style={styles.lbCard}
          onPress={() => navigation.navigate('leaderboard')}
          activeOpacity={0.9}
        >
          {topThree.map((p, i) => (
            <View
              key={p.id}
              style={[styles.lbRow, p.you && styles.lbRowYou, i === 2 && { borderBottomWidth: 0 }]}
            >
              <Text style={[styles.lbRank, i === 0 && styles.lbGold]}>#{i + 1}</Text>
              <View style={[styles.lbAv, { backgroundColor: p.bg }]}>
                <Text style={{ fontSize: 10, fontWeight: FONTS.heavy, color: p.fg }}>
                  {p.initials}
                </Text>
              </View>
              <Text style={[styles.lbName, p.you && styles.lbNameYou]}>
                {p.name}{p.you ? ' (you)' : ''}
              </Text>
              <Text style={[styles.lbPts, i === 0 && { color: COLORS.accent }]}>
                {p.pts} pts
              </Text>
            </View>
          ))}
          <Text style={styles.lbSeeAll}>See full leaderboard →</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNav active="dashboard" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: { backgroundColor: COLORS.primary, padding: SPACING.base, paddingBottom: SPACING.lg },
  headerTop: {
    paddingTop: SPACING.lg, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md,
  },
  userRow:    { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar:     { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: FONTS.heavy, color: COLORS.primaryDark },
  greeting:   { fontSize: 11, color: COLORS.primarySoft },
  userName:   { fontSize: 16, fontWeight: FONTS.heavy, color: COLORS.white },
  notifBtn:   { position: 'relative', padding: SPACING.xs },
  notifDot:   { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, borderWidth: 2, borderColor: COLORS.primary },

  rankPill:  { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  rankSub:   { fontSize: 10, color: COLORS.primarySoft, marginBottom: 2 },
  rankNum:   { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.accent },
  ptsNum:    { fontSize: 18, fontWeight: FONTS.heavy, color: COLORS.accent },
  dividerV:  { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  branchTag: { marginLeft: 'auto', fontSize: 10, color: COLORS.primarySoft, textAlign: 'right', lineHeight: 16 },

  streakRow: { marginTop: SPACING.sm, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center' },
  streakText: { fontSize: 12, color: COLORS.white, fontWeight: FONTS.bold },

  body: { flex: 1, padding: SPACING.base },
  sectionLabel: { fontSize: 11, fontWeight: FONTS.heavy, color: COLORS.textMuted, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: SPACING.sm, marginTop: SPACING.base },

  statGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  statCard:  { flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md },
  statNum:   { fontSize: 30, fontWeight: FONTS.heavy, lineHeight: 36 },
  statSub:   { fontSize: 11, color: COLORS.textMuted, marginTop: 3 },

  progressCard:   { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  progressTitle:  { fontSize: 13, fontWeight: FONTS.bold, color: COLORS.primaryDark },
  progressCount:  { fontSize: 12, color: COLORS.textMuted },
  track:          { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.pill, height: 10, overflow: 'hidden' },
  fill:           { backgroundColor: COLORS.primary, height: '100%', borderRadius: RADIUS.pill },

  lbCard:    { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  lbRow:     { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  lbRowYou:  { backgroundColor: COLORS.primaryLight },
  lbRank:    { fontSize: 12, fontWeight: FONTS.heavy, color: COLORS.textMuted, width: 22 },
  lbGold:    { color: COLORS.accent },
  lbAv:      { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  lbName:    { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  lbNameYou: { fontWeight: FONTS.heavy, color: COLORS.primaryDark },
  lbPts:     { fontSize: 12, fontWeight: FONTS.heavy, color: COLORS.primary },
  lbSeeAll:  { textAlign: 'center', fontSize: 12, fontWeight: FONTS.bold, color: COLORS.primary, padding: SPACING.md },
});