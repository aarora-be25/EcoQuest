import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function TaskCard({ task, onPress }) {
  const isDone    = task.done;
  const isFlagged = task.flagged;

  const iconBg = isDone    ? COLORS.primaryLight
               : isFlagged ? COLORS.dangerLight
               :              COLORS.accentLight;

  const ptsColor = isDone    ? COLORS.accent
                 : isFlagged ? COLORS.danger
                 :              COLORS.borderMid;

  const ptsLabel = isDone    ? `+${task.pts}`
                 : isFlagged ? `-${task.pts}`
                 :              `+${task.pts}`;

  const metaText = isDone    ? 'Completed · photo verified'
                 : isFlagged ? 'Flagged — points deducted'
                 :              task.meta || 'Tap to complete';

  return (
    <TouchableOpacity
      style={[styles.card, isDone && styles.cardDone, isFlagged && styles.cardFlagged]}
      onPress={() => onPress && onPress(task)}
      activeOpacity={0.75}
    >
      {/* Icon */}
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{task.icon}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{task.name}</Text>
        <Text style={styles.meta}>{metaText}</Text>
      </View>

      {/* Points */}
      <Text style={[styles.pts, { color: ptsColor }]}>{ptsLabel}</Text>

      {/* Status indicator */}
      {isDone ? (
        <View style={styles.checkDone}>
          <Text style={{ color: COLORS.white, fontSize: 11, fontWeight: FONTS.bold }}>✓</Text>
        </View>
      ) : isFlagged ? (
        <View style={styles.checkFlagged}>
          <Text style={{ color: COLORS.danger, fontSize: 11 }}>!</Text>
        </View>
      ) : (
        <View style={styles.checkPending} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardDone: {
    backgroundColor: '#fafffe',
    borderColor: '#c5e8d8',
  },
  cardFlagged: {
    backgroundColor: '#fff9f7',
    borderColor: '#f0c0a0',
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  pts: {
    fontSize: 14,
    fontWeight: FONTS.heavy,
    flexShrink: 0,
  },
  checkDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkFlagged: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.dangerLight,
    borderWidth: 2,
    borderColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkPending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: COLORS.borderMid,
    flexShrink: 0,
  },
});
