// services/authService.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

const ALLOWED_DOMAIN = '@thapar.edu';

export const isCollegeEmail = (email) =>
  email.trim().toLowerCase().endsWith(ALLOWED_DOMAIN);

export const signUpUser = async ({ email, password, name, department, year, rollNo }) => {
  if (!isCollegeEmail(email)) {
    throw new Error(`Only ${ALLOWED_DOMAIN} email addresses are allowed.`);
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid:        user.uid,
    name,
    email,
    department,
    year,
    rollNo:     rollNo || '',
    photoURL:   null,
    role:       'student',
    points: {
      allTime:       0,
      monthly:       0,
      lastMonthReset: serverTimestamp(),
    },
    streak: {
      current:      0,
      longest:      0,
      lastTaskDate: null,
    },
    badges:    [],
    createdAt: serverTimestamp(),
  });

  return user;
};

export const loginUser = async (email, password) => {
  if (!isCollegeEmail(email)) {
    throw new Error(`Only ${ALLOWED_DOMAIN} email addresses are allowed.`);
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid) => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) return docSnap.data();
  throw new Error('User profile not found.');
};