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

        // Back }
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        // Hero }
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

          // Description }
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What to do</Text>
            <Text style={styles.cardBody}>{task.description}</Text>
          </View>

          // Photo }
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

          // Submit }
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
