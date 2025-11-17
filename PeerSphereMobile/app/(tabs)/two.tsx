import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Image, Linking, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, onAuthChange, logout } from '@/lib/auth';
import { getDoc, doc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { type UserDoc } from '@/lib/types';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const auth = getFirebaseAuth();
  const [user, setUser] = useState<any>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [pwLoading, setPwLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
      await loadUserDoc(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  async function loadUserDoc(uid: string) {
    try {
      setLoading(true);
      const snap = await getDoc(doc(getDb(), 'users', uid));
      if (snap.exists()) {
        setUserDoc(snap.data() as UserDoc);
      }
    } catch (error) {
      console.error('Error loading user doc:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  async function handleChangePassword() {
    const currentUser = auth.currentUser;
    if (!currentUser?.email) {
      Alert.alert('Error', 'You must be logged in to change password');
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    try {
      setPwLoading(true);
      // Reauthenticate before sensitive operation
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      Alert.alert('Success', 'Password updated successfully');
    } catch (error: any) {
      console.error('Error changing password:', error);
      const message = error?.code === 'auth/wrong-password' 
        ? 'Current password is incorrect'
        : (error?.message || 'Failed to change password');
      Alert.alert('Error', message);
    } finally {
      setPwLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: userDoc?.avatarUrl || user?.photoURL || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userDoc?.name || user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Year</Text>
          <Text style={styles.value}>{userDoc?.year || 'Not set'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Batch</Text>
          <Text style={styles.value}>{userDoc?.batch || 'Not set'}</Text>
        </View>

        {userDoc?.interests && userDoc.interests.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Interests</Text>
            <Text style={styles.value}>{userDoc.interests.join(', ')}</Text>
          </View>
        )}
      </View>

      {/* Change Password Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.passwordToggleButton}
          onPress={() => setShowPasswordForm(!showPasswordForm)}
        >
          <Text style={styles.passwordToggleText}>
            {showPasswordForm ? '▼ Hide Change Password' : '▶ Change Password'}
          </Text>
        </TouchableOpacity>

        {showPasswordForm && (
          <View style={styles.passwordForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="At least 8 characters"
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat new password"
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[styles.passwordButton, pwLoading && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={pwLoading}
            >
              {pwLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.passwordButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Creator Attribution */}
      <View style={styles.creatorSection}>
        <Text style={styles.creatorText}>Built by</Text>
        <TouchableOpacity 
          onPress={() => Linking.openURL('https://himanshuuyadav.netlify.app/')}
        >
          <Text style={styles.creatorLink}>Himanshu Yadav</Text>
        </TouchableOpacity>
        <Text style={styles.creatorSubtext}>Made with ❤️ for SCSIT DAVV</Text>
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
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#6366f1',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#e0e7ff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  creatorSection: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 20,
  },
  creatorText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  creatorLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 4,
  },
  creatorSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  passwordToggleButton: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  passwordToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  passwordForm: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginTop: 8,
  },
  passwordButton: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  passwordButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
