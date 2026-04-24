import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logoImage}
            />
          </View>

          <Text style={styles.appName}>EcoQuest</Text>
          <Text style={styles.tagline}>Earn points. Save the planet.</Text>

          <Text style={styles.subtitle}>
            A sustainability gamification app where students log eco-friendly actions,
            earn points, and compete through leaderboards.
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>App Introduction</Text>
          <Text style={styles.text}>
            EcoQuest is a sustainability-focused mobile app that encourages students to adopt eco-friendly habits through daily challenges. Users can log actions like waste segregation, energy saving, cycling, and planting to earn points.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mission</Text>
          <Text style={styles.text}>
            To promote environmental awareness and build sustainable habits among students by making climate action engaging, competitive, and rewarding.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How it works</Text>

          <View style={styles.card}>
            <Text style={styles.cardText}>• Complete eco-friendly tasks daily</Text>
            <Text style={styles.cardText}>• Upload photo proof for verification</Text>
            <Text style={styles.cardText}>• Earn points for genuine actions</Text>
            <Text style={styles.cardText}>• Lose points for cheating or fake submissions</Text>
            <Text style={styles.cardText}>• Compete on leaderboards across branches and years</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Key Features</Text>

          <View style={styles.card}>
            <Text style={styles.cardText}>• Daily eco challenges</Text>
            <Text style={styles.cardText}>• Photo-based verification system</Text>
            <Text style={styles.cardText}>• Leaderboards and rankings</Text>
            <Text style={styles.cardText}>• Points-based reward system</Text>
            <Text style={styles.cardText}>• Task-wise screens with detailed instructions</Text>
            <Text style={styles.cardText}>• Dashboard with profile, points, and progress</Text>
          </View>
        </View>

        {/* Target Audience */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Target Audience</Text>
          <Text style={styles.text}>
            Primarily designed for college students, especially first-year students at TIET, but adaptable for any student community.
          </Text>
        </View>

        {/* Vision */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Vision</Text>
          <Text style={styles.text}>
            To create a community of environmentally responsible individuals and make sustainability a lifestyle rather than a one-time effort.
          </Text>
        </View>

        {/* Development */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Development Note</Text>
          <Text style={styles.text}>
            EcoQuest is currently under development by first-year students and will evolve continuously based on user feedback and real-world usage.
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('profile')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          TIET, Patiala · UEN008 · 2026
        </Text>

        <Text style={styles.closing}>
          “Small actions, when multiplied by many, can change the world.”
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1 },

  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },

  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },

  logoImage: {
    width: 120,
    height: 120,
  },

  appName: {
    fontSize: 30,
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary,
  },

  tagline: {
    fontSize: 14,
    fontWeight: FONTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },

  section: {
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.lg,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },

  text: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
  },

  cardText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },

  ctas: {
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.xl,
  },

  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    padding: SPACING.base,
    alignItems: 'center',
  },

  btnPrimaryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.heavy,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },

  closing: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});