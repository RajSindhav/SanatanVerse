import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase.ts';
import { ADMIN_BOOTSTRAP_EMAIL } from '../utils/comicStudioLogic.ts';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  authLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser || !currentUser.emailVerified) {
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }

      if (currentUser.email === ADMIN_BOOTSTRAP_EMAIL) {
        setIsAdmin(true);
        setAuthLoading(false);
        return;
      }

      try {
        const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
        setIsAdmin(adminSnap.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        return;
      }
      if (code === 'auth/popup-blocked') {
        setAuthError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
        return;
      }
      if (code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setAuthError(
          `Domain "${host}" must be added under Firebase Console → Authentication → Settings → Authorized domains before signing in.`
        );
        return;
      }
      setAuthError(err instanceof Error ? err.message : 'Unable to complete Google sign-in.');
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Unable to sign out.');
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        authLoading,
        authError,
        clearAuthError,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return ctx;
}
