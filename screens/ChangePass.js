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
const ChangePassword = ({ navigate }) => {
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const isMatch =
newPassword.length > 0 &&
confirmPassword.length > 0 &&
newPassword === confirmPassword;
return (
<SafeAreaView style={styles.container}>
<ScrollView showsVerticalScrollIndicator={false}>
<View style={styles.content}>
<Text style={styles.title}>Change Password</Text>
<View style={styles.inputContainer}>
<Text style={styles.label}>New Password</Text>
<TextInput
value={newPassword}
onChangeText={setNewPassword}
placeholder="Enter new password"
placeholderTextColor={COLORS.textMuted}
secureTextEntry
style={styles.input}
/>
</View>
<View style={styles.inputContainer}>
<Text style={styles.label}>Confirm Password</Text>
<TextInput
value={confirmPassword}
onChangeText={setConfirmPassword}
placeholder="Confirm password"
placeholderTextColor={COLORS.textMuted}
secureTextEntry
style={styles.input}
/>
</View>
<TouchableOpacity
style={[
styles.button,
isMatch ? styles.buttonActive : styles.buttonDisabled,
]}
disabled={!isMatch}
onPress={() => navigate('dashboard')}
>
<Text
style={[
styles.buttonText,
isMatch ? styles.buttonTextActive : styles.buttonTextDisabled,
]}
>
Change
</Text>
</TouchableOpacity>
</View>
</ScrollView>
</SafeAreaView>
);
};
export default ChangePassword;
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.bgPage,
},
content: {
padding: SPACING.xl,
},
title: {
fontSize: 22,
fontWeight: FONTS.bold,
color: COLORS.textPrimary,
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
button: {
marginTop: SPACING.xl,
paddingVertical: SPACING.md,
borderRadius: RADIUS.pill,
alignItems: 'center',
},
buttonActive: {
backgroundColor: COLORS.primary,
shadowColor: COLORS.primary,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.4,
shadowRadius: 8,
elevation: 6,
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
