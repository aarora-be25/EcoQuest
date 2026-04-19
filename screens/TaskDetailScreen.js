import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, Image, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// ── Firebase ──────────────────────────────────────────────────────────────────
import { useAuth } from '../context/AuthContext';
import { submitTask } from '../services/taskService';

// ── Cloudinary config ─────────────────────────────────────────────────────────
// Sign up free at cloudinary.com, then replace these 3 values
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // create an unsigned preset in Cloudinary settings
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY';    // from console.anthropic.com

// ── Upload photo to Cloudinary ─────────────────────────────────────────────────
const uploadToCloudinary = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'task_photo.jpg',
  });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await response.json();
  if (!data.secure_url) throw new Error('Photo upload failed.');
  return data.secure_url;
};

// ── Claude vision verification ────────────────────────────────────────────────
// Sends the photo URL to Claude and asks if the task is actually happening
const verifyPhotoWithClaude = async (photoUrl, taskName) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'url', url: photoUrl },
            },
            {
              type: 'text',
              text: `Does this photo show someone doing this sustainability task: "${taskName}"? 
              Reply with only YES or NO followed by one short reason. Example: "YES - shows waste in recycling bin" or "NO - no bin visible"`,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.content?.[0]?.text || '';
  const passed = reply.trim().toUpperCase().startsWith('YES');
  return { passed, reason: reply };
};

// ─────────────────────────────────────────────────────────────────────────────

export default function TaskDetailScreen({ navigation, route }) {
  const { task } = route.params || {};
  const { user, refreshProfile } = useAuth();

  const [photo, setPhoto]         = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!task) {
    navigation.navigate('dashboard');
    return null;
  }

  // ── Open camera ─────────────────────────────────────────────────────────────
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

  // ── Submit task ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert('Photo required', 'Please take a photo before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Step 1 — Get GPS location
      setStatusMsg('Getting your location…');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow location access to verify you are on campus.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});

      // Step 2 — Upload photo to Cloudinary
      setStatusMsg('Uploading photo…');
      const photoUrl = await uploadToCloudinary(photo);

      // Step 3 — Claude verifies the photo
      setStatusMsg('Verifying photo with AI…');
      const { passed, reason } = await verifyPhotoWithClaude(photoUrl, task.name);

      if (!passed) {
        Alert.alert(
          '❌ Photo not verified',
          `AI couldn't confirm the task.\n\n${reason}\n\nPlease retake the photo clearly showing the activity.`
        );
        setLoading(false);
        setStatusMsg('');
        return;
      }

      // Step 4 — Submit to Firebase (GPS check + cooldown + points happen inside submitTask)
      setStatusMsg('Saving your task…');
      const result = await submitTask(user.uid, task.id, photoUrl, loc.coords);

      if (!result.success) {
        Alert.alert('Not counted', result.message);
        setLoading(false);
        setStatusMsg('');
        return;
      }

      // Step 5 — Success
      setSubmitted(true);
      await refreshProfile(); // update points shown on dashboard instantly

      Alert.alert(
        '🌱 Task verified!',
        `${result.message}`,
        [{ text: 'Back to dashboard', onPress: () => navigation.navigate('dashboard') }]
      );

    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
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

          {/* Verification info */}
          <View style={styles.verifyCard}>
            <Text style={styles.verifyText}>
              📍 GPS checks you're on campus{'\n'}
              🤖 AI verifies your photo shows the actual task
            </Text>
          </View>

          {/* Photo */}
          <Text style={styles.sectionLabel}>Step 1 — Take a photo</Text>
          <TouchableOpacity
            style={[styles.photoZone, photo && styles.photoZoneDone]}
            onPress={handlePhoto}
            disabled={loading}
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

          {/* Retake button */}
          {photo && !submitted && (
            <TouchableOpacity onPress={handlePhoto} disabled={loading}>
              <Text style={styles.retakeText}>Retake photo</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <Text style={styles.sectionLabel}>Step 2 — Submit</Text>

          {/* Loading state */}
          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.loadingText}>{statusMsg}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, (!photo || submitted || loading) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!photo || submitted || loading}
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
  safe:   { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1 },

  backBtn:  { padding: SPACING.base },
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
  taskName:     { fontSize: 22, fontWeight: FONTS.heavy, color: COLORS.white },
  ptsPill:      { backgroundColor: COLORS.accent, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.base, paddingVertical: 4, marginTop: SPACING.sm },
  ptsText:      { color: COLORS.white, fontWeight: FONTS.heavy },
  categoryPill: { marginTop: SPACING.sm },
  categoryText: { color: COLORS.primarySoft },

  body: { padding: SPACING.base },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    padding: SPACING.base, marginBottom: SPACING.md,
  },
  cardTitle: { fontWeight: FONTS.heavy },
  cardBody:  { marginTop: 5 },

  verifyCard: {
    backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.base,
  },
  verifyText: { fontSize: 12, color: COLORS.primaryDark, lineHeight: 20 },

  sectionLabel: { fontSize: 11, fontWeight: FONTS.heavy, marginBottom: SPACING.sm },

  photoZone: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.primary,
    borderRadius: RADIUS.md, padding: SPACING.xl,
    alignItems: 'center', marginBottom: SPACING.base,
  },
  photoZoneDone: { borderStyle: 'solid' },
  preview:       { width: '100%', height: 200, borderRadius: RADIUS.md },
  photoText:     { marginTop: 8, color: COLORS.primary },
  retakeText:    { color: COLORS.primary, fontSize: 13, textAlign: 'center', marginBottom: SPACING.base },

  loadingBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.md, gap: 10,
  },
  loadingText: { fontSize: 13, color: COLORS.textSecondary },

  submitBtn:         { backgroundColor: COLORS.primary, padding: SPACING.base, borderRadius: RADIUS.pill, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: COLORS.borderMid },
  submitText:        { color: COLORS.white, fontWeight: FONTS.heavy },
});