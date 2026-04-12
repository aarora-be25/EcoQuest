/*import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function LoginScreen({ navigate }) {
  const [mode, setMode]           = useState('login'); // 'login' | 'signup'
  const [studentId, setStudentId] = useState('');
  const [rollNo, setRollNo]       = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [branch, setBranch]       = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = () => {
    if (!studentId || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (mode === 'signup' && (!name || !branch)) {
      Alert.alert('Missing fields', 'Please fill in your name and branch.');
      return;
    }
    setLoading(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      setLoading(false);
      navigate('dashboard');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {// Back }
          <TouchableOpacity style={styles.backBtn} onPress={() => navigate('home')} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {// Header }
          <View style={styles.header}>
            <Text style={styles.logoEmoji}>🌱</Text>
            <Text style={styles.title}>
              {mode === 'login' ? 'Welcome back' : 'Join EcoQuest'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Sign in with your official Thapar student email ID'
                : 'Create your account using your official Thapar student email ID'}
            </Text>
          </View>

          {// Toggle tabs }
          <View style={styles.toggleRow}>
            {['login', 'signup'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.toggleBtn, mode === m && styles.toggleActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {// Form }
          <View style={styles.form}>
            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Arjun Kumar"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </>
            )}

            <Text style={styles.label}>Student Email ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. akumar4_be25@thapar.edu"
              placeholderTextColor={COLORS.textMuted}
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
                
            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Roll No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1025045283"
                  placeholderTextColor={COLORS.textMuted}
                  value={rollNo}
                  onChangeText={setRollNo}
                  autoCapitalize="none"
                />
              </>
            )}

            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Branch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. COE, ECE, ME"
                  placeholderTextColor={COLORS.textMuted}
                  value={branch}
                  onChangeText={setBranch}
                  autoCapitalize="characters"
                />
              </>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />

            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnLoading]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.submitText}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                🔒 Only official Thapar student Email IDs (@thapar.edu) are accepted.
                Your account is linked to your roll number.
              </Text>
            </View>
          </View>

          <View style={{ height: SPACING.xxl * 2 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1, paddingHorizontal: SPACING.base },

  backBtn: { padding: SPACING.base, paddingBottom: SPACING.base },
  backText: { paddingTop: SPACING.md, fontSize: 14, fontWeight: FONTS.semibold, color: COLORS.primary },

  header: { alignItems: 'center', paddingVertical: SPACING.xl },
  logoEmoji: { fontSize: 44, marginBottom: SPACING.md },
  title: {
    fontSize: 26,
    fontWeight: FONTS.heavy,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.white },

  form: {},
  label: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  forgotBtn: { alignSelf: 'flex-end', marginTop: SPACING.sm },
  forgotText: { fontSize: 12, color: COLORS.primary, fontWeight: FONTS.semibold },

  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    padding: SPACING.base,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  submitBtnLoading: { backgroundColor: COLORS.primarySoft },
  submitText: { color: COLORS.white, fontSize: 15, fontWeight: FONTS.heavy },

  noteBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.xl,
  },
  noteText: { fontSize: 12, color: COLORS.primaryDark, lineHeight: 18 },
});
*/

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function LoginScreen({ navigation, route }) {
  const [mode, setMode]           = useState('login');
  const [studentId, setStudentId] = useState('');
  const [rollNo, setRollNo]       = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [branch, setBranch]       = useState('');
  const [loading, setLoading]     = useState(false);

  // ✅ Use route params (from HomeScreen)
  useEffect(() => {
    if (route?.params?.mode) {
      setMode(route.params.mode);
    }
  }, [route?.params]);

  const handleSubmit = () => {
    if (!studentId || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && (!name || !branch)) {
      Alert.alert('Missing fields', 'Please fill in your name and branch.');
      return;
    }

    setLoading(true);

    // simulate API
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('dashboard');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >

          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoEmoji}>🌱</Text>

            <Text style={styles.title}>
              {mode === 'login' ? 'Welcome back' : 'Join EcoQuest'}
            </Text>

            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Sign in with your official Thapar student email ID'
                : 'Create your account using your official Thapar student email ID'}
            </Text>
          </View>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            {['login', 'signup'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.toggleBtn, mode === m && styles.toggleActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={styles.form}>

            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Arjun Kumar"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </>
            )}

            <Text style={styles.label}>Student Email ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. akumar4_be25@thapar.edu"
              placeholderTextColor={COLORS.textMuted}
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Roll No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1025045283"
                  placeholderTextColor={COLORS.textMuted}
                  value={rollNo}
                  onChangeText={setRollNo}
                />

                <Text style={styles.label}>Branch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. COE, ECE, ME"
                  placeholderTextColor={COLORS.textMuted}
                  value={branch}
                  onChangeText={setBranch}
                  autoCapitalize="characters"
                />
              </>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {mode === 'login' && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnLoading]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                🔒 Only official Thapar student Email IDs (@thapar.edu) are accepted.
              </Text>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
