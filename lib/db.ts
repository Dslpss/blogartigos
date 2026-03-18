import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  setDoc,
  Timestamp,
  orderBy,
  limit,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  imageUrl: string;
  status: string;
  source: string;
  region: string;
  views?: number;
  createdAt: Timestamp;
}

export interface UserRole {
  uid?: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface BlogSettings {
  name: string;
  description?: string;
  logoUrl?: string;
  newsletterUrl?: string;
}

export interface BlogTheme {
  primaryColor: string;
  accentColor: string;
  fontColor: string;
  secondaryFontColor: string;
  backgroundColor: string;
  headerBackground: string;
  footerBackground: string;
  surfaceColor: string;
  footerTextColor: string;
  footerHighlightColor: string;
  cardBackground: string;
  headingFont: 'sans' | 'serif';
  bodyFont: 'sans' | 'serif';
  borderRadiusPreset: 'none' | 'small' | 'medium' | 'large';
  glassIntensity: number;
}

// Blog Settings
export const getBlogSettings = async (): Promise<BlogSettings> => {
  const docRef = doc(db, 'settings', 'blog');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as BlogSettings;
  }
  return { 
    name: 'Dslpss Study-Notes Blog', 
    description: 'Uma plataforma dedicada ao acompanhamento técnico de notícias, análises de mercado e insights estratégicos.',
    logoUrl: '',
    newsletterUrl: ''
  };
};

export const updateBlogSettings = async (settings: Partial<BlogSettings>) => {
  await setDoc(doc(db, 'settings', 'blog'), settings, { merge: true });
};

// Theme Settings
export const getTheme = async (): Promise<BlogTheme> => {
  const docRef = doc(db, 'settings', 'theme');
  const docSnap = await getDoc(docRef);
  
  const defaultTheme: BlogTheme = {
    primaryColor: '#15803d',
    accentColor: '#004a99',
    fontColor: '#000000',
    secondaryFontColor: '#475569',
    backgroundColor: '#ffffff',
    headerBackground: '#ffffff',
    footerBackground: '#15803d',
    surfaceColor: '#f8fafc',
    footerTextColor: '#ffffff',
    footerHighlightColor: '#004a99',
    cardBackground: '#ffffff',
    headingFont: 'sans',
    bodyFont: 'sans',
    borderRadiusPreset: 'medium',
    glassIntensity: 20
  };

  if (docSnap.exists()) {
    return { ...defaultTheme, ...docSnap.data() } as BlogTheme;
  }
  return defaultTheme;
};

export const updateTheme = async (theme: Partial<BlogTheme>) => {
  await setDoc(doc(db, 'settings', 'theme'), theme, { merge: true });
};

// Articles
export const getArticles = async (): Promise<BlogPost[]> => {
  const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
};

export const getArticleBySlug = async (slug: string): Promise<BlogPost | null> => {
  const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() } as BlogPost;
  }

  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    }
  } catch (err) {}
  
  return null;
};

export const searchArticles = async (term: string): Promise<BlogPost[]> => {
  const articles = await getArticles();
  const lowerTerm = term.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerTerm) ||
    article.content.toLowerCase().includes(lowerTerm) ||
    article.category.toLowerCase().includes(lowerTerm) ||
    article.excerpt.toLowerCase().includes(lowerTerm)
  );
};

export const addArticle = async (article: Omit<BlogPost, 'createdAt'>) => {
  await addDoc(collection(db, 'articles'), {
    ...article,
    createdAt: Timestamp.now()
  });
};

export const updateArticle = async (id: string, article: Partial<BlogPost>) => {
  await updateDoc(doc(db, 'articles', id), article);
};

export const deleteArticle = async (id: string) => {
  await deleteDoc(doc(db, 'articles', id));
};

export const incrementArticleViews = async (id: string) => {
  const articleStatsRef = doc(db, 'article_stats', id);
  const statsRef = doc(db, 'stats', 'global');
  try {
    const batch = writeBatch(db);
    batch.set(articleStatsRef, { views: increment(1) }, { merge: true });
    batch.set(statsRef, { totalViews: increment(1) }, { merge: true });
    await batch.commit();
  } catch (err) {
    // Fallback to updating article_stats and stats separately
    try {
      await updateDoc(articleStatsRef, { views: increment(1) });
    } catch (e) {
      try { await setDoc(articleStatsRef, { views: 1 }, { merge: true }); } catch (e) {}
    }
    try {
      await updateDoc(statsRef, { totalViews: increment(1) });
    } catch (e) {
      try { await setDoc(statsRef, { totalViews: 1 }, { merge: true }); } catch (e) {}
    }
  }
};

