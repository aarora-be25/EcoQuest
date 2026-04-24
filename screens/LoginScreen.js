import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { loginUser, signUpUser } from '../services/authService';

export default function LoginScreen({ navigation, route }) {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [rollNo, setRollNo]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [branch, setBranch]     = useState('');
  const [year, setYear]         = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (route?.params?.mode) setMode(route.params.mode);
  }, [route?.params]);

  // Roll No validation — must be exactly 10 digits
  const rollNoValid = rollNo.length === 10 && /^\d{10}$/.test(rollNo);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (mode === 'signup') {
      if (!name || !branch || !year || !rollNo) {
        Alert.alert('Missing fields', 'Please fill in all signup fields.');
        return;
      }
      if (!rollNoValid) {
        Alert.alert('Invalid Roll No.', 'Roll number must be exactly 10 digits.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginUser(email, password);
        navigation.replace('dashboard');
      } else {
        await signUpUser({ email, password, name, department: branch, year, rollNo });
        navigation.replace('dashboard');
      }
    } catch (error) {
      Alert.alert(mode === 'login' ? 'Login Failed' : 'Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
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
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {mode === 'signup' && (
              <>
                <Text style={styles.label}>Roll No. (10 digits)</Text>
                <TextInput
                  style={[styles.input, rollNo.length > 0 && !rollNoValid && styles.inputError]}
                  placeholder="e.g. 1025045283"
                  placeholderTextColor={COLORS.textMuted}
                  value={rollNo}
                  onChangeText={t => setRollNo(t.replace(/\D/g, '').slice(0, 10))}
                  keyboardType="numeric"
                  maxLength={10}
                />
                {rollNo.length > 0 && !rollNoValid && (
                  <Text style={styles.errorText}>
                    Roll number must be exactly 10 digits ({rollNo.length}/10)
                  </Text>
                )}

                <Text style={styles.label}>Branch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. COE, ECE, ME"
                  placeholderTextColor={COLORS.textMuted}
                  value={branch}
                  onChangeText={setBranch}
                  autoCapitalize="characters"
                />

                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1st Year, 2nd Year"
                  placeholderTextColor={COLORS.textMuted}
                  value={year}
                  onChangeText={setYear}
                />
              </>
            )}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              autoCapitalize="none"
              onChangeText={setPassword}
              secureTextEntry
            />

            {mode === 'login' && (
              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => navigation.navigate('forgotPassword')}
                activeOpacity={0.7}
              >
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

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.bgPage },
  scroll: { flex: 1, paddingHorizontal: SPACING.base },

  backBtn:  { padding: SPACING.base },
  backText: { paddingTop: SPACING.md, fontSize: 14, fontWeight: FONTS.semibold, color: COLORS.primary },

  header:    { alignItems: 'center', paddingVertical: SPACING.xl },
  logoEmoji: { fontSize: 44, marginBottom: SPACING.md },
  title:     { fontSize: 26, fontWeight: FONTS.heavy, color: COLORS.textPrimary, marginBottom: SPACING.sm, textAlign: 'center' },
  subtitle:  { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },

  toggleRow:        { flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, padding: 4, marginBottom: SPACING.xl },
  toggleBtn:        { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.pill, alignItems: 'center' },
  toggleActive:     { backgroundColor: COLORS.primary },
  toggleText:       { fontSize: 14, fontWeight: FONTS.bold, color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.white },

  form:  {},
  label: { fontSize: 12, fontWeight: FONTS.bold, color: COLORS.textSecondary, marginBottom: SPACING.xs, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, fontSize: 14, color: COLORS.textPrimary },
  inputError: { borderColor: COLORS.danger },
  errorText:  { fontSize: 11, color: COLORS.danger, marginTop: 4 },

  forgotBtn:  { alignSelf: 'flex-end', marginTop: SPACING.sm },
  forgotText: { fontSize: 12, color: COLORS.primary, fontWeight: FONTS.semibold },

  submitBtn:        { backgroundColor: COLORS.primary, borderRadius: RADIUS.pill, padding: SPACING.base, alignItems: 'center', marginTop: SPACING.xl },
  submitBtnLoading: { backgroundColor: COLORS.primarySoft },
  submitText:       { color: COLORS.white, fontSize: 15, fontWeight: FONTS.heavy },

  noteBox:  { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.xl },
  noteText: { fontSize: 12, color: COLORS.primaryDark, lineHeight: 18 },
});