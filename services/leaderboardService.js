// services/leaderboardService.js

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Fetches top N users by monthly points.
 * @param {number} topN - how many users to fetch (default 50)
 * @returns Array of user objects sorted by monthly points desc
 */
export const getIndividualLeaderboard = async (topN = 50) => {
  const q = query(
    collection(db, 'users'),
    orderBy('points.monthly', 'desc'),
    limit(topN)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc, index) => ({
    rank: index + 1,
    ...doc.data(),
  }));
};

/**
 * Fetches leaderboard filtered by department.
 * @param {string} department - e.g. "Computer Science"
 */
export const getDepartmentLeaderboard = async (department, topN = 50) => {
  const q = query(
    collection(db, 'users'),
    where('department', '==', department),
    orderBy('points.monthly', 'desc'),
    limit(topN)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc, index) => ({
    rank: index + 1,
    ...doc.data(),
  }));
};

/**
 * Fetches leaderboard filtered by college year.
 * @param {string} year - e.g. "2nd Year"
 */
export const getYearLeaderboard = async (year, topN = 50) => {
  const q = query(
    collection(db, 'users'),
    where('year', '==', year),
    orderBy('points.monthly', 'desc'),
    limit(topN)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc, index) => ({
    rank: index + 1,
    ...doc.data(),
  }));
};

/**
 * Aggregates points by department for a bar chart.
 * Returns array of { department, totalPoints } sorted desc.
 */
export const getDepartmentTotals = async () => {
  const snap = await getDocs(collection(db, 'users'));
  const totals = {};

  snap.docs.forEach((doc) => {
    const { department, points } = doc.data();
    if (!department) return;
    totals[department] = (totals[department] || 0) + (points?.monthly || 0);
  });

  return Object.entries(totals)
    .map(([department, totalPoints]) => ({ department, totalPoints }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
};

/**
 * Gets the rank of a specific user within the overall monthly leaderboard.
 */
export const getUserRank = async (uid) => {
  // Count how many users have MORE monthly points than this user
  const userSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', uid)));
  if (userSnap.empty) return null;

  const userPoints = userSnap.docs[0].data().points?.monthly || 0;

  const higherSnap = await getDocs(
    query(collection(db, 'users'), where('points.monthly', '>', userPoints))
  );
  return higherSnap.size + 1; // rank = number of people above you + 1
};