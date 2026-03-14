'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getUserRole, addTeamMember, removeTeamMember } from './db';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  role: 'admin' | 'editor' | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isEditor: false,
  role: null,
});

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'editor' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Find role by UID or Email
        const userRole = await getUserRole(firebaseUser.uid, firebaseUser.email || undefined);
        
        if (userRole) {
          // If role was found but it's still a pending invite (ID starts with 'invite_')
          if (userRole.uid && userRole.uid !== firebaseUser.uid && userRole.uid.startsWith('invite_')) {
            try {
              // 1. Create the permanent UID doc (Allowed by 'allow create' with invite)
              await addTeamMember(firebaseUser.email!, userRole.role, firebaseUser.uid);
              // 2. Remove the temporary invite doc (Allowed by 'allow delete' where userId matches email)
              await removeTeamMember(userRole.uid);
            } catch (err) {
              console.error("Activation error:", err);
            }
          }
          setRole(userRole.role);
        } else if (firebaseUser.email === SUPER_ADMIN_EMAIL) {
          setRole('admin');
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = role === 'admin' || (user?.email === SUPER_ADMIN_EMAIL);
  const isEditor = role === 'editor';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isEditor, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
