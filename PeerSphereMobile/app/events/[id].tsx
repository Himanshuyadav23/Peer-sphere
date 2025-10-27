import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { onAuthChange } from '@/lib/auth';
import { getEvent, rsvpToEvent, cancelRsvp } from '@/lib/events';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params?.id as string;
  
  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!eventId) return;
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!event?.attendees) return;
    loadAttendees();
  }, [event]);

  async function loadEvent() {
    try {
      setLoading(true);
      const data = await getEvent(eventId);
      if (!data) {
        Alert.alert('Error', 'Event not found');
        router.back();
        return;
      }
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
      Alert.alert('Error', 'Failed to load event');
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendees() {
    if (!event?.attendees?.length) {
      setAttendees([]);
      return;
    }

    const userPromises = event.attendees.map((uid: string) =>
      onSnapshot(doc(getDb(), 'users', uid), (snap) => {
        if (snap.exists()) {
          return { uid, ...snap.data() };
        }
      })
    );

    try {
      const users = await Promise.all(userPromises);
      setAttendees(users);
    } catch (error) {
      console.error('Error loading attendees:', error);
    }
  }

  const isAttending = event?.attendees?.includes(user?.uid) || false;

  async function handleRSVP() {
    if (!user?.uid || !eventId) return;
    setRsvpLoading(true);
    try {
      if (isAttending) {
        await cancelRsvp(eventId, user.uid);
        Alert.alert('Success', 'RSVP cancelled');
      } else {
        await rsvpToEvent(eventId, user.uid);
        Alert.alert('Success', 'Successfully RSVP\'d!');
      }
      loadEvent();
    } catch (error: any) {
      console.error('Error toggling RSVP:', error);
      Alert.alert('Error', error.message || 'Failed to RSVP');
    } finally {
      setRsvpLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Event Not Found</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{event.title}</Text>
      </View>

      <View style={styles.content}>
        {/* Event Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <View>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>{event.venue}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👥</Text>
            <View>
              <Text style={styles.detailLabel}>Attendees</Text>
              <Text style={styles.detailValue}>{(event.attendees || []).length} people</Text>
            </View>
          </View>
        </View>

        {/* RSVP Button */}
        <TouchableOpacity
          style={[styles.rsvpButton, isAttending && styles.rsvpButtonCancel]}
          onPress={handleRSVP}
          disabled={rsvpLoading}
        >
          {rsvpLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.rsvpButtonText}>
              {isAttending ? 'Cancel RSVP' : 'RSVP to Event'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Attendees */}
        {attendees.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendees ({attendees.length})</Text>
            {attendees.map((attendee, index) => (
              <View key={index} style={styles.attendeeCard}>
                <View style={styles.attendeeAvatar}>
                  <Text style={styles.attendeeInitials}>
                    {attendee.name?.substring(0, 2).toUpperCase() || 'A'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.attendeeName}>{attendee.name || 'Anonymous'}</Text>
                  {attendee.year && (
                    <Text style={styles.attendeeYear}>{attendee.year} Year</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  detailsSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  rsvpButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  rsvpButtonCancel: {
    backgroundColor: '#ef4444',
  },
  rsvpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeInitials: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  attendeeYear: {
    fontSize: 14,
    color: '#6b7280',
  },
});
