import { StyleSheet, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { onAuthChange } from '@/lib/auth';
import { listenToRecentConversations } from '@/lib/messages';
import { type MessageDoc } from '@/lib/types';
import { getDoc, doc } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';

export default function MessagesScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      if (!currentUser) {
        router.replace('/(auth)/login');
        return;
      }
      setUser(currentUser);
      await loadConversations(currentUser.uid);
    });

    return () => unsubscribe();
  }, []);

  async function loadConversations(uid: string) {
    try {
      setLoading(true);
      const unsubscribe = listenToRecentConversations(uid, async (messages) => {
        // Get unique conversation partners
        const partners = new Map<string, any>();
        
        for (const msg of messages) {
          const partnerId = msg.senderId === uid ? msg.receiverId : msg.senderId;
          if (!partners.has(partnerId)) {
            try {
              const userSnap = await getDoc(doc(getDb(), 'users', partnerId));
              if (userSnap.exists()) {
                partners.set(partnerId, {
                  id: partnerId,
                  name: userSnap.data().name,
                  avatarUrl: userSnap.data().avatarUrl,
                  lastMessage: msg.text,
                  timestamp: msg.timestamp,
                });
              }
            } catch (error) {
              console.error('Error loading partner:', error);
            }
          }
        }
        
        setConversations(Array.from(partners.values()));
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading conversations:', error);
      setLoading(false);
    }
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
        <Text style={styles.title}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation!</Text>
        </View>
      ) : (
        conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationCard}
            onPress={() => {
              // Navigate to chat screen with this user
              router.push(`/messages/${conversation.id}`);
            }}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {conversation.name?.[0]?.toUpperCase() || '?'}
                </Text>
              </View>
            </View>
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>{conversation.name}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))
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
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  conversationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  conversationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
  },
});









