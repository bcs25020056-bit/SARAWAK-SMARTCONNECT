import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from '../firebase';

/**
 * ENCAPSULATION: The UserProfile interface encapsulates all user-related data 
 * into a single structured type.
 */
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  level?: number;
  xp?: number;
  badges?: number;
  skills?: string[];
  education?: any[];
  companyInfo?: {
    name: string;
    industry: string;
    website: string;
    location: string;
    description: string;
  };
  createdAt?: any;
  role?: 'student' | 'company' | 'admin';
  onboarded?: boolean;
}

/**
 * ABSTRACTION & POLYMORPHISM: This interface acts as an abstract contract 
 * for the Firebase services, allowing different implementations if needed.
 */
interface FirebaseContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

/**
 * ENCAPSULATION: The FirebaseProvider component encapsulates all the logic 
 * for Firebase authentication and profile management, hiding the complexity 
 * from the rest of the application.
 */
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Create initial profile
            const initialProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Explorer',
              email: firebaseUser.email || '',
              bio: '',
              level: 1,
              xp: 0,
              badges: 0,
              skills: [],
              education: [],
              createdAt: serverTimestamp(),
              role: 'student',
              onboarded: false
            };
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
              setProfile(initialProfile);
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
            }
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('FirestoreErrorInfo')) {
            // Already handled
            throw error;
          }
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * METHOD: A function that performs an action (signing in with Google).
   */
  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  /**
   * POLYMORPHISM: This method exhibits polymorphism by accepting any partial 
   * set of user data, adapting its behavior to update only the provided fields.
   */
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, data, { merge: true });
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, profile, loading, signIn, signInWithEmail, signUpWithEmail, signOut, updateProfile }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
