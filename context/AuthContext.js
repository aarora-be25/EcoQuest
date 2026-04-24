// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

// After signup, Firestore write may not be immediately readable.
// Retry up to 5 times with 800ms gaps before giving up.
const fetchProfileWithRetry = async (uid, retries = 5, delayMs = 800) => {
  for (let i = 0; i < retries; i++) {
    try {
      const p = await getUserProfile(uid);
      return p;
    } catch (e) {
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        throw e;
      }
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userProfile = await fetchProfileWithRetry(firebaseUser.uid);
          setProfile(userProfile);
        } catch (e) {
          console.error('Could not load profile:', e);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        const updated = await getUserProfile(user.uid);
        setProfile(updated);
      } catch (e) {
        console.error('Refresh profile error:', e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);