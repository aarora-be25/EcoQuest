import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';

export default function EditProfile({ navigation }) {
  const { profile, refreshProfile } = useAuth();

  const [name,   setName]   = useState(profile?.name       || '');
  const [branch, setBranch] = useState(profile?.department || '');
  const [year,   setYear]   = useState(profile?.year       || '');
  const [loading, setLoading] = useState(false);

  const hasChanges =
    name.trim()   !== (profile?.name       || '') ||
    branch.trim() !== (profile?.department || '') ||
    year.trim()   !== (profile?.year       || '');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        name:       name.trim(),
        department: branch.trim(),
        year:       year.trim(),
      });
      await refreshProfile();
      Alert.alert('✅ Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Edit Profile</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your full name"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Branch</Text>
          <TextInput
            style={styles.input}
            value={branch}
            onChangeText={setBranch}
            placeholder="e.g. COE, ECE, ME"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="e.g. 1st Year, 2nd Year"
            placeholderTextColor={COLORS.textMuted}
          />

          {/* Read-only fields */}
          <Text style={styles.label}>Email (cannot change)</Text>
          <View style={styles.readOnly}>
            <Text style={styles.readOnlyText}>{profile?.email || '—'}</Text>
          </View>

          <Text style={styles.label}>Roll No. (cannot change)</Text>
          <View style={styles.readOnly}>
            <Text style={styles.readOnlyText}>{profile?.rollNo || '—'}</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, (!hasChanges || loading) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!hasChanges || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.saveBtnText}>Save changes</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bgPage },

  backBtn:  { paddingHorizontal: SPACING.base, paddingTop: SPACING.lg },
  backText: { fontSize: 14, fontWeight: FONTS.semibold, color: COLORS.primary },

  content: { padding: SPACING.xl },

  title: { fontSize: 22, fontWeight: FONTS.bold, color: COLORS.textPrimary, marginBottom: SPACING.xl },

  label: { fontSize: 13, fontWeight: FONTS.bold, color: COLORS.textSecondary, marginBottom: SPACING.xs, marginTop: SPACING.md },

  input: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md, fontSize: 14, color: COLORS.textPrimary,
  },

  readOnly: {
    backgroundColor: COLORS.bgPage, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
  },
  readOnlyText: { fontSize: 14, color: COLORS.textMuted },

  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.pill,
    padding: SPACING.base, alignItems: 'center', marginTop: SPACING.xl,
  },
  saveBtnDisabled: { backgroundColor: COLORS.borderMid },
  saveBtnText:     { color: COLORS.white, fontSize: 15, fontWeight: FONTS.heavy },
});
