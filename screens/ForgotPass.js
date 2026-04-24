import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from 'react-native';

import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const ForgotPass = ({ navigate, userEmail }) => {
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(null);

  const handleVerify = (value) => {
    setEmail(value);

    if (value.length === 0) {
      setVerified(null);
      return;
    }

    if (value.trim().toLowerCase() === userEmail?.toLowerCase()) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  };

  const handleContinue = () => {
    if (verified) {
      navigate('change password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.wrapper}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email to continue
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email ID</Text>
            <TextInput
              value={email}
              onChangeText={handleVerify}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
            />
          </View>

          {verified !== null && (
            <View
              style={[
                styles.messageBox,
                verified ? styles.successBox : styles.errorBox,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  verified ? styles.successText : styles.errorText,
                ]}
              >
                {verified
                  ? '✓ Email ID verified successfully'
                  : '✕ Email ID not verified'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={verified ? 0.8 : 1}
            style={[
              styles.button,
              verified ? styles.buttonActive : styles.buttonDisabled,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                verified ? styles.buttonTextActive : styles.buttonTextDisabled,
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
  },

  wrapper: {
    padding: SPACING.xl,
  },

  title: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },

  inputContainer: {
    marginBottom: SPACING.lg,
  },

  label: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  messageBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },

  successBox: {
    backgroundColor: COLORS.primaryLight,
  },

  errorBox: {
    backgroundColor: COLORS.dangerLight,
  },

  messageText: {
    fontSize: 14,
    fontWeight: FONTS.medium,
  },

  successText: {
    color: COLORS.primaryDark,
  },

  errorText: {
    color: COLORS.dangerDark,
  },

  button: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },

  buttonActive: {
    backgroundColor: COLORS.primary,
  },

  buttonDisabled: {
    backgroundColor: COLORS.borderMid,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: FONTS.semibold,
  },

  buttonTextActive: {
    color: COLORS.white,
  },

  buttonTextDisabled: {
    color: COLORS.textMuted,
  },
});