// services/taskService.js

import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  doc,
  increment,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

// ─── CAMPUS BOUNDARY ──────────────────────────────────────────────────────────
// TIET Patiala campus bounds — adjust if GPS seems off
const CAMPUS_BOUNDS = {
  minLat: 30.3505,
  maxLat: 30.3586,
  minLng: 76.3594,
  maxLng: 76.3732,
};

// ─── BYPASS FLAG ──────────────────────────────────────────────────────────────
// Set to true during demo/testing to skip GPS check
// Set back to false for real deployment
const BYPASS_GPS_FOR_DEMO = true;

// ─── TASK DEFINITIONS ────────────────────────────────────────────────────────
export const TASKS = {
  trash_bin: {
    id: 'trash_bin',
    title: 'Trash in Correct Bin',
    points: 10,
    icon: '🗑️',
    description: 'Take a photo of waste placed in the correct bin.',
    requiresPhoto: true,
    requiresGPS: true,
    cooldownHours: 6,
    dailyCap: 3,
    countsForStreak: true,
  },
  water_plant: {
    id: 'water_plant',
    title: 'Water a Plant',
    points: 5,
    icon: '🌱',
    description: 'Take a photo of you watering a plant on campus.',
    requiresPhoto: true,
    requiresGPS: true,
    cooldownHours: 20,
    dailyCap: 1,
    countsForStreak: true,
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export const isOnCampus = (latitude, longitude) => {
  if (BYPASS_GPS_FOR_DEMO) return true; // skip GPS check for demo
  return (
    latitude >= CAMPUS_BOUNDS.minLat &&
    latitude <= CAMPUS_BOUNDS.maxLat &&
    longitude >= CAMPUS_BOUNDS.minLng &&
    longitude <= CAMPUS_BOUNDS.maxLng
  );
};

export const uploadTaskPhoto = async (uid, taskId, imageUri) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const filename = `tasks/${uid}/${taskId}_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

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

// ─── ENSURE USER POINTS FIELDS EXIST ─────────────────────────────────────────
// FIX: If points fields don't exist yet, increment() fails silently.
// This function ensures the fields exist before we increment them.
const ensureUserPointsExist = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const data = userSnap.data();

  const updates = {};

  // create points object if missing
  if (!data.points || typeof data.points !== 'object') {
    updates['points'] = {
      allTime: 0,
      monthly: 0,
    };
  } else {
    if (typeof data.points.allTime !== 'number') {
      updates['points.allTime'] = 0;
    }

    if (typeof data.points.monthly !== 'number') {
      updates['points.monthly'] = 0;
    }
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(userRef, updates);
  }
};
// ─── MAIN SUBMISSION FUNCTION ────────────────────────────────────────────────

export const submitTask = async (uid, taskId, imageUri, coords) => {
  const task = TASKS[taskId];
  if (!task) throw new Error('Unknown task.');

  // 1. GPS check (bypassed in demo mode)
  if (task.requiresGPS && !isOnCampus(coords?.latitude, coords?.longitude)) {
    return {
      success: false,
      pointsEarned: 0,
      message: 'You must be on campus to complete this task.',
    };
  }

 
  // 4. Upload photo
  let photoURL = null;
  if (task.requiresPhoto && imageUri) {
    try {
      photoURL = await uploadTaskPhoto(uid, taskId, imageUri);
    } catch (uploadError) {
      console.log('Photo upload failed, continuing without photo:', uploadError);
      // Don't block task submission if photo upload fails
    }
  }

  // 5. Save submission document
  await addDoc(collection(db, 'taskSubmissions'), {
    uid,
    taskId,
    photoURL,
    latitude: coords?.latitude ?? 0,
    longitude: coords?.longitude ?? 0,
    pointsEarned: task.points,
    status: 'approved',
    createdAt: serverTimestamp(),
  });

  // 6. FIX: Ensure points fields exist before incrementing
  await ensureUserPointsExist(uid);

  // 7. Update user points atomically
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
  points: {
    allTime:
      (await getDoc(userRef)).data()?.points?.allTime + task.points || task.points,

    monthly:
      (await getDoc(userRef)).data()?.points?.monthly + task.points || task.points,
  },
});

  // 8. Update streak if eligible
  if (task.countsForStreak) {
    await updateStreak(uid);
  }

  return {
    success: true,
    pointsEarned: task.points,
    message: `+${task.points} points! Great work 🌿`,
  };
};

// ─── STREAK LOGIC ─────────────────────────────────────────────────────────────

const updateStreak = async (uid) => {
  const userRef = doc(db, 'users', uid);
  // FIX: Use getDoc directly instead of querying the collection
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;
  const user = userSnap.data();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = user.streak?.lastTaskDate?.toDate?.();
  if (!lastDate) {
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

  const newStreak = diffDays === 1 ? (user.streak.current || 0) + 1 : 1;
  const newLongest = Math.max(newStreak, user.streak.longest || 0);

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

// ─── LEADERBOARD FETCH ────────────────────────────────────────────────────────

/**
 * Fetches leaderboard data.
 * Pass branch string to filter by branch, or null for all users.
 */
export const fetchLeaderboard = async (branch = null) => {
  let q;

  if (branch) {
    // FIX: Filter by branch — branch must be stored exactly as typed on signup
    q = query(
      collection(db, 'users'),
      where('branch', '==', branch.toUpperCase()),
      orderBy('points.monthly', 'desc'),
      limit(50)
    );
  } else {
    q = query(
      collection(db, 'users'),
      orderBy('points.monthly', 'desc'),
      limit(50)
    );
  }

  const snap = await getDocs(q);
  return snap.docs.map((d, index) => ({
    rank: index + 1,
    uid: d.id,
    name: d.data().name || 'Unknown',
    branch: d.data().branch || '',
    points: d.data().points?.monthly ?? 0,
  }));
};