import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyB_g6-jThDLrizwKlgHhaef6Oxgt2vDxT4',
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'peer-sphere-4b028.firebaseapp.com',
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'peer-sphere-4b028',
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'peer-sphere-4b028.firebasestorage.app',
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '941071821689',
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:941071821689:web:090f2c612dede133069da8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const demoUsers = [
	{
		email: 'admin@peersphere.com',
		password: 'Admin123!',
		name: 'Admin User',
		year: 'MCA' as const,
		batch: '2023',
		interests: ['Programming', 'Administration'],
		isAdmin: true,
	},
	{
		email: 'alice.chen@example.com',
		password: 'Demo123!',
		name: 'Alice Chen',
		year: '2nd' as const,
		batch: '2024',
		interests: ['Programming', 'Web Development', 'UI/UX Design', 'Photography'],
	},
	{
		email: 'bob.singh@example.com',
		password: 'Demo123!',
		name: 'Bob Singh',
		year: '3rd' as const,
		batch: '2023',
		interests: ['Data Science', 'AI/ML', 'Gaming', 'Sports'],
	},
	{
		email: 'carol.williams@example.com',
		password: 'Demo123!',
		name: 'Carol Williams',
		year: '1st' as const,
		batch: '2025',
		interests: ['Mobile Apps', 'Music', 'Art', 'Reading'],
	},
	{
		email: 'david.lee@example.com',
		password: 'Demo123!',
		name: 'David Lee',
		year: 'MCA' as const,
		batch: '2023',
		interests: ['Cybersecurity', 'Cloud Computing', 'IoT', 'Travel'],
	},
	{
		email: 'emma.brown@example.com',
		password: 'Demo123!',
		name: 'Emma Brown',
		year: '2nd' as const,
		batch: '2024',
		interests: ['Web Development', 'UI/UX Design', 'Photography', 'Cooking'],
	},
	{
		email: 'frank.martinez@example.com',
		password: 'Demo123!',
		name: 'Frank Martinez',
		year: '3rd' as const,
		batch: '2023',
		interests: ['Programming', 'Gaming', 'Sports', 'Music'],
	},
];

async function seedUsers() {
	console.log('Starting user seed...');

	try {
		// Check if users already exist
		const usersSnapshot = await getDocs(collection(db, 'users'));
		if (usersSnapshot.size > 0) {
			console.log('⚠️  Users already exist. Skipping seed.');
			console.log(`Found ${usersSnapshot.size} existing users.`);
			return;
		}

		console.log('Creating demo users...');

		for (const userData of demoUsers) {
			try {
				// Create auth user
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					userData.email,
					userData.password
				);

				const uid = userCredential.user.uid;

				// Create user document
				await setDoc(doc(db, 'users', uid), {
					uid,
					email: userData.email,
					name: userData.name,
					year: userData.year,
					batch: userData.batch,
					interests: userData.interests,
					isAdmin: userData.isAdmin || false,
					avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random&size=128`,
					createdAt: new Date(),
				});

				console.log(`✅ Created user: ${userData.name} (${userData.email})`);
			} catch (error: any) {
				console.error(`❌ Error creating user ${userData.name}:`, error.message);
			}
		}

		console.log('\n✅ User seed completed!');
		console.log('\n📝 Demo users created:');
		demoUsers.forEach(user => {
			const password = user.isAdmin ? 'Admin123!' : 'Demo123!';
			const adminBadge = user.isAdmin ? ' [ADMIN]' : '';
			console.log(`   - ${user.name}${adminBadge} (${user.email})`);
			console.log(`     Password: ${password}`);
		});
		console.log('\n🎉 You can now log in with any of these accounts!');
		console.log('\n🔑 Admin Account: admin@peersphere.com / Admin123!');
	} catch (error) {
		console.error('Error seeding users:', error);
	}
}

// Run the seed
seedUsers()
	.then(() => process.exit(0))
	.catch(error => {
		console.error('Fatal error:', error);
		process.exit(1);
	});
