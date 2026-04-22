// services/authService.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// ─── CONFIGURE YOUR COLLEGE DOMAIN HERE ───────────────────────────────────────
const ALLOWED_DOMAIN = '@thapar.edu'; // change to your college email domain
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Validates that email belongs to the allowed college domain.
 */
export const isCollegeEmail = (email) => {
  return email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);
};

/**
 * Signs up a new student.
 * Creates Firebase Auth user + Firestore user document.
 */
export const signUpUser = async ({ email, password, name, department, year }) => {
  if (!isCollegeEmail(email)) {
    throw new Error(`Only ${ALLOWED_DOMAIN} email addresses are allowed.`);
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name in Firebase Auth
  await updateProfile(user, { displayName: name });

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    department,
    year,                        // e.g. "2nd Year"
    photoURL: null,
    role: 'student',             // 'student' | 'admin'
    points: {
      allTime: 0,
      monthly: 0,
      lastMonthReset: serverTimestamp(),
    },
    streak: {
      current: 0,
      longest: 0,
      lastTaskDate: null,
    },
    badges: [],                  // 'gold' | 'silver' | 'bronze'
    createdAt: serverTimestamp(),
  });

  return user;
};

/**
 * Logs in an existing user.
 */
export const loginUser = async (email, password) => {
  if (!isCollegeEmail(email)) {
    throw new Error(`Only ${ALLOWED_DOMAIN} email addresses are allowed.`);
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Logs out the current user.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Fetches the Firestore profile document for a given uid.
 */
export const getUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return docSnap.data();
  }
  throw new Error('User profile not found.');
};