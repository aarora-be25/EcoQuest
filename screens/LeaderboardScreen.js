/*import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { BRANCH_LEADERBOARD, YEAR_LEADERBOARD, CURRENT_USER } from '../constants/data';
import BottomNav from '../components/BottomNav';

const RANK_COLORS = ['#EF9F27', '#9eafb8', '#c49060'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ navigate }) {
  const [tab, setTab] = useState('branch');
  const data = tab === 'branch' ? BRANCH_LEADERBOARD : YEAR_LEADERBOARD;

  const top3   = data.slice(0, 3);
  const rest   = data.slice(3);
  const myRank = data.findIndex(p => p.you) + 1;

  return (
    <SafeAreaView style={styles.safe}>

      {// Header }
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {// Your rank banner }
      <View style={styles.myRankBanner}>
        <Text style={styles.myRankLabel}>Your rank</Text>
        <Text style={styles.myRankNum}>#{myRank}</Text>
        <Text style={styles.myRankPts}>{CURRENT_USER.pts} pts</Text>
      </View>

      {// Tabs }
      <View style={styles.tabRow}>
        {[['branch', 'By branch'], ['year', 'By year']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, tab === key && styles.tabActive]}
            onPress={() => setTab(key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {// Podium top 3 }
        <View style={styles.podium}>
          {// 2nd — left }
          <View style={[styles.podiumItem, { marginTop: 30 }]}>
            <Text style={{ fontSize: 24 }}>{RANK_LABELS[1]}</Text>
            <View style={[styles.podiumAv, { backgroundColor: top3[1]?.bg || COLORS.primaryLight }]}>
              <Text style={{ fontSize: 13, fontWeight: FONTS.heavy, color: top3[1]?.fg || COLORS.primaryDark }}>
                {top3[1]?.initials}
              </Text>
            </View>
            <Text style={styles.podiumName}>{top3[1]?.name?.split(' ')[0]}</Text>
            <Text style={[styles.podiumPts, { color: RANK_COLORS[1] }]}>{top3[1]?.pts}</Text>
          </View>

          {// 1st — center, taller }
          <View style={styles.podiumItem}>
            <Text style={{ fontSize: 28 }}>{RANK_LABELS[0]}</Text>
            <View style={[styles.podiumAv, styles.podiumAvLarge, { backgroundColor: top3[0]?.bg || COLORS.primaryLight }]}>
              <Text style={{ fontSize: 16, fontWeight: FONTS.heavy, color: top3[0]?.fg || COLORS.primaryDark }}>
                {top3[0]?.initials}
              </Text>
            </View>
            <Text style={styles.podiumName}>{top3[0]?.name?.split(' ')[0]}</Text>
            <Text style={[styles.podiumPts, { color: RANK_COLORS[0], fontSize: 16 }]}>{top3[0]?.pts}</Text>
          </View>

          {// 3rd — right }
          <View style={[styles.podiumItem, { marginTop: 50 }]}>
            <Text style={{ fontSize: 20 }}>{RANK_LABELS[2]}</Text>
            <View style={[styles.podiumAv, { backgroundColor: top3[2]?.bg || COLORS.primaryLight }]}>
              <Text style={{ fontSize: 13, fontWeight: FONTS.heavy, color: top3[2]?.fg || COLORS.primaryDark }}>
                {top3[2]?.initials}
              </Text>
            </View>
            <Text style={styles.podiumName}>{top3[2]?.name?.split(' ')[0]}</Text>
            <Text style={[styles.podiumPts, { color: RANK_COLORS[2] }]}>{top3[2]?.pts}</Text>
          </View>
        </View>

        {// Full list }
        <View style={styles.listCard}>
          {data.map((person, i) => (
            <View
              key={person.id}
              style={[
                styles.row,
                person.you && styles.rowYou,
                i === data.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.rank, i < 3 && { color: RANK_COLORS[i] }]}>
                #{i + 1}
              </Text>
              <View style={[styles.av, { backgroundColor: person.bg }]}>
                <Text style={{ fontSize: 11, fontWeight: FONTS.heavy, color: person.fg }}>
                  {person.initials}
                </Text>
              </View>
              <View style={styles.nameCol}>
                <Text style={[styles.name, person.you && styles.nameYou]}>
                  {person.name}{person.you ? ' (you)' : ''}
                </Text>
                {person.branch && (
                  <Text style={styles.branch}>{person.branch}</Text>
                )}
              </View>
              <Text style={[styles.pts, i < 3 && { color: RANK_COLORS[i] }]}>
                {person.pts} pts
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <BottomNav active="leaderboard" navigate={navigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    paddingTop: SPACING.xxl + SPACING.md,
  },
  headerTitle: { fontSize: 17, fontWeight: FONTS.heavy, color: COLORS.white },

  myRankBanner: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, paddingHorizontal: SPACING.base, gap: SPACING.md,
  },
  myRankLabel: { fontSize: 12, color: COLORS.primarySoft, flex: 1 },
  myRankNum: { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.accent },
  myRankPts: { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.white },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabActive: { backgroundColor: COLORS.white },
  tabText: { fontSize: 13, fontWeight: FONTS.bold, color: 'rgba(255,255,255,0.7)' },
  tabTextActive: { color: COLORS.primary },

  body: { flex: 1, padding: SPACING.base },

  podium: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'flex-end', gap: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  podiumItem: { alignItems: 'center', gap: SPACING.sm },
  podiumAv: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  podiumAvLarge: { width: 64, height: 64, borderRadius: 32 },
  podiumName: { fontSize: 12, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  podiumPts: { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primary },

  listCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowYou: { backgroundColor: COLORS.primaryLight },
  rank: { width: 24, fontSize: 12, fontWeight: FONTS.heavy, color: COLORS.textMuted },
  av: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nameCol: { flex: 1 },
  name: { fontSize: 13, color: COLORS.textPrimary, fontWeight: FONTS.medium },
  nameYou: { fontWeight: FONTS.heavy, color: COLORS.primaryDark },
  branch: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  pts: { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primary },
});
*/

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { BRANCH_LEADERBOARD, YEAR_LEADERBOARD, CURRENT_USER } from '../constants/data';
import BottomNav from '../components/BottomNav';

