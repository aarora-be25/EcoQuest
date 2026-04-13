/*
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { CURRENT_USER, TASKS, BRANCH_LEADERBOARD } from '../constants/data';
import TaskCard from '../components/TaskCard';
import BottomNav from '../components/BottomNav';

export default function DashboardScreen({ navigation }) {
  const [tasks, setTasks] = useState(TASKS);
  const [pts, setPts]     = useState(CURRENT_USER.pts);

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  const topThree = BRANCH_LEADERBOARD.slice(0, 3);

  const handleTaskPress = (task) => {
    if (task.done || task.flagged) return;

    // Safer: no function passing
    navigation.navigate('taskDetail', { task });
  };

  // (Keep this if you later wire completion via global state or params)
  const handleComplete = (taskId, ptsEarned) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t));
    setPts(prev => prev + ptsEarned);
  };

  return (
    <SafeAreaView style={styles.safe}>

      // Header }
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userRow}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarText}>{CURRENT_USER.initials}</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{CURRENT_USER.name}</Text>
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
            <Text style={styles.rankNum}>#{CURRENT_USER.rank}</Text>
          </View>

          <View style={styles.dividerV} />

          <View>
            <Text style={styles.rankSub}>Total points</Text>
            <Text style={styles.ptsNum}>{pts} pts</Text>
          </View>

          <Text style={styles.branchTag}>
            {CURRENT_USER.branch}{'\n'}{CURRENT_USER.year}
          </Text>
        </View>
      </View>

      // Body }
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >

        // Stats }
        <Text style={styles.sectionLabel}>Today's overview</Text>
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>{done}</Text>
            <Text style={styles.statSub}>Tasks completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.accent }]}>
              {total - done}
            </Text>
            <Text style={styles.statSub}>Tasks remaining</Text>
          </View>
        </View>

        // Progress }
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

        // Tasks }
        <Text style={styles.sectionLabel}>Today's tasks</Text>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onPress={handleTaskPress} />
        ))}

        // Leaderboard }
        <Text style={styles.sectionLabel}>Top 3 this week</Text>
        <TouchableOpacity
          style={styles.lbCard}
          onPress={() => navigation.navigate('leaderboard')}
          activeOpacity={0.9}
        >
          {topThree.map((p, i) => (
            <View
              key={p.id}
              style={[
                styles.lbRow,
                p.you && styles.lbRowYou,
                i === 2 && { borderBottomWidth: 0 }
              ]}
            >
              <Text style={[styles.lbRank, i === 0 && styles.lbGold]}>
                #{i + 1}
              </Text>

              <View style={[styles.lbAv, { backgroundColor: p.bg }]}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: FONTS.heavy,
                  color: p.fg
                }}>
                  {p.initials}
                </Text>
              </View>

              <Text style={[
                styles.lbName,
                p.you && styles.lbNameYou
              ]}>
                {p.name}{p.you ? ' (you)' : ''}
              </Text>

              <Text style={[
                styles.lbPts,
                i === 0 && { color: COLORS.accent }
              ]}>
                {p.pts} pts
              </Text>
            </View>
          ))}

          <Text style={styles.lbSeeAll}>
            See full leaderboard →
          </Text>
        </TouchableOpacity>

      </ScrollView>

      // Bottom Navigation }
      <BottomNav active="dashboard" navigation={navigation} />

    </SafeAreaView>
  );
}

*/ 
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { TASKS, BRANCH_LEADERBOARD } from '../constants/data';
import TaskCard from '../components/TaskCard';
import BottomNav from '../components/BottomNav';

