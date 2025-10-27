import { StyleSheet, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { onAuthChange } from '@/lib/auth';
import { getAllEvents, rsvpToEvent, cancelRsvp } from '@/lib/events';
import { type EventDoc } from '@/lib/types';

export default function EventsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

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
      const allEvents = await getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRSVP(eventId: string, isAttending: boolean) {
    try {
      setRsvpLoading(eventId);
      if (isAttending) {
        await cancelRsvp(eventId);
      } else {
        await rsvpToEvent(eventId);
      }
      await loadData(); // Reload to get updated attendee count
    } catch (error) {
      console.error('Error toggling RSVP:', error);
    } finally {
      setRsvpLoading(null);
    }
  }

  const isAttending = (event: EventDoc) => user && event.attendees.includes(user.uid);

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
        <Text style={styles.title}>Events</Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events scheduled yet</Text>
        </View>
      ) : (
        events.map((event) => {
          const attending = isAttending(event);
          return (
            <View key={event.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                {attending && (
                  <View style={styles.rsvpBadge}>
                    <Text style={styles.rsvpBadgeText}>Attending</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardDescription}>{event.description}</Text>
              
              <View style={styles.eventInfo}>
                <Text style={styles.eventDetail}>
                  📅 {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
                <Text style={styles.eventDetail}>🕐 {event.time}</Text>
                <Text style={styles.eventDetail}>📍 {event.venue}</Text>
                <Text style={styles.eventDetail}>
                  👥 {event.attendees.length} attending
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, attending && styles.buttonCancel]}
                onPress={() => handleRSVP(event.id, attending)}
                disabled={rsvpLoading === event.id}
              >
                <Text style={styles.buttonText}>
                  {rsvpLoading === event.id 
                    ? 'Loading...' 
                    : attending 
                    ? 'Cancel RSVP' 
                    : 'RSVP'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
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
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
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
  rsvpBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rsvpBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  eventInfo: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  eventDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});


