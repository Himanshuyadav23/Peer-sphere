# Demo Users for PeerSphere

## Admin Account
- **Email:** admin@peersphere.com
- **Password:** Admin123!
- **Role:** Administrator (has access to admin panel)

## Regular Users
All users use the password: `Demo123!`

1. **Alice Chen** - alice.chen@example.com
   - 2nd Year, Batch 2024
   - Interests: Programming, Web Development, UI/UX Design, Photography

2. **Bob Singh** - bob.singh@example.com
   - 3rd Year, Batch 2023
   - Interests: Data Science, AI/ML, Gaming, Sports

3. **Carol Williams** - carol.williams@example.com
   - 1st Year, Batch 2025
   - Interests: Mobile Apps, Music, Art, Reading

4. **David Lee** - david.lee@example.com
   - MCA, Batch 2023
   - Interests: Cybersecurity, Cloud Computing, IoT, Travel

5. **Emma Brown** - emma.brown@example.com
   - 2nd Year, Batch 2024
   - Interests: Web Development, UI/UX Design, Photography, Cooking

6. **Frank Martinez** - frank.martinez@example.com
   - 3rd Year, Batch 2023
   - Interests: Programming, Gaming, Sports, Music

## To Create These Users Manually:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: peer-sphere-4b028
3. Go to Authentication > Users
4. Click "Add user" for each email above
5. Set the password as listed above
6. Go to Firestore Database
7. Create a document in the "users" collection for each user
8. Set the document ID to match the user's UID from Authentication
9. Add these fields to each document:
   - uid: (the user's UID)
   - email: (the email address)
   - name: (the user's name)
   - year: (1st, 2nd, 3rd, or MCA)
   - batch: (2023, 2024, or 2025)
   - interests: (an array of strings)
   - isAdmin: (true for admin, false for others)
   - avatarUrl: (you can generate one at https://ui-avatars.com)
   - createdAt: (current timestamp)

Example user document structure:
```json
{
  "uid": "user-uid-here",
  "email": "alice.chen@example.com",
  "name": "Alice Chen",
  "year": "2nd",
  "batch": "2024",
  "interests": ["Programming", "Web Development", "UI/UX Design", "Photography"],
  "isAdmin": false,
  "avatarUrl": "https://ui-avatars.com/api/?name=Alice%20Chen&background=random&size=128",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Quick Setup Alternative:

You can also just log in with the admin account and create users through the app's registration flow, then manually add the additional profile information through the Firestore console.
