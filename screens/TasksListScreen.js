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

export default function TasksListScreen({ navigation }) {
  const [tasks, setTasks]   = useState(TASKS);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? tasks
    : tasks.filter(t => t.category === filter);

  const doneCnt = tasks.filter(t => t.done).length;

  const handlePress = (task) => {
    if (task.done || task.flagged) return;

    navigation.navigate('taskDetail', {
      task,
      onComplete: (taskId) => {
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId ? { ...t, done: true } : t
          )
        );
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // 👈 THIS MAKES FILTER STICK
      >

        // Header }
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSub}>
            {doneCnt} / {tasks.length} completed
          </Text>
        </View>

        // Sticky Filter }
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  filter === cat && styles.chipActive
                ]}
                onPress={() => setFilter(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    filter === cat && styles.chipTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        // Tasks }
        <View style={styles.body}>
          <Text style={styles.countLabel}>
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}
          </Text>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 40 }}>🌱</Text>
              <Text style={styles.emptyTitle}>No tasks here</Text>
              <Text style={styles.emptyDesc}>
                Try switching category or check back later.
              </Text>
            </View>
          ) : (
            filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={handlePress}
              />
            ))
          )}

          <View style={{ height: SPACING.xxl * 2 }} />
        </View>

      </ScrollView>

      <BottomNav active="tasksList" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: FONTS.heavy,
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.primarySoft,
    marginTop: 3,
  },

  // 👇 IMPORTANT: wrapper needed for sticky bg
  filterWrapper: {
    backgroundColor: COLORS.primary,
  },

  filterRow: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },

  /*
  chip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  chipActive: { backgroundColor: COLORS.white },
  chipText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: 'rgba(255,255,255,0.8)',
  },
  chipTextActive: { color: COLORS.primary },
*/
  chip: {
  paddingHorizontal: SPACING.sm,
  paddingVertical: 6,
  borderRadius: RADIUS.pill,
  backgroundColor: COLORS.primaryLight,
},

chipActive: {
  backgroundColor: COLORS.white,
  borderWidth: 1,
  borderColor: COLORS.primary,
},

chipText: {
  fontSize: 12,
  fontWeight: FONTS.bold,
  color: COLORS.primaryDark,
},

chipTextActive: {
  color: COLORS.primary,
},
  
  body: {
    padding: SPACING.base,
  },

  countLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
