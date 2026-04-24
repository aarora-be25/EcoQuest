import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import BottomNav from '../components/BottomNav';

import { useAuth } from '../context/AuthContext';
import {
  getIndividualLeaderboard,
  getDepartmentLeaderboard,
} from '../services/leaderboardService';

const RANK_COLORS = ['#EF9F27', '#9eafb8', '#c49060'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ navigation }) {
  const { profile } = useAuth();

  const [tab, setTab]         = useState('individual');
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // profile is now in deps — fixes the bug where department was undefined
  // when the effect first ran before profile loaded
  useEffect(() => {
    if (!profile) return; // wait for profile to load before fetching

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (tab === 'individual') {
          result = await getIndividualLeaderboard(50);
        } else {
          const dept = profile?.department?.trim();
          if (!dept) {
            setData([]);
            setLoading(false);
            return;
          }
          result = await getDepartmentLeaderboard(dept, 50);
        }
        setData(result);
      } catch (e) {
        console.log('Leaderboard error:', e.message);
        // Firestore composite index missing — fall back to client-side filter
        if (e.message?.includes('index') || e.message?.includes('requires an index')) {
          try {
            const all = await getIndividualLeaderboard(200);
            if (tab === 'department') {
              const dept = profile?.department?.trim().toLowerCase();
              const filtered = all
                .filter(p => p.department?.trim().toLowerCase() === dept)
                .map((p, i) => ({ ...p, rank: i + 1 }));
              setData(filtered);
            } else {
              setData(all);
            }
          } catch (e2) {
            setError('Could not load leaderboard.');
          }
        } else {
          setError('Could not load leaderboard.');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tab, profile]); // ← both tab AND profile here

  const top3   = data.slice(0, 3);
  const myRank = data.findIndex(p => p.uid === profile?.uid) + 1;
  const myPts  = profile?.points?.monthly ?? 0;

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Your rank banner */}
      <View style={styles.myRankBanner}>
        <Text style={styles.myRankLabel}>Your rank this month</Text>
        <Text style={styles.myRankNum}>#{myRank > 0 ? myRank : '—'}</Text>
        <Text style={styles.myRankPts}>{myPts} pts</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          ['individual', 'All Students'],
          ['department', profile?.department || 'My Branch'],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: COLORS.textMuted, fontSize: 13 }}>
            Loading leaderboard…
          </Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.danger, fontSize: 13 }}>{error}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Podium */}
          {top3.length >= 3 && (
            <View style={styles.podium}>
              {[top3[0], top3[1], top3[2]].map((p, i) => (
                <View
                  key={p.uid || i}
                  style={[
                    styles.podiumItem,
                    i === 1 && { marginTop: 30 },
                    i === 2 && { marginTop: 50 },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{RANK_LABELS[i]}</Text>
                  <View style={[styles.podiumAv, i === 0 && styles.podiumAvLarge, { backgroundColor: COLORS.primaryLight }]}>
                    <Text style={{ fontSize: i === 0 ? 16 : 13, fontWeight: FONTS.heavy, color: COLORS.primaryDark }}>
                      {p.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.podiumName}>{p.name?.split(' ')[0]}</Text>
                  <Text style={[styles.podiumPts, { color: RANK_COLORS[i] }]}>
                    {p.points?.monthly ?? 0} pts
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Full list */}
          <View style={styles.listCard}>
            {data.length === 0 ? (
              <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>
                  {tab === 'department'
                    ? `No students in ${profile?.department || 'your branch'} yet`
                    : 'No data yet'}
                </Text>
              </View>
            ) : (
              data.map((person, i) => {
                const isYou    = person.uid === profile?.uid;
                const initials = person.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <View
                    key={person.uid || i}
                    style={[
                      styles.row,
                      isYou && styles.rowYou,
                      i === data.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text style={[styles.rank, i < 3 && { color: RANK_COLORS[i] }]}>
                      #{i + 1}
                    </Text>
                    <View style={[styles.av, { backgroundColor: COLORS.primaryLight }]}>
                      <Text style={{ fontSize: 11, fontWeight: FONTS.heavy, color: COLORS.primaryDark }}>
                        {initials}
                      </Text>
                    </View>
                    <View style={styles.nameCol}>
                      <Text style={[styles.name, isYou && styles.nameYou]}>
                        {person.name}{isYou ? ' (you)' : ''}
                      </Text>
                      <Text style={styles.branch}>
                        {person.department} · {person.year}
                      </Text>
                    </View>
                    <Text style={[styles.pts, i < 3 && { color: RANK_COLORS[i] }]}>
                      {person.points?.monthly ?? 0} pts
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      <BottomNav active="leaderboard" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    padding: SPACING.base, paddingTop: SPACING.xxl + SPACING.md,
  },
  headerTitle: { fontSize: 17, fontWeight: FONTS.heavy, color: COLORS.white },

  myRankBanner: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, paddingHorizontal: SPACING.base, gap: SPACING.md,
  },
  myRankLabel: { fontSize: 12, color: COLORS.primarySoft, flex: 1 },
  myRankNum:   { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.accent },
  myRankPts:   { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.white },

  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    paddingTop: SPACING.sm, paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm, gap: SPACING.sm,
  },
  tab:           { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  tabActive:     { backgroundColor: COLORS.white },
  tabText:       { fontSize: 13, fontWeight: FONTS.bold, color: 'rgba(255,255,255,0.7)' },
  tabTextActive: { color: COLORS.primary },

  body: { flex: 1, padding: SPACING.base },

  podium:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: SPACING.xl, paddingVertical: SPACING.xl },
  podiumItem:    { alignItems: 'center', gap: SPACING.sm },
  podiumAv:      { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  podiumAvLarge: { width: 64, height: 64, borderRadius: 32 },
  podiumName:    { fontSize: 12, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  podiumPts:     { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primary },

  listCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  row:      { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowYou:   { backgroundColor: COLORS.primaryLight },
  rank:     { width: 24, fontSize: 12, fontWeight: FONTS.heavy, color: COLORS.textMuted },
  av:       { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nameCol:  { flex: 1 },
  name:     { fontSize: 13, color: COLORS.textPrimary, fontWeight: FONTS.medium },
  nameYou:  { fontWeight: FONTS.heavy, color: COLORS.primaryDark },
  branch:   { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  pts:      { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primary },
});