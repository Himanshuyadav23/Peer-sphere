import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getDb } from './firebase';
import type { UserDoc } from './types';

export async function getTopMatches(currentUserId: string, limit = 5): Promise<Array<UserDoc & { score: number }>> {
	const db = getDb();
	const meSnap = await getDoc(doc(db, 'users', currentUserId));
	if (!meSnap.exists()) return [];
	const me = meSnap.data() as UserDoc;
	const meInterests = new Set((me.interests || []).map((i) => i.toLowerCase()));
	const usersSnap = await getDocs(collection(db, 'users'));
	const scored: Array<UserDoc & { score: number }> = [];
	usersSnap.forEach((d) => {
		if (d.id === currentUserId) return;
		const u = d.data() as UserDoc;
		const score = (u.interests || []).reduce((acc, it) => acc + (meInterests.has((it || '').toLowerCase()) ? 1 : 0), 0);
		// Include users even with score 0 to ensure matches show up
		scored.push({ ...(u as any), score });
	});
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, limit);
}

export async function getSmartMatches(currentUserId: string, limit = 20): Promise<Array<UserDoc & { score: number; compatibilityScore: number }>> {
	const db = getDb();
	const meSnap = await getDoc(doc(db, 'users', currentUserId));
	if (!meSnap.exists()) return [];
	const me = meSnap.data() as UserDoc;
	
	// Check if user has profile data
	if (!me.interests || me.interests.length === 0) {
		return [];
	}
	
	const usersSnap = await getDocs(collection(db, 'users'));
	const scored: Array<UserDoc & { score: number; compatibilityScore: number }> = [];
	
	// Get current user's profile data
	const meInterests = new Set((me.interests || []).map((i) => i.toLowerCase()));
	const meYear = me.year;
	const meBatch = me.batch;
	
	usersSnap.forEach((d) => {
		if (d.id === currentUserId) return;
		const u = d.data() as UserDoc;
		
		// Skip users without interests
		if (!u.interests || u.interests.length === 0) return;
		
		// Calculate interest compatibility
		const interestMatches = (u.interests || []).reduce((acc, it) => 
			acc + (meInterests.has((it || '').toLowerCase()) ? 1 : 0), 0);
		
		// Calculate year compatibility (prefer same year, then adjacent years)
		let yearScore = 0;
		if (meYear && u.year) {
			const yearOrder = ['1st', '2nd', '3rd', '4th', '5th'];
			const meYearIndex = yearOrder.indexOf(meYear);
			const uYearIndex = yearOrder.indexOf(u.year);
			
			if (meYearIndex !== -1 && uYearIndex !== -1) {
				const yearDiff = Math.abs(meYearIndex - uYearIndex);
				if (yearDiff === 0) yearScore = 3; // Same year
				else if (yearDiff === 1) yearScore = 2; // Adjacent years
				else if (yearDiff === 2) yearScore = 1; // Two years apart
			}
		}
		
		// Calculate batch compatibility (bonus for same batch)
		const batchScore = (meBatch && u.batch && meBatch === u.batch) ? 2 : 0;
		
		// Only include users with at least some compatibility
		if (interestMatches > 0 || yearScore > 0 || batchScore > 0) {
			// Calculate overall compatibility score (0-100)
			const totalPossibleScore = Math.max(meInterests.size, 1) + 3 + 2; // max interests + year + batch
			const actualScore = interestMatches + yearScore + batchScore;
			const compatibilityScore = Math.round((actualScore / totalPossibleScore) * 100);
			
			scored.push({ 
				...(u as any), 
				score: interestMatches + yearScore + batchScore,
				compatibilityScore 
			});
		}
	});
	
	// Sort by compatibility score, then by interest matches
	scored.sort((a, b) => {
		if (b.compatibilityScore !== a.compatibilityScore) {
			return b.compatibilityScore - a.compatibilityScore;
		}
		return b.score - a.score;
	});
	
	return scored.slice(0, limit);
}

export async function getCompatibleUsers(currentUserId: string, filters?: {
	year?: string;
	batch?: string;
	minCompatibility?: number;
}): Promise<Array<UserDoc & { score: number; compatibilityScore: number }>> {
	const matches = await getSmartMatches(currentUserId, 50);
	
	if (!filters) return matches;
	
	return matches.filter(match => {
		if (filters.year && match.year !== filters.year) return false;
		if (filters.batch && match.batch !== filters.batch) return false;
		if (filters.minCompatibility && match.compatibilityScore < filters.minCompatibility) return false;
		return true;
	});
}