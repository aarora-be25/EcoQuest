/*import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function TaskDetailScreen({ navigate, task, onComplete }) {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  if (!task) {
    navigate('dashboard');
    return null;
  }

  const handlePhoto = () => {
    // In real app: use expo-image-picker here
    // import * as ImagePicker from 'expo-image-picker';
    // const result = await ImagePicker.launchCameraAsync({ ... });
    Alert.alert(
      'Take photo',
      'In the real app this opens your camera via expo-image-picker.',
      [
        { text: 'Simulate photo taken', onPress: () => setPhotoTaken(true) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = () => {
    if (!photoTaken) {
      Alert.alert('Photo required', 'Please take a photo to verify your task before submitting.');
      return;
    }
    setSubmitted(true);
    if (onComplete) onComplete(task.id, task.pts);
    setTimeout(() => {
      Alert.alert('🌱 Task completed!', `You earned +${task.pts} pts. Great work!`, [
        { text: 'Back to dashboard', onPress: () => navigate('dashboard') },
      ]);
    }, 300);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {// Back }
        <TouchableOpacity style={styles.backBtn} onPress={() => navigate('dashboard')} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {// Task hero }
        <View style={styles.hero}>
          <View style={styles.taskIconCircle}>
            <Text style={{ fontSize: 48 }}>{task.icon}</Text>
          </View>
          <Text style={styles.taskName}>{task.name}</Text>
          <View style={styles.ptsPill}>
            <Text style={styles.ptsText}>+{task.pts} pts on completion</Text>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
        </View>

        <View style={styles.body}>

          {// Description }
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What to do</Text>
            <Text style={styles.cardBody}>{task.description}</Text>
          </View>

          {// Rules }
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rules</Text>
            {[
              'Photo must clearly show the completed activity.',
              'Blurry, irrelevant, or staged photos will be flagged.',
              'Flagging deducts the full task points from your score.',
              'Each task can be completed once per day.',
            ].map((r, i) => (
              <View key={i} style={styles.ruleRow}>
                <Text style={styles.ruleDot}>•</Text>
                <Text style={styles.ruleText}>{r}</Text>
              </View>
            ))}
          </View>

          {// Photo upload }
          <Text style={styles.sectionLabel}>Step 1 — Take a photo</Text>
          <TouchableOpacity
            style={[styles.photoZone, photoTaken && styles.photoZoneDone]}
            onPress={handlePhoto}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 36 }}>{photoTaken ? '✅' : '📷'}</Text>
            <Text style={[styles.photoText, photoTaken && { color: COLORS.primaryDark }]}>
              {photoTaken ? 'Photo captured!' : 'Tap to take photo'}
            </Text>
            <Text style={styles.photoSub}>
              {photoTaken ? 'Tap to retake if needed' : 'Camera will open — make sure activity is visible'}
            </Text>
          </TouchableOpacity>

          {// Submit }
          <Text style={styles.sectionLabel}>Step 2 — Submit for verification</Text>
          <TouchableOpacity
            style={[styles.submitBtn, (!photoTaken || submitted) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={!photoTaken || submitted}
          >
            <Text style={styles.submitText}>
              {submitted ? 'Submitted ✓' : 'Mark as complete'}
            </Text>
          </TouchableOpacity>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Submitting a fake or staged photo will result in point deduction and may lead to your account being reviewed.
            </Text>
          </View>

          <View style={{ height: SPACING.xxl * 2 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1 },

  backBtn: { padding: SPACING.base, paddingBottom: SPACING.base },
  backText: { paddingTop: SPACING.md, fontSize: 14, fontWeight: FONTS.semibold, color: COLORS.primary },

  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  taskIconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  taskName: { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.white, textAlign: 'center' },
  ptsPill: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
  },
  ptsText: { fontSize: 14, fontWeight: FONTS.heavy, color: COLORS.white },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  categoryText: { fontSize: 11, color: COLORS.primarySoft, fontWeight: FONTS.bold },

  body: { padding: SPACING.base },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.base, marginBottom: SPACING.md,
  },
  cardTitle: { fontSize: 13, fontWeight: FONTS.heavy, color: COLORS.primaryDark, marginBottom: SPACING.sm },
  cardBody: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  ruleRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xs },
  ruleDot: { color: COLORS.primary, fontWeight: FONTS.heavy, fontSize: 14 },
  ruleText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  sectionLabel: {
    fontSize: 11, fontWeight: FONTS.heavy, color: COLORS.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase',
    marginBottom: SPACING.sm, marginTop: SPACING.sm,
  },

  photoZone: {
    borderWidth: 2.5,
    borderColor: COLORS.primarySoft,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    padding: SPACING.xxl,
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  photoZoneDone: {
    borderColor: COLORS.primary,
    backgroundColor: '#c5ead6',
    borderStyle: 'solid',
  },
  photoText: { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.primary },
  photoSub: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },

  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    padding: SPACING.base,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  submitBtnDisabled: { backgroundColor: COLORS.borderMid },
  submitText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.heavy },

  warningBox: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  warningText: { fontSize: 12, color: COLORS.dangerDark, lineHeight: 18 },
});
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, Image,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';

export default function TaskDetailScreen({ navigation, route }) {
  const { task, onComplete } = route.params || {};

  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!task) {
    navigation.navigate('dashboard');
    return null;
  }

  // 📸 Open camera
  const handlePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Camera access is needed.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!photo) {
      Alert.alert('Photo required', 'Please take a photo before submitting.');
      return;
    }

    setSubmitted(true);

    if (onComplete) onComplete(task.id, task.pts);

    setTimeout(() => {
      Alert.alert('🌱 Task completed!', `+${task.pts} pts added`, [
        { text: 'Back to dashboard', onPress: () => navigation.navigate('dashboard') },
      ]);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.taskIconCircle}>
            <Text style={{ fontSize: 48 }}>{task.icon}</Text>
          </View>
          <Text style={styles.taskName}>{task.name}</Text>

          <View style={styles.ptsPill}>
            <Text style={styles.ptsText}>+{task.pts} pts</Text>
          </View>

          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What to do</Text>
            <Text style={styles.cardBody}>{task.description}</Text>
          </View>

          {/* Photo */}
          <Text style={styles.sectionLabel}>Step 1 — Take a photo</Text>

          <TouchableOpacity
            style={[styles.photoZone, photo && styles.photoZoneDone]}
            onPress={handlePhoto}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.preview} />
            ) : (
              <>
                <Text style={{ fontSize: 36 }}>📷</Text>
                <Text style={styles.photoText}>Tap to take photo</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Submit */}
          <Text style={styles.sectionLabel}>Step 2 — Submit</Text>

          <TouchableOpacity
            style={[styles.submitBtn, (!photo || submitted) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!photo || submitted}
          >
            <Text style={styles.submitText}>
              {submitted ? 'Submitted ✓' : 'Mark as complete'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: SPACING.xxl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1 },

  backBtn: { padding: SPACING.base },
  backText: { fontSize: 14, fontWeight: FONTS.semibold, color: COLORS.primary },

  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    padding: SPACING.xl,
  },

  taskIconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },

  taskName: {
    fontSize: 22,
    fontWeight: FONTS.heavy,
    color: COLORS.white,
  },

  ptsPill: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.base,
    paddingVertical: 4,
    marginTop: SPACING.sm,
  },

  ptsText: { color: COLORS.white, fontWeight: FONTS.heavy },

  categoryPill: {
    marginTop: SPACING.sm,
  },

  categoryText: { color: COLORS.primarySoft },

  body: { padding: SPACING.base },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginBottom: SPACING.md,
  },

  cardTitle: { fontWeight: FONTS.heavy },
  cardBody: { marginTop: 5 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    marginBottom: SPACING.sm,
  },

  photoZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.base,
  },

  photoZoneDone: {
    borderStyle: 'solid',
  },

  preview: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.md,
  },

  photoText: {
    marginTop: 8,
    color: COLORS.primary,
  },

  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },

  submitBtnDisabled: {
    backgroundColor: COLORS.borderMid,
  },

  submitText: {
    color: COLORS.white,
    fontWeight: FONTS.heavy,
  },
});
