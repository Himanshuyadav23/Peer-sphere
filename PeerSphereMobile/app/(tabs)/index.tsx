import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { getMyCommunities } from '@/lib/communities';
import { getAllEvents } from '@/lib/events';
import { type Community, type EventDoc } from '@/lib/types';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

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
      const userCommunities = await getMyCommunities();
      setCommunities(userCommunities);
      
      const events = await getAllEvents();
      setUpcomingEvents(events.slice(0, 5)); // Show next 5 events
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
        <Text style={styles.welcomeText}>Welcome back! 👋</Text>
        <Text style={styles.subtitle}>
          {user?.displayName || user?.email || 'User'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Communities ({communities.length})</Text>
        {communities.length === 0 ? (
          <Text style={styles.emptyText}>No communities yet</Text>
        ) : (
          communities.slice(0, 3).map((community) => (
            <TouchableOpacity key={community.id} style={styles.card}>
              <Text style={styles.cardTitle}>{community.name}</Text>
              <Text style={styles.cardSubtitle}>{community.description}</Text>
            </TouchableOpacity>
          ))
        )}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/communities')}
        >
          <Text style={styles.buttonText}>View All Communities</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events ({upcomingEvents.length})</Text>
        {upcomingEvents.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming events</Text>
        ) : (
          upcomingEvents.map((event) => (
            <TouchableOpacity key={event.id} style={styles.card}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardSubtitle}>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </Text>
              <Text style={styles.cardSubtitle}>📍 {event.venue}</Text>
            </TouchableOpacity>
          ))
        )}
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
    padding: 20,
    backgroundColor: '#6366f1',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
