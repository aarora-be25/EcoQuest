import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { TASKS } from '../constants/data';
import TaskCard from '../components/TaskCard';
import BottomNav from '../components/BottomNav';

const CATEGORIES = ['All', 'Waste', 'Transport', 'Energy', 'Water', 'Nature'];

export default function TasksListScreen({ navigate }) {
  const [tasks, setTasks]     = useState(TASKS);
  const [filter, setFilter]   = useState('All');

  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.category === filter);
  const doneCnt  = tasks.filter(t => t.done).length;

  const handlePress = (task) => {
    if (task.done || task.flagged) return;
    navigate('taskDetail', { task });
  };

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Text style={styles.headerSub}>{doneCnt} / {tasks.length} completed</Text>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, filter === cat && styles.chipActive]}
            onPress={() => setFilter(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, filter === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.countLabel}>{filtered.length} tasks</Text>
        {filtered.map(task => (
          <TaskCard key={task.id} task={task} onPress={handlePress} />
        ))}
        <View style={{ height: SPACING.xxl * 2 }} />
      </ScrollView>

      <BottomNav active="tasksList" navigate={navigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    backgroundColor: COLORS.primary, padding: SPACING.base, paddingBottom: SPACING.md, paddingTop: SPACING.xxl,
  },
  headerTitle: { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.white },
  headerSub: { fontSize: 13, color: COLORS.primarySoft, marginTop: 3 },

  filterScroll: { backgroundColor: COLORS.primary },
  filterRow: { paddingHorizontal: SPACING.base, paddingBottom: SPACING.md, gap: SPACING.sm },

  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  chipActive: { backgroundColor: COLORS.white },
  chipText: { fontSize: 13, fontWeight: FONTS.bold, color: 'rgba(255,255,255,0.8)' },
  chipTextActive: { color: COLORS.primary },

  body: { flex: 1, padding: SPACING.base },
  countLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.sm },
});
