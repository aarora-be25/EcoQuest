/*import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '✅', title: 'Complete eco tasks', desc: 'Log daily sustainable actions — waste sorting, cycling, planting, and more.' },
  { icon: '📷', title: 'Photo verification', desc: 'Each task requires a photo proof to earn points. No cheating allowed.' },
  { icon: '🏆', title: 'Branch leaderboard', desc: 'Compete within your branch or across all first-years. Climb the ranks.' },
  { icon: '⚡', title: 'Earn & lose points', desc: 'Verified cheating deducts your points. Be real; keep it clean, keep it green.' },
];

export default function HomeScreen({ navigate }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {//Hero }
        <LinearGradient
  colors={[COLORS.primarySoft, COLORS.primaryDark]}
  style={styles.hero}
>
          <View style={styles.logoCircle}>
            <Image 
      source={require('../assets/icon.png')} 
      style={styles.logoImage}
    />
      </View>
          
          <Text style={styles.appName}>EcoQuest</Text>
          <Text style={styles.tagline}>Earn points. Save the planet.</Text>
          <Text style={styles.subtitle}>
            A sustainability challenge for TIET students.{'\n'}
            Log eco-friendly actions, earn points, compete with your branch.
          </Text>
        </LinearGradient>

        {// Features }
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How it works</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={{ fontSize: 22 }}>{f.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {// Stats strip }
        <View style={styles.statsStrip}>
          {[['240+', 'Students'], ['18', 'Eco tasks'], ['1st year', 'UEN008']].map(([num, lbl], i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {// CTAs }
        <View style={styles.ctas}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigate('login', { mode: 'signup' })} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Login/Sign up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>TIET, Patiala · UEN008 · 2026</Text>
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1 },

  hero: {
    alignItems: 'center',
    paddingTop: SPACING.xxl + SPACING.md,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  
  logoImage: {
  width: 50,
  height: 50,
  resizeMode: 'contain',
},
  appName: {
    fontSize: 34,
    fontWeight: FONTS.heavy,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.primarySoft,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 20,
  },

  section: { padding: SPACING.base },
  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },

  featureCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm + 2,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: FONTS.heavy, color: COLORS.accent },
  statLbl: { fontSize: 11, color: COLORS.primarySoft, marginTop: 2 },

  ctas: { paddingHorizontal: SPACING.base, gap: SPACING.sm },
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
  btnOutline: {
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: SPACING.base,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
});
*/

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FEATURES = [
  { icon: '✅', title: 'Complete eco tasks', desc: 'Log daily sustainable actions — waste sorting, cycling, planting, and more.' },
  { icon: '📷', title: 'Photo verification', desc: 'Each task requires a photo proof to earn points. No cheating allowed.' },
  { icon: '🏆', title: 'Branch leaderboard', desc: 'Compete within your branch or across all first-years. Climb the ranks.' },
  { icon: '⚡', title: 'Earn & lose points', desc: 'Verified- cheating deducts your points. Be real; keep it clean, keep it green.' },
  { icon: '8️⃣', title: '8 Eco tasks', desc: 'Currently, 8 eco tasks available. List available on tasks page after login.' },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero */}
        <LinearGradient
          colors={[COLORS.primarySoft, COLORS.primaryDark]}
          style={styles.hero}
        >
          <View style={styles.logoCircle}>
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.logoImage}
            />
          </View>

          <Text style={styles.appName}>EcoQuest</Text>
          <Text style={styles.tagline}>Earn points. Save the planet.</Text>

          <Text style={styles.subtitle}>
            A sustainability challenge for TIET students.{'\n'}
            Log eco-friendly actions, earn points, compete with your branch.
          </Text>
        </LinearGradient>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How it works</Text>

          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={{ fontSize: 22 }}>{f.icon}</Text>
              </View>

              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsStrip}>
          {[['1st year; UEN008', 'Still under construction']].map(([num, lbl], i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{num}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('login', { mode: 'signup' })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Login / Sign up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          TIET, Patiala · UEN008 · 2026
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1 },

  hero: {
    alignItems: 'center',
    paddingTop: SPACING.xxl + SPACING.md,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  
  logoImage: {
  width: 100,
  height: 100,
  resizeMode: 'contain',
},
  appName: {
    fontSize: 34,
    fontWeight: FONTS.heavy,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: 15,
    fontWeight: FONTS.semibold,
    color: COLORS.primarySoft,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 20,
  },

  section: { padding: SPACING.base },
  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },

  featureCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm + 2,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  statsStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: FONTS.heavy, color: COLORS.accent },
  statLbl: { fontSize: 11, color: COLORS.primarySoft, marginTop: 2 },

  ctas: { paddingHorizontal: SPACING.base, gap: SPACING.sm },
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
  btnOutline: {
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: SPACING.base,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.xl,
  },
});