export default function DashboardScreen({ navigation, route }) {

  const user = route.params?.user;

  if (!user) return null;

  const [tasks, setTasks] = useState(TASKS);
  const [pts, setPts]     = useState(user.pts || 0);

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  const topThree = BRANCH_LEADERBOARD.slice(0, 3);

  const handleTaskPress = (task) => {
    if (task.done || task.flagged) return;
    navigation.navigate('taskDetail', { task });
  };

  return (
    <SafeAreaView style={styles.safe}>

      // Header 
      <View style={styles.header}>
        <View style={styles.headerTop}>

          <View style={styles.userRow}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('profile', { user })}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarText}>
                {user.initials || user.name?.slice(0,2).toUpperCase()}
              </Text>
            </TouchableOpacity>

            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{user.name}</Text>
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
            <Text style={styles.rankNum}>#{user.rank || 0}</Text>
          </View>

          <View style={styles.dividerV} />

          <View>
            <Text style={styles.rankSub}>Total points</Text>
            <Text style={styles.ptsNum}>{pts} pts</Text>
          </View>

          <Text style={styles.branchTag}>
            {user.branch}{'\n'}{user.year || ''}
          </Text>
        </View>
      </View>

      // Body
      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >

        // Stats
        <Text style={styles.sectionLabel}>Today's overview</Text>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.primary }]}>{done}</Text>
            <Text style={styles.statSub}>Tasks completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORS.accent }]}>
              {total - done}
            </Text>
            <Text style={styles.statSub}>Tasks remaining</Text>
          </View>
        </View>

        // Progress 
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

        // Tasks }
        <Text style={styles.sectionLabel}>Today's tasks</Text>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onPress={handleTaskPress} />
        ))}

        // Leaderboard }
        <Text style={styles.sectionLabel}>Top 3 this week</Text>

        <TouchableOpacity
          style={styles.lbCard}
          onPress={() => navigation.navigate('leaderboard')}
          activeOpacity={0.9}
        >
          {topThree.map((p, i) => (
            <View
              key={p.id}
              style={[
                styles.lbRow,
                p.you && styles.lbRowYou,
                i === 2 && { borderBottomWidth: 0 }
              ]}
            >
              <Text style={[styles.lbRank, i === 0 && styles.lbGold]}>
                #{i + 1}
              </Text>

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

  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    paddingBottom: SPACING.lg
  },

  headerTop: {
    paddingTop: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },

  userRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },

  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },

  avatarText: {
    fontSize: 14,
    fontWeight: FONTS.heavy,
    color: COLORS.primaryDark
  },

  greeting: { fontSize: 11, color: COLORS.primarySoft },

  userName: {
    fontSize: 16,
    fontWeight: FONTS.heavy,
    color: COLORS.white
  },

  notifBtn: { position: 'relative', padding: SPACING.xs },

  notifDot: {
    position: 'absolute',
    top: 4, right: 4,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  rankPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  rankSub: {
    fontSize: 10,
    color: COLORS.primarySoft,
    marginBottom: 2
  },

  rankNum: {
    fontSize: 22,
    fontWeight: FONTS.heavy,
    color: COLORS.accent
  },

  ptsNum: {
    fontSize: 18,
    fontWeight: FONTS.heavy,
    color: COLORS.accent
  },

  dividerV: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },

  branchTag: {
    marginLeft: 'auto',
    fontSize: 10,
    color: COLORS.primarySoft,
    textAlign: 'right',
    lineHeight: 16
  },

  body: { flex: 1, padding: SPACING.base },

  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    color: COLORS.textMuted,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    marginTop: SPACING.base,
  },

  statGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },

  statNum: {
    fontSize: 30,
    fontWeight: FONTS.heavy,
    lineHeight: 36
  },

  statSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3
  },

  progressCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },

  progressTitle: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.primaryDark
  },

  progressCount: {
    fontSize: 12,
    color: COLORS.textMuted
  },

  track: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.pill,
    height: 10,
    overflow: 'hidden'
  },

  fill: {
    backgroundColor: COLORS.primary,
    height: '100%',
    borderRadius: RADIUS.pill
  },

  lbCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  lbRowYou: { backgroundColor: COLORS.primaryLight },

  lbRank: {
    fontSize: 12,
    fontWeight: FONTS.heavy,
    color: COLORS.textMuted,
    width: 22
  },

  lbGold: { color: COLORS.accent },

  lbAv: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },

  lbName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary
  },

  lbNameYou: {
    fontWeight: FONTS.heavy,
    color: COLORS.primaryDark
  },

  lbPts: {
    fontSize: 12,
    fontWeight: FONTS.heavy,
    color: COLORS.primary
  },

  lbSeeAll: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    padding: SPACING.md,
  },
});
