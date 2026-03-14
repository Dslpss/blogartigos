import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
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
  createdAt: Timestamp;
}

export interface BlogSettings {
  name: string;
  description: string;
}

// Settings
export const getBlogSettings = async (): Promise<BlogSettings> => {
  const docRef = doc(db, 'settings', 'general');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as BlogSettings;
  } else {
    // Default settings if none exist
    const defaults = { name: 'Comunica Brasil', description: 'O portal de notícias e artigos premium.' };
    await setDoc(docRef, defaults);
    return defaults;
  }
};

export const updateBlogSettings = async (settings: BlogSettings) => {
  const docRef = doc(db, 'settings', 'general');
  await updateDoc(docRef, { ...settings });
};

// Articles
export const getArticles = async (): Promise<BlogPost[]> => {
  const articlesCol = collection(db, 'articles');
  const articlesQuery = query(articlesCol, orderBy('createdAt', 'desc'));
  const articlesSnapshot = await getDocs(articlesQuery);
  return articlesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BlogPost[];
};

export const addArticle = async (article: Omit<BlogPost, 'id' | 'createdAt'>) => {
  const articlesCol = collection(db, 'articles');
  return await addDoc(articlesCol, {
    ...article,
    createdAt: Timestamp.now()
  });
};

export const updateArticle = async (id: string, article: Partial<BlogPost>) => {
  const articleRef = doc(db, 'articles', id);
  await updateDoc(articleRef, article);
};

export const deleteArticle = async (id: string) => {
  const articleRef = doc(db, 'articles', id);
  await deleteDoc(articleRef);
};
