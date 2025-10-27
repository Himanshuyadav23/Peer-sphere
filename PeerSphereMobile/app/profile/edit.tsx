import { StyleSheet, ScrollView, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import type { UserDoc } from '@/lib/types';

const INTEREST_OPTIONS = [
  'Programming', 'Web Development', 'Mobile Apps', 'Data Science', 'AI/ML',
  'Cybersecurity', 'Cloud Computing', 'IoT', 'Blockchain', 'UI/UX Design',
  'Gaming', 'Music', 'Sports', 'Art', 'Photography', 'Reading', 'Travel', 'Cooking'
];

const COURSE_OPTIONS = [
  'BCA',
  'M.Sc. (Integrated) Cyber Security',
  'MCA',
  'M.Sc. (Computer Science)',
  'M.Sc. (Information Technology)',
  'MBA (Computer Management)',
  'PGDCA',
  'M.Tech (Computer Science)',
  'M.Tech (Information Architecture & Software Engineering)',
  'M.Tech (Network Management & Information Security)',
  'Other'
];

export default function EditProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    year: '',
    batch: '',
    interests: [] as string[],
    avatarUrl: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
      await loadProfile(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  async function loadProfile(uid: string) {
    try {
      setLoading(true);
      const snap = await getDoc(doc(getDb(), 'users', uid));
      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        setFormData({
          name: data.name || '',
          course: data.course || '',
          year: data.year || '',
          batch: data.batch || '',
          interests: data.interests || [],
          avatarUrl: data.avatarUrl || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user?.uid) return;

    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(getDb(), 'users', user.uid), formData);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  function toggleInterest(interest: string) {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Course</Text>
          <View style={styles.selectWrapper}>
            <Text style={styles.selectText}>{formData.course || 'Select course'}</Text>
          </View>
          {COURSE_OPTIONS.map(course => (
            <TouchableOpacity
              key={course}
              style={[
                styles.selectOption,
                formData.course === course && styles.selectOptionActive
              ]}
              onPress={() => setFormData({ ...formData, course })}
            >
              <Text style={[
                styles.selectOptionText,
                formData.course === course && styles.selectOptionTextActive
              ]}>
                {course}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year</Text>
          <View style={styles.row}>
            {['1st', '2nd', '3rd', '4th', '5th'].map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearButton,
                  formData.year === year && styles.yearButtonActive
                ]}
                onPress={() => setFormData({ ...formData, year })}
              >
                <Text style={[
                  styles.yearButtonText,
                  formData.year === year && styles.yearButtonTextActive
                ]}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Batch</Text>
          <View style={styles.row}>
            {['2021', '2022', '2023', '2024', '2025'].map(batch => (
              <TouchableOpacity
                key={batch}
                style={[
                  styles.yearButton,
                  formData.batch === batch && styles.yearButtonActive
                ]}
                onPress={() => setFormData({ ...formData, batch })}
              >
                <Text style={[
                  styles.yearButtonText,
                  formData.batch === batch && styles.yearButtonTextActive
                ]}>
                  {batch}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interests</Text>
          <View style={styles.interestsContainer}>
            {INTEREST_OPTIONS.map(interest => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestButton,
                  formData.interests.includes(interest) && styles.interestButtonActive
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.interestButtonText,
                  formData.interests.includes(interest) && styles.interestButtonTextActive
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Avatar URL</Text>
          <TextInput
            style={styles.input}
            value={formData.avatarUrl}
            onChangeText={(text) => setFormData({ ...formData, avatarUrl: text })}
            placeholder="Enter image URL"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  selectWrapper: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
  },
  selectOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectOptionActive: {
    backgroundColor: '#eef2ff',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  selectOptionTextActive: {
    fontWeight: '600',
    color: '#6366f1',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  yearButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  yearButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  yearButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  interestButtonActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#6366f1',
  },
  interestButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  interestButtonTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
