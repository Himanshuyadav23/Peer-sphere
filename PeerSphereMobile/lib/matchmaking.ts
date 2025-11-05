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
    if (score > 0) scored.push({ ...(u as any), score });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export async function getSmartMatches(currentUserId: string, limit = 20): Promise<Array<UserDoc & { score: number; compatibilityScore: number }>> {
  const db = getDb();
  const meSnap = await getDoc(doc(db, 'users', currentUserId));
  if (!meSnap.exists()) return [];
  const me = meSnap.data() as UserDoc;
  const usersSnap = await getDocs(collection(db, 'users'));
  const scored: Array<UserDoc & { score: number; compatibilityScore: number }> = [];
  
  const meInterests = new Set((me.interests || []).map((i) => i.toLowerCase()));
  const meYear = me.year;
  const meBatch = me.batch;
  
  usersSnap.forEach((d) => {
    if (d.id === currentUserId) return;
    const u = d.data() as UserDoc;
    
    const interestMatches = (u.interests || []).reduce((acc, it) => 
      acc + (meInterests.has((it || '').toLowerCase()) ? 1 : 0), 0);
    
    let yearScore = 0;
    if (meYear && u.year) {
      const yearOrder = ['1st', '2nd', '3rd', 'MCA'];
      const meYearIndex = yearOrder.indexOf(meYear);
      const uYearIndex = yearOrder.indexOf(u.year);
      
      if (meYearIndex !== -1 && uYearIndex !== -1) {
        const yearDiff = Math.abs(meYearIndex - uYearIndex);
        if (yearDiff === 0) yearScore = 3;
        else if (yearDiff === 1) yearScore = 2;
        else if (yearDiff === 2) yearScore = 1;
      }
    }
    
    const batchScore = (meBatch && u.batch && meBatch === u.batch) ? 2 : 0;
    
    const totalPossibleScore = Math.max(meInterests.size, 1) + 3 + 2;
    const actualScore = interestMatches + yearScore + batchScore;
    const compatibilityScore = Math.round((actualScore / totalPossibleScore) * 100);
    
    if (compatibilityScore > 10) {
      scored.push({ 
        ...(u as any), 
        score: interestMatches + yearScore + batchScore,
        compatibilityScore 
      });
    }
  });
  
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









