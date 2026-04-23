import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';

import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const EditProfile = ({ navigation }) => {

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');
  const [age, setAge] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('dashboard')}
          >
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Edit Profile</Text>

          <TouchableOpacity>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.imageSection}>
          <Image
            style={styles.image}
            source={{ uri: 'https://via.placeholder.com/100' }}
          />

          <TouchableOpacity>
            <Text style={styles.editPhoto}>Edit Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={styles.form}>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Enter bio"
            value={bio}
            onChangeText={setBio}
          />

          <Text style={styles.label}>Link</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter link"
            value={link}
            onChangeText={setLink}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter age"
            value={age}
            onChangeText={setAge}
          />

        </View>

        {/* Buttons */}
        <View style={styles.buttons}>

          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>
              Save Changes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryText}>
              Cancel
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
    padding: SPACING.base,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  back: {
    color: COLORS.primary,
    fontSize: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },

  edit: {
    color: COLORS.primary,
  },

  imageSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
  },

  editPhoto: {
    marginTop: SPACING.sm,
    color: COLORS.primary,
  },

  form: {
    marginBottom: SPACING.lg,
  },

  label: {
    marginBottom: SPACING.xs,
    fontSize: 14,
  },

  input: {
    backgroundColor: '#fff',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  buttons: {
    marginTop: SPACING.md,
  },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SPACING.base,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },

  secondaryText: {
    color: COLORS.primary,
  },

});