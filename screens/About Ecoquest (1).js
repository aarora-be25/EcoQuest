import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const AboutEcoQuest = ({ navigate, topics = [] }) => {
  const renderItem = (item, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {item.actionLabel && (
        <TouchableOpacity
          style={styles.button}
          onPress={item.onPress ? item.onPress : () => {}}
        >
          <Text style={styles.buttonText}>{item.actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>About EcoQuest</Text>
          <Text style={styles.subHeader}>
            Learn how to use EcoQuest, who built it, and how you can contribute.
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          {topics.map((item, index) => renderItem(item, index))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate('dashboard')}
        >
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutEcoQuest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
  },
  headerContainer: {
    padding: SPACING.base,
  },
  header: {
    fontSize: 24,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.base,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: FONTS.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 13,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: COLORS.primaryDark,
  },
  backButton: {
    margin: SPACING.base,
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONTS.semibold,
  },
});