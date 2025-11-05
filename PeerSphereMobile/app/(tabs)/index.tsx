import { StyleSheet, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { onAuthChange } from '@/lib/auth';
import { type Community, type EventDoc } from '@/lib/types';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    // Load my communities with real-time updates
    const q1 = query(
      collection(getDb(), 'communities'),
      where('members', 'array-contains', user.uid),
      limit(5)
    );
    const unsub1 = onSnapshot(q1, (snap) => {
      const communities = snap.docs
        .map(d => ({ id: d.id, ...(d.data() as any) } as Community))
        .filter(c => !c.deleted); // Filter out deleted communities
      setCommunities(communities);
    }, (error) => {
      console.error('Error loading communities:', error);
    });

    // Load upcoming events with real-time updates
    const q2 = query(collection(getDb(), 'events'), limit(5));
    const unsub2 = onSnapshot(q2, (snap) => {
      const events = snap.docs
        .map(d => ({ id: d.id, ...(d.data() as any) } as EventDoc))
        .filter(e => !e.deleted) // Filter out deleted events
        .sort((a, b) => {
          // Sort by date
          const aDate = new Date(a.date).getTime();
          const bDate = new Date(b.date).getTime();
          return aDate - bDate;
        });
      setUpcomingEvents(events);
    }, (error) => {
      console.error('Error loading events:', error);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [user?.uid]);

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
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
            <TouchableOpacity 
              key={community.id} 
              style={styles.card}
              onPress={() => router.push(`/communities/${community.id}`)}
            >
              <Text style={styles.cardTitle}>{community.name}</Text>
              <Text style={styles.cardSubtitle}>{community.description}</Text>
              <Text style={styles.cardMeta}>{community.members?.length || 0} members</Text>
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
            <TouchableOpacity 
              key={event.id} 
              style={styles.card}
              onPress={() => router.push(`/events/${event.id}`)}
            >
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardSubtitle}>
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </Text>
              <Text style={styles.cardSubtitle}>📍 {event.venue}</Text>
              {event.attendees && (
                <Text style={styles.cardMeta}>{event.attendees.length} attending</Text>
              )}
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
  cardMeta: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    fontWeight: '500',
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
