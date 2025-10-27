import { StyleSheet, ScrollView, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { getAllCommunities, joinCommunity, leaveCommunity, getMyCommunities } from '@/lib/communities';
import { type Community } from '@/lib/types';

export default function CommunitiesScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
      await loadData();
    });

    return () => unsubscribe();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [all, myComms] = await Promise.all([
        getAllCommunities(),
        getMyCommunities()
      ]);
      setCommunities(all);
      setMyCommunities(myComms.map(c => c.id));
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(communityId: string) {
    try {
      await joinCommunity(communityId);
      setMyCommunities([...myCommunities, communityId]);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  }

  async function handleLeave(communityId: string) {
    try {
      await leaveCommunity(communityId);
      setMyCommunities(myCommunities.filter(id => id !== communityId));
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  }

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.title}>Communities</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredCommunities.map((community) => {
        const isJoined = myCommunities.includes(community.id);
        return (
          <View key={community.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{community.name}</Text>
              <View style={[styles.badge, { backgroundColor: isJoined ? '#10b981' : '#6b7280' }]}>
                <Text style={styles.badgeText}>
                  {community.members.length} members
                </Text>
              </View>
            </View>
            <Text style={styles.cardCategory}>{community.category}</Text>
            <Text style={styles.cardDescription}>{community.description}</Text>
            <TouchableOpacity
              style={[styles.button, isJoined && styles.buttonLeave]}
              onPress={() => isJoined ? handleLeave(community.id) : handleJoin(community.id)}
            >
              <Text style={styles.buttonText}>
                {isJoined ? 'Leave' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardCategory: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonLeave: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});


