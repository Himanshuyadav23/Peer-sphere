import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, onAuthChange, logout } from '@/lib/auth';
import { getDoc, doc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { type UserDoc } from '@/lib/types';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

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
});
