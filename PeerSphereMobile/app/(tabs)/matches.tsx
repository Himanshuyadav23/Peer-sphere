import { StyleSheet, ScrollView, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getCurrentUser, onAuthChange } from '@/lib/auth';
import { getSmartMatches } from '@/lib/matchmaking';

export default function MatchesScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
      await loadMatches(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  async function loadMatches(uid: string) {
    try {
      setLoading(true);
      const smartMatches = await getSmartMatches(uid, 20);
      setMatches(smartMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }

  function getMatchLevel(percentage: number) {
    if (percentage >= 80) return { label: 'Perfect Match', color: '#10b981', bg: '#d1fae5' };
    if (percentage >= 60) return { label: 'Great Match', color: '#3b82f6', bg: '#dbeafe' };
    if (percentage >= 40) return { label: 'Good Match', color: '#f59e0b', bg: '#fef3c7' };
    return { label: 'Potential Match', color: '#6b7280', bg: '#f3f4f6' };
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
        <Text style={styles.title}>Smart Matches</Text>
        <Text style={styles.subtitle}>Discover amazing students like you</Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No matches found</Text>
          <Text style={styles.emptyText}>
            Complete your profile to get better matches!
          </Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.profileButtonText}>Complete Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        matches.map((match) => {
          const percentage = Math.round(match.compatibilityScore || 0);
          const matchLevel = getMatchLevel(percentage);
          
          return (
            <View key={match.uid} style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {match.name?.[0]?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                </View>
                <View style={styles.matchInfo}>
                  <Text style={styles.matchName}>{match.name}</Text>
                  <View style={styles.matchDetails}>
                    {match.year && <Text style={styles.matchDetail}>{match.year} Year</Text>}
                    {match.batch && <Text style={styles.matchDetail}>• Batch {match.batch}</Text>}
                  </View>
                </View>
              </View>

              <View style={styles.matchScore}>
                <View style={[styles.matchBadge, { backgroundColor: matchLevel.bg }]}>
                  <Text style={[styles.matchBadgeText, { color: matchLevel.color }]}>
                    {matchLevel.label} • {percentage}%
                  </Text>
                </View>
              </View>

              {match.interests && match.interests.length > 0 && (
                <View style={styles.interestsContainer}>
                  <Text style={styles.interestsLabel}>Shared Interests:</Text>
                  <View style={styles.interestsList}>
                    {match.interests.slice(0, 3).map((interest: string, index: number) => (
                      <View key={index} style={styles.interestBadge}>
                        <Text style={styles.interestBadgeText}>{interest}</Text>
                      </View>
                    ))}
                    {match.interests.length > 3 && (
                      <Text style={styles.moreInterests}>+{match.interests.length - 3} more</Text>
                    )}
                  </View>
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => router.push(`/messages/${match.uid}`)}
                >
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => router.push(`/profile/${match.uid}`)}
                >
                  <Text style={styles.viewButtonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  matchCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  matchDetails: {
    flexDirection: 'row',
  },
  matchDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  matchScore: {
    marginBottom: 12,
  },
  matchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  matchBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  interestsContainer: {
    marginBottom: 12,
  },
  interestsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestBadgeText: {
    fontSize: 12,
    color: '#6366f1',
  },
  moreInterests: {
    fontSize: 12,
    color: '#6b7280',
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  connectButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
});