const RANK_COLORS = ['#EF9F27', '#9eafb8', '#c49060'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ navigation }) {
  const [tab, setTab] = useState('branch');
  const data = tab === 'branch' ? BRANCH_LEADERBOARD : YEAR_LEADERBOARD;

  const top3   = data.slice(0, 3);
  const myRank = data.findIndex(p => p.you) + 1;

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Your rank */}
      <View style={styles.myRankBanner}>
        <Text style={styles.myRankLabel}>Your rank</Text>
        <Text style={styles.myRankNum}>#{myRank}</Text>
        <Text style={styles.myRankPts}>{CURRENT_USER.pts} pts</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[['branch', 'Yearwise'], ['year', 'Branchwise']].map(([key, label]) => (
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

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Podium */}
        <View style={styles.podium}>
          {top3.map((p, i) => (
            <View
              key={p?.id || i}
              style={[
                styles.podiumItem,
                i === 1 && { marginTop: 30 },
                i === 2 && { marginTop: 50 }
              ]}
            >
              <Text style={{ fontSize: 24 }}>{RANK_LABELS[i]}</Text>

              <View style={[
                styles.podiumAv,
                i === 0 && styles.podiumAvLarge,
                { backgroundColor: p?.bg || COLORS.primaryLight }
              ]}>
                <Text style={{
                  fontSize: i === 0 ? 16 : 13,
                  fontWeight: FONTS.heavy,
                  color: p?.fg || COLORS.primaryDark
                }}>
                  {p?.initials}
                </Text>
              </View>

              <Text style={styles.podiumName}>
                {p?.name?.split(' ')[0]}
              </Text>

              <Text style={[
                styles.podiumPts,
                { color: RANK_COLORS[i] }
              ]}>
                {p?.pts}
              </Text>
            </View>
          ))}
        </View>

        {/* Full list */}
        <View style={styles.listCard}>
          {data.map((person, i) => (
            <View
              key={person.id}
              style={[
                styles.row,
                person.you && styles.rowYou,
                i === data.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.rank, i < 3 && { color: RANK_COLORS[i] }]}>
                #{i + 1}
              </Text>

              <View style={[styles.av, { backgroundColor: person.bg }]}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: FONTS.heavy,
                  color: person.fg
                }}>
                  {person.initials}
                </Text>
              </View>

              <View style={styles.nameCol}>
                <Text style={[styles.name, person.you && styles.nameYou]}>
                  {person.name}{person.you ? ' (you)' : ''}
                </Text>

                {person.branch && (
                  <Text style={styles.branch}>{person.branch}</Text>
                )}

                {person.year && (
                  <Text style={styles.branch}>{person.year}</Text>
                )}
              </View>

              <Text style={[styles.pts, i < 3 && { color: RANK_COLORS[i] }]}>
                {person.pts} pts
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav active="leaderboard" navigation={navigation} />

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    paddingTop: SPACING.xxl + SPACING.md,
  },
  headerTitle: { fontSize: 17, fontWeight: FONTS.heavy, color: COLORS.white },

  myRankBanner: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, paddingHorizontal: SPACING.base, gap: SPACING.md,
  },
  myRankLabel: { fontSize: 12, color: COLORS.primarySoft, flex: 1 },
  myRankNum: { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.accent },
  myRankPts: { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.white },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabActive: { backgroundColor: COLORS.white },
  tabText: { fontSize: 13, fontWeight: FONTS.bold, color: 'rgba(255,255,255,0.7)' },
  tabTextActive: { color: COLORS.primary },

  body: { flex: 1, padding: SPACING.base },

  podium: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'flex-end', gap: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  podiumItem: { alignItems: 'center', gap: SPACING.sm },
  podiumAv: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  podiumAvLarge: { width: 64, height: 64, borderRadius: 32 },
  podiumName: { fontSize: 12, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  podiumPts: { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primary },

  listCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowYou: { backgroundColor: COLORS.primaryLight },
  rank: { width: 24, fontSize: 12, fontWeight: FONTS.heavy, color: COLORS.textMuted },
  av: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nameCol: { flex: 1 },
  name: { fontSize: 13, color: COLORS.textPrimary, fontWeight: FONTS.medium },
  nameYou: { fontWeight: FONTS.heavy, color: COLORS.primaryDark },
  branch: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  pts: { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primary },
});