export const getAllArticleViews = async (): Promise<Record<string, number>> => {
  const q = query(collection(db, 'article_stats'));
  const querySnapshot = await getDocs(q);
  const map: Record<string, number> = {};
  querySnapshot.docs.forEach(d => {
    map[d.id] = (d.data() as any).views || 0;
  });
  return map;
};

// User Roles & Team Management
export const getUserRole = async (uid: string, email?: string): Promise<UserRole | null> => {
  // Try by UID first (indexed)
  const docRef = doc(db, 'user_roles', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as UserRole;
  }

  // Fallback: search by email to support "pending" invites
  if (email) {
    const inviteDocRef = doc(db, 'user_roles', `invite_${email.toLowerCase().trim()}`);
    const inviteSnap = await getDoc(inviteDocRef);
    if (inviteSnap.exists()) {
      return { uid: inviteSnap.id, ...inviteSnap.data() } as UserRole;
    }
  }

  return null;
};

export const getTeamMembers = async (): Promise<UserRole[]> => {
  const q = query(collection(db, 'user_roles'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserRole));
};

export const addTeamMember = async (email: string, role: 'admin' | 'editor', uid?: string) => {
  // If UID is provided, use it as doc ID. 
  // If missing (invite), use 'invite_[email]' as deterministic ID for security rules
  const docId = uid || `invite_${email.toLowerCase().trim()}`;
  await setDoc(doc(db, 'user_roles', docId), {
    email: email.toLowerCase().trim(),
    role,
    updatedAt: Timestamp.now(),
    ...(uid ? { uidLinked: true } : { pending: true })
  });
};

export const removeTeamMember = async (uid: string) => {
  await deleteDoc(doc(db, 'user_roles', uid));
};

// --- Polls & Petitions System ---

export interface PollField {
  label: string;
  type: 'text' | 'email' | 'tel' | 'city';
  required: boolean;
}

export interface Poll {
  id?: string;
  title: string;
  description?: string;
  fields: PollField[];
  isActive: boolean;
  showCounter: boolean;
  submissionsCount: number;
  options: string[];
  // Inner card color (used for the vote area)
  cardColor?: string;
  cardAlpha?: number;
  // Font color for text inside the poll
  fontColor?: string;
  secondaryFontAlpha?: number;
  highlightColor?: string;
  // Outer / principal card color and transparency (configurable separately)
  outerCardColor?: string;
  outerCardAlpha?: number;
  createdAt: Timestamp;
}

export interface PollSubmission {
  id?: string;
  pollId: string;
  selection?: string; // Add this field
  data: Record<string, string>;
  submittedAt: Timestamp;
}

export const getPolls = async (): Promise<Poll[]> => {
  const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
};

export const getActivePoll = async (): Promise<Poll | null> => {
  const q = query(collection(db, 'polls'), where('isActive', '==', true), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() } as Poll;
  }
  return null;
};

export const addPoll = async (poll: Omit<Poll, 'id' | 'createdAt' | 'submissionsCount'>) => {
  await addDoc(collection(db, 'polls'), {
    ...poll,
    submissionsCount: 0,
    createdAt: Timestamp.now()
  });
};

export const updatePoll = async (id: string, poll: Partial<Poll>) => {
  await updateDoc(doc(db, 'polls', id), poll);
};

export const deletePoll = async (id: string) => {
  // 1. Delete the poll document
  await deleteDoc(doc(db, 'polls', id));

  // 2. Delete all submissions for this poll
  const q = query(collection(db, 'poll_submissions'), where('pollId', '==', id));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);
};

export const submitPollResponse = async (pollId: string, data: Record<string, string>, selection?: string) => {
  // 1. Add the submission
  await addDoc(collection(db, 'poll_submissions'), {
    pollId,
    selection,
    data,
    submittedAt: Timestamp.now()
  });

  // 2. Increment the counter in the poll document
  const pollRef = doc(db, 'polls', pollId);
  const pollSnap = await getDoc(pollRef);
  if (pollSnap.exists()) {
    const currentCount = pollSnap.data().submissionsCount || 0;
    await updateDoc(pollRef, { submissionsCount: currentCount + 1 });
  }
};

export const getPollSubmissions = async (pollId: string): Promise<PollSubmission[]> => {
  const q = query(
    collection(db, 'poll_submissions'), 
    where('pollId', '==', pollId),
    orderBy('submittedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PollSubmission));
};
