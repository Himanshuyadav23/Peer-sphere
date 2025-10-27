# Peer Sphere - Bugs and Features Analysis

## 🐛 CRITICAL BUGS

### 1. **Missing `getAllEvents` Function** ❌
**Location:** `lib/events.ts`  
**Issue:** Mobile app tries to call `getAllEvents()` but it doesn't exist in the web app  
**Impact:** Mobile dashboard and events page will crash  
**Files Affected:**
- `PeerSphereMobile/app/(tabs)/index.tsx` (line 17)
- `PeerSphereMobile/app/(tabs)/events.tsx` (line 17)

**Fix Required:**
```typescript
export async function getAllEvents(): Promise<EventDoc[]> {
	const db = getDb();
	const snap = await getDocs(collection(db, 'events'));
	return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as EventDoc));
}
```

### 2. **No RSVP Cancellation Function** ❌
**Location:** `lib/events.ts`  
**Issue:** Mobile app calls `cancelRsvp()` and `rsvpToEvent()` but only `rsvpEvent` exists  
**Impact:** Users can't cancel event RSVPs on mobile  
**Fix Required:**
```typescript
export async function rsvpToEvent(eventId: string, uid: string) {
	const db = getDb();
	await updateDoc(doc(db, 'events', eventId), { 
		attendees: arrayUnion(uid) 
	});
}

export async function cancelRsvp(eventId: string, uid: string) {
	const db = getDb();
	await updateDoc(doc(db, 'events', eventId), { 
		attendees: arrayRemove(uid) 
	});
}
```

### 3. **Missing Firestore Permissions for Notifications** ❌
**Location:** `firestore.rules`  
**Issue:** Notification bell queries notifications but no rules exist  
**Impact:** Permission errors in console  
**Fix Required:** Add rules:
```javascript
match /notifications/{notificationId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow write: if request.auth != null;
}
```

### 4. **Incomplete Dashboard Implementation** ⚠️
**Location:** `app/(protected)/dashboard/page.tsx`  
**Issue:** Dashboard is just a placeholder, not functional like mobile version  
**Impact:** Web users see empty dashboard  
**Fix:** Implement proper dashboard with communities, events, matches

### 5. **Duplicate Event Page File** ⚠️
**Location:** `app/events/[id]/.tsx`  
**Issue:** Duplicate file with wrong extension (`.tsx` instead of `page.tsx`)  
**Impact:** Potential routing issues  
**Fix:** Delete the duplicate file

## 🚨 MAJOR MISSING FEATURES

### 1. **Profile Setup/Editing Page** ❌
**Location:** Missing  
**Issue:** Profile setup page exists but no way to edit profile later  
**Impact:** Users can't update their year, batch, or interests after initial setup  
**Required Files:**
- `app/profile/setup/page.tsx` - Already exists
- Need: Profile edit functionality

### 2. **Message Notifications Not Properly Implemented** ❌
**Location:** `lib/messages.ts` line 21  
**Issue:** Creates notifications but no notification rules exist in Firestore  
**Impact:** Notifications won't work  

### 3. **No Event RSVP List View** ❌
**Location:** Missing  
**Issue:** Can't see who's attending an event  
**Impact:** Users don't know who's going to events  
**Suggested:** Add attendee list to event detail page

### 4. **No Search/Filter for Communities** ⚠️
**Location:** `app/communities/page.tsx`  
**Issue:** Search exists but very basic, no advanced filters  
**Impact:** Hard to find specific communities  

### 5. **No Error Handling in Firestore Queries** ⚠️
**Location:** Multiple files  
**Issue:** Missing try-catch blocks in many Firestore operations  
**Impact:** App crashes on Firebase errors  
**Files Affected:**
- `app/communities/page.tsx`
- `app/events/page.tsx`
- `components/notifications-bell.tsx`

### 6. **Missing Type Definitions** ⚠️
**Location:** `lib/types.ts`  
**Issue:** Some mobile app types are missing  
**Required:** Add any missing types

## 🔧 MEDIUM PRIORITY ISSUES

### 1. **Missing Avatar Image Display** ⚠️
**Location:** `components/user-menu.tsx`  
**Issue:** Avatar image source is empty string  
**Fix:** Use user's avatarUrl from Firestore

### 2. **No Loading States on Many Pages** ⚠️
**Location:** Multiple pages  
**Issue:** No loading indicators while data loads  
**Impact:** Confusing UX during slow connections  

### 3. **Firestore Index Missing** ⚠️
**Location:** `app/communities/my/page.tsx`  
**Issue:** Queries communities with `where('members', 'array-contains', uid)`  
**Impact:** May cause performance issues with large datasets  
**Fix:** Create Firestore index

### 4. **No Pagination** ⚠️
**Location:** Multiple list pages  
**Issue:** All data loads at once  
**Impact:** Slow with large datasets  
**Suggested:** Implement pagination for communities, events, matches

### 5. **Mobile App Missing Complete Implementation** ⚠️
**Location:** `PeerSphereMobile/`  
**Issue:** Many screens referenced but not fully implemented  
**Missing:**
- Complete profile pages
- Events functionality (needs getAllEvents)
- Messages UI
- Community creation

## ✨ NICE-TO-HAVE FEATURES

### 1. **Real-time Online Status**
- Show when users are online
- Update status in real-time

### 2. **Event Calendar View**
- Calendar interface for events
- Monthly/weekly views

### 3. **Community Analytics**
- Member count trends
- Activity metrics

### 4. **In-app Notifications**
- Toast notifications
- Push notifications (mobile)

### 5. **Message Attachments**
- Image sharing
- File attachments

### 6. **Community Roles**
- Admins, moderators
- Permission system

### 7. **Event Polls**
- Voting on event details
- RSVP options (going, maybe, not going)

### 8. **Advanced Match Algorithm**
- Machine learning suggestions
- Activity-based matching

### 9. **Event Recommendations**
- Personalized event suggestions
- Community-based recommendations

### 10. **Content Moderation**
- Report inappropriate content
- Admin dashboard

## 📝 SUMMARY

### Must Fix (Critical):
1. ✅ Add `getAllEvents()` function
2. ✅ Add RSVP cancellation functions
3. ✅ Add notification Firestore rules
4. ✅ Implement proper dashboard
5. ✅ Remove duplicate event file

### Should Fix (Major):
1. ✅ Profile editing functionality
2. ✅ Event attendee list view
3. ✅ Better error handling
4. ✅ Missing Firestore indexes
5. ✅ Complete mobile app implementation

### Could Improve (Nice-to-have):
1. Advanced search/filtering
2. Pagination
3. Real-time features
4. Analytics
5. Enhanced matchmaking

## 🎯 RECOMMENDED DEVELOPMENT ORDER

1. **Fix critical bugs** (1-2 days)
2. **Implement missing core functions** (2-3 days)
3. **Complete mobile app features** (3-5 days)
4. **Add error handling and loading states** (2 days)
5. **Implement nice-to-have features** (ongoing)

Total estimated time for core fixes: **10-15 days**
