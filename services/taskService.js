// services/taskService.js

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

// ─── CAMPUS BOUNDARY ──────────────────────────────────────────────────────────
// Define your campus as a simple bounding box (easiest for now).
// Get your campus lat/lng from Google Maps and adjust.
const CAMPUS_BOUNDS = {
  minLat: 30.3505,
  maxLat: 30.3586,
  minLng: 76.3594,
  maxLng: 76.3732,
};

// ─── TASK DEFINITIONS ────────────────────────────────────────────────────────
// Only 2 tasks are active for now. Add more by uncommenting / adding entries.
export const TASKS = {
  trash_bin: {
    id: 'trash_bin',
    title: 'Trash in Correct Bin',
    points: 10,
    icon: '🗑️',
    description: 'Take a photo of waste placed in the correct bin.',
    requiresPhoto: true,
    requiresGPS: true,
    cooldownHours: 6,    // can only earn this once per 6 hours
    dailyCap: 3,         // max 3 times per day
  },
  water_plant: {
    id: 'water_plant',
    title: 'Water a Plant',
    points: 5,
    icon: '🌱',
    description: 'Take a photo of you watering a plant on campus.',
    requiresPhoto: true,
    requiresGPS: true,
    cooldownHours: 20,   // ~once per day
    dailyCap: 1,
    countsForStreak: true,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/**
 * Returns true if the given coordinates are within campus bounds.
 */
export const isOnCampus = (latitude, longitude) => {
  return (
    latitude >= CAMPUS_BOUNDS.minLat &&
    latitude <= CAMPUS_BOUNDS.maxLat &&
    longitude >= CAMPUS_BOUNDS.minLng &&
    longitude <= CAMPUS_BOUNDS.maxLng
  );
};

/**
 * Uploads a photo (from Expo ImagePicker result) to Firebase Storage.
 * Returns the public download URL.
 */
export const uploadTaskPhoto = async (uid, taskId, imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const filename = `tasks/${uid}/${taskId}_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

/**
 * Checks how many times a user completed a task today.
 */
const getTaskCountToday = async (uid, taskId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, 'taskSubmissions'),
    where('uid', '==', uid),
    where('taskId', '==', taskId),
    where('createdAt', '>=', Timestamp.fromDate(startOfDay))
  );
  const snap = await getDocs(q);
  return snap.size;
};

/**
 * Checks if a task is still in cooldown for this user.
 */
const isInCooldown = async (uid, taskId, cooldownHours) => {
  const cutoff = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);

  const q = query(
    collection(db, 'taskSubmissions'),
    where('uid', '==', uid),
    where('taskId', '==', taskId),
    where('createdAt', '>=', Timestamp.fromDate(cutoff)),
    limit(1)
  );
  const snap = await getDocs(q);
  return !snap.empty;
};

// ─── MAIN SUBMISSION FUNCTION ────────────────────────────────────────────────

/**
 * Submits a task. Handles photo upload, GPS check, cooldown, daily cap,
 * points update, and streak logic.
 *
 * @param {string} uid         - Firebase Auth user uid
 * @param {string} taskId      - key from TASKS object
 * @param {string} imageUri    - local image URI from Expo camera/picker
 * @param {object} coords      - { latitude, longitude } from expo-location
 * @returns {{ success: boolean, pointsEarned: number, message: string }}
 */
export const submitTask = async (uid, taskId, imageUri, coords) => {
  const task = TASKS[taskId];
  if (!task) throw new Error('Unknown task.');

  // 1. GPS check
  if (task.requiresGPS && !isOnCampus(coords.latitude, coords.longitude)) {
    return { success: false, pointsEarned: 0, message: 'You must be on campus to complete this task.' };
  }

  // 2. Daily cap check
  const todayCount = await getTaskCountToday(uid, taskId);
  if (todayCount >= task.dailyCap) {
    return { success: false, pointsEarned: 0, message: `You've already completed this task ${task.dailyCap}x today.` };
  }

  // 3. Cooldown check
  const cooledDown = await isInCooldown(uid, taskId, task.cooldownHours);
  if (cooledDown) {
    return { success: false, pointsEarned: 0, message: `Wait ${task.cooldownHours} hours before doing this again.` };
  }

  // 4. Upload photo
  let photoURL = null;
  if (task.requiresPhoto && imageUri) {
    photoURL = await uploadTaskPhoto(uid, taskId, imageUri);
  }

  // 5. Save submission document
  await addDoc(collection(db, 'taskSubmissions'), {
    uid,
    taskId,
    photoURL,
    latitude: coords.latitude,
    longitude: coords.longitude,
    pointsEarned: task.points,
    status: 'approved',          // 'approved' | 'pending' | 'rejected'
    createdAt: serverTimestamp(),
  });

  // 6. Update user points (monthly + all-time) atomically
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    'points.allTime': increment(task.points),
    'points.monthly': increment(task.points),
  });

  // 7. Update streak if task counts for streak
  if (task.countsForStreak) {
    await updateStreak(uid);
  }

  return { success: true, pointsEarned: task.points, message: `+${task.points} points! Great work 🌿` };
};

// ─── STREAK LOGIC ─────────────────────────────────────────────────────────────

/**
 * Updates user streak. Call after any streak-eligible task.
 */
const updateStreak = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDocs(query(collection(db, 'users'), where('uid', '==', uid), limit(1)));

  if (snap.empty) return;
  const user = snap.docs[0].data();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = user.streak?.lastTaskDate?.toDate?.();
  if (!lastDate) {
    // First ever streak entry
    await updateDoc(userRef, {
      'streak.current': 1,
      'streak.longest': 1,
      'streak.lastTaskDate': serverTimestamp(),
    });
    return;
  }

  const lastDay = new Date(lastDate);
  lastDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return; // already updated today

  const newStreak = diffDays === 1 ? (user.streak.current || 0) + 1 : 1; // reset if gap > 1 day
  const newLongest = Math.max(newStreak, user.streak.longest || 0);

  // Streak bonus points at milestones
  let bonusPoints = 0;
  if (newStreak === 7) bonusPoints = 15;
  if (newStreak === 14) bonusPoints = 25;
  if (newStreak === 30) bonusPoints = 50;

  await updateDoc(userRef, {
    'streak.current': newStreak,
    'streak.longest': newLongest,
    'streak.lastTaskDate': serverTimestamp(),
    ...(bonusPoints > 0 && {
      'points.allTime': increment(bonusPoints),
      'points.monthly': increment(bonusPoints),
    }),
  });
};