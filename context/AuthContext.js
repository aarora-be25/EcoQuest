// context/AuthContext.js
// Wrap your App.js with this so any screen can access the logged-in user.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Firebase Auth user
  const [profile, setProfile] = useState(null); // Firestore user document
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setProfile(userProfile);
        } catch (e) {
          console.error('Could not load profile:', e);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  // Call this after any update to refresh profile in context
  const refreshProfile = async () => {
    if (user) {
      const updated = await getUserProfile(user.uid);
      setProfile(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in any screen: const { user, profile } = useAuth();
export const useAuth = () => useContext(AuthContext);