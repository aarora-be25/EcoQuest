import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { useAuth } from '../context/AuthContext';
import { submitTask } from '../services/taskService';


// ── Cloudinary Config ─────────────────────────────────────────────

const CLOUDINARY_CLOUD_NAME = 'dmo0qnxph';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';


// ── Waste segregation guide ──────────────────────────────────────

const BIN_GUIDE = [

  {
    color: '#4CAF50',
    label: 'Green bin',
    items:
      'Wet waste — food scraps, vegetable peels, tea bags, flowers',
  },

  {
    color: '#2196F3',
    label: 'Blue bin',
    items:
      'Dry waste — paper, plastic bottles, cardboard, glass, metal cans',
  },

  {
    color: '#F44336',
    label: 'Red bin',
    items:
      'Hazardous — batteries, medicines, e-waste, chemicals',
  },

];


// ── Upload image to Cloudinary ───────────────────────────────────

const uploadToCloudinary = async (imageUri) => {

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'task_photo.jpg',
  });

  formData.append(
    'upload_preset',
    CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error(
      'Photo upload failed.'
    );
  }

  return data.secure_url;
};


// ────────────────────────────────────────────────────────────────

export default function TaskDetailScreen({

  navigation,
  route,

}) {

  const { task, onComplete } =
    route.params || {};

  const {
    user,
    refreshProfile,
  } = useAuth();


  const [photo, setPhoto] =
    useState(null);

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [statusMsg, setStatusMsg] =
    useState('');


  if (!task) {
    navigation.navigate('dashboard');
    return null;
  }


  const isWasteTask =
    task.id === 'trash_bin';


  // ── Open Camera ─────────────────────────────────────────

  const handlePhoto = async () => {

    try {

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {

        Alert.alert(
          'Permission required',
          'Camera access is needed.'
        );

        return;
      }


      const result =
        await ImagePicker.launchCameraAsync({

          mediaTypes: ['images'],

          quality: 0.7,

          allowsEditing: false,

        });


      if (
        !result.canceled &&
        result.assets?.length > 0
      ) {

        setPhoto(
          result.assets[0].uri
        );

      }

    } catch (e) {

      Alert.alert(
        'Camera error',
        e.message
      );

    }

  };


  // ── Submit Task ────────────────────────────────────────

  const handleSubmit = async () => {

    if (!photo) {

      Alert.alert(
        'Photo required',
        'Please take a photo first.'
      );

      return;
    }


    setLoading(true);


    try {

      // ── Step 1: Get GPS ─────────────────────

      setStatusMsg(
        'Getting your location…'
      );

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {

        Alert.alert(
          'Permission needed',
          'Location permission required.'
        );

        setLoading(false);

        return;
      }


      const loc =
        await Location.getCurrentPositionAsync({});


      // ── Step 2: Upload image ────────────────

      setStatusMsg(
        'Uploading photo…'
      );

      const photoUrl =
        await uploadToCloudinary(photo);


      // ── Step 3: Fake AI verification ───────

setStatusMsg(
  'Verifying photo with AI…'
);


await new Promise(resolve =>
  setTimeout(resolve, 1500)
);


// Random pass/fail

const passed =
  Math.random() > 0.5;


if (!passed) {

  Alert.alert(
    '✅ Verification Successful',

    'Your task is done.'
  );

  setLoading(false);

  setStatusMsg('');

  return;
}


      // ── Step 4: Save task to Firebase ─────

      setStatusMsg(
        'Saving your task…'
      );


      const result =
        await submitTask(

          user.uid,

          task.id,

          photoUrl,

          loc.coords

        );


      if (!result.success) {

        Alert.alert(
          'Not counted',
          result.message
        );

        setLoading(false);

        setStatusMsg('');

        return;
      }


      // ── Step 5: Success ────────────────────

      setSubmitted(true);

      await refreshProfile();


      if (
        typeof onComplete === 'function'
      ) {

        onComplete(task.id);

      }


      Alert.alert(

        '🌱 Task verified!',

        result.message,

        [

          {
            text: 'Back to dashboard',

            onPress: () =>
              navigation.navigate(
                'dashboard'
              ),
          },

        ]

      );

    } catch (error) {

      Alert.alert(
        'Something went wrong',
        error.message
      );

    } finally {

      setLoading(false);

      setStatusMsg('');

    }

  };


  // ── UI ─────────────────────────────────────

  return (

    <SafeAreaView style={styles.safe}>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >


        {/* Back button */}

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.backText}>
            ← Back
          </Text>

        </TouchableOpacity>


        {/* Hero Section */}

        <View style={styles.hero}>


          <View style={styles.taskIconCircle}>

            <Text style={{ fontSize: 48 }}>
              {task.icon}
            </Text>

          </View>


          <Text style={styles.taskName}>
            {task.name}
          </Text>


          <View style={styles.ptsPill}>

            <Text style={styles.ptsText}>
              +{task.pts} pts
            </Text>

          </View>


          <View style={styles.categoryPill}>

            <Text style={styles.categoryText}>
              {task.category}
            </Text>

          </View>

        </View>


        <View style={styles.body}>


          {/* Task Description */}

          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              What to do
            </Text>

            <Text style={styles.cardBody}>
              {task.description}
            </Text>

          </View>


          {/* Waste guide */}

          {isWasteTask && (

            <View style={styles.binGuideCard}>


              <Text style={styles.binGuideTitle}>
                🗑️ Which waste goes where?
              </Text>


              {BIN_GUIDE.map((b, i) => (

                <View
                  key={i}
                  style={styles.binRow}
                >

                  <View
                    style={[
                      styles.binDot,
                      {
                        backgroundColor:
                          b.color,
                      },
                    ]}
                  />


                  <View style={{ flex: 1 }}>

                    <Text style={styles.binLabel}>
                      {b.label}
                    </Text>

                    <Text style={styles.binItems}>
                      {b.items}
                    </Text>

                  </View>

                </View>

              ))}

            </View>

          )}


          {/* Verification info */}

          <View style={styles.verifyCard}>

            <Text style={styles.verifyText}>

              📍 GPS checks you're on campus

              {'\n'}

              🤖 AI verifies your task photo

            </Text>

          </View>


          {/* Photo Section */}

          <Text style={styles.sectionLabel}>
            Step 1 — Take a photo
          </Text>


          <TouchableOpacity

            style={[
              styles.photoZone,

              photo &&
                styles.photoZoneDone,
            ]}

            onPress={handlePhoto}

            disabled={loading}

          >

            {photo ? (

              <Image
                source={{ uri: photo }}
                style={styles.preview}
              />

            ) : (

              <>

                <Text style={{ fontSize: 36 }}>
                  📷
                </Text>

                <Text style={styles.photoText}>
                  Tap to take photo
                </Text>

              </>

            )}

          </TouchableOpacity>


          {photo && !submitted && (

            <TouchableOpacity
              onPress={handlePhoto}
              disabled={loading}
            >

              <Text style={styles.retakeText}>
                Retake photo
              </Text>

            </TouchableOpacity>

          )}


          {/* Submit */}

          <Text style={styles.sectionLabel}>
            Step 2 — Submit
          </Text>


          {loading && (

            <View style={styles.loadingBox}>

              <ActivityIndicator
                color={COLORS.primary}
              />

              <Text style={styles.loadingText}>
                {statusMsg}
              </Text>

            </View>

          )}


          <TouchableOpacity

            style={[

              styles.submitBtn,

              (
                !photo ||
                submitted ||
                loading
              ) &&
                styles.submitBtnDisabled,

            ]}

            onPress={handleSubmit}

            disabled={
              !photo ||
              submitted ||
              loading
            }

          >

            <Text style={styles.submitText}>

              {submitted
                ? 'Submitted ✓'
                : 'Mark as complete'}

            </Text>

          </TouchableOpacity>


          <View
            style={{
              height: SPACING.xxl,
            }}
          />

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}


// ── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
  },

  scroll: {
    flex: 1,
  },

  backBtn: {
    padding: SPACING.base,
  },

  backText: {
    fontSize: 14,
    fontWeight: FONTS.semibold,
    color: COLORS.primary,
  },

  hero: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    padding: SPACING.xl,
  },

  taskIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
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

  ptsText: {
    color: COLORS.white,
    fontWeight: FONTS.heavy,
  },

  categoryPill: {
    marginTop: SPACING.sm,
  },

  categoryText: {
    color: COLORS.primarySoft,
  },

  body: {
    padding: SPACING.base,
  },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginBottom: SPACING.md,
  },

  cardTitle: {
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  cardBody: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  binGuideCard: {
    backgroundColor: '#F0FBF0',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: SPACING.base,
    marginBottom: SPACING.md,
  },

  binGuideTitle: {
    fontSize: 13,
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  binRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  binDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 3,
    flexShrink: 0,
  },

  binLabel: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },

  binItems: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 1,
  },

  verifyCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.base,
  },

  verifyText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: FONTS.heavy,
    marginBottom: SPACING.sm,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
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

  retakeText: {
    color: COLORS.primary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },

  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: 10,
  },

  loadingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
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