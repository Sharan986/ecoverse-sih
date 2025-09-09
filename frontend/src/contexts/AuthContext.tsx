import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseClient.js';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  upgradeGuestToAccount: (email: string, password: string, displayName: string) => Promise<void>;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  preferences: {
    budget: number;
    preferredDestinations: string[];
    transport: string;
    language: string;
  };
  stats: {
    totalItineraries: number;
    totalTrips: number;
    memberSince: any;
  };
  createdAt: any;
  updatedAt: any;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Create default guest profile
  const createGuestProfile = (): UserProfile => {
    return {
      uid: 'guest-user',
      email: 'guest@journeysmith.ai',
      displayName: 'Guest User',
      photoURL: '',
      phoneNumber: '',
      preferences: {
        budget: 50000,
        preferredDestinations: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
        transport: 'car',
        language: 'en'
      },
      stats: {
        totalItineraries: 0,
        totalTrips: 0,
        memberSince: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  // Create user profile in Firestore
  const createUserProfile = async (user: User, additionalData: any = {}) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const { displayName, email, photoURL } = user;
        const profile: UserProfile = {
          uid: user.uid,
          email: email || '',
          displayName: displayName || '',
          photoURL: photoURL || '',
          phoneNumber: '',
          preferences: {
            budget: 25000,
            preferredDestinations: [],
            transport: 'car',
            language: 'en'
          },
          stats: {
            totalItineraries: 0,
            totalTrips: 0,
            memberSince: serverTimestamp()
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...additionalData
        };

        await setDoc(userRef, profile);
        setUserProfile(profile);
      } else {
        setUserProfile(userSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error creating/fetching user profile:', error);
      // Create a basic profile even if Firestore fails
      const basicProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        phoneNumber: '',
        preferences: {
          budget: 25000,
          preferredDestinations: [],
          transport: 'car',
          language: 'en'
        },
        stats: {
          totalItineraries: 0,
          totalTrips: 0,
          memberSince: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setUserProfile(basicProfile);
    }
  };

  // Signup with email and password
  const signup = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await createUserProfile(user, { displayName });
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    await createUserProfile(user);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', currentUser.uid);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updatedData);
    setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);
  };

  // Delete account
  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No user logged in');
    await deleteUser(currentUser);
    setUserProfile(null);
  };

  // Upgrade guest to real account
  const upgradeGuestToAccount = async (email: string, password: string, displayName: string) => {
    if (!isGuest) throw new Error('Not in guest mode');
    
    // Save current guest data
    const guestData = userProfile;
    
    // Create real account
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    
    // Create profile with guest data as base
    const userRef = doc(db, 'users', user.uid);
    const profile: UserProfile = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      photoURL: '',
      phoneNumber: '',
      preferences: guestData?.preferences || {
        budget: 50000,
        preferredDestinations: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
        transport: 'car',
        language: 'en'
      },
      stats: guestData?.stats || {
        totalItineraries: 0,
        totalTrips: 0,
        memberSince: serverTimestamp()
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(userRef, profile);
    setUserProfile(profile);
    setIsGuest(false);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Real user logged in
        setIsGuest(false);
        try {
          await createUserProfile(user);
        } catch (error) {
          console.warn('Using local profile due to Firestore permissions:', error.message);
          // Use a local profile if Firestore fails
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            phoneNumber: '',
            preferences: {
              budget: 25000,
              preferredDestinations: [],
              transport: 'car',
              language: 'en'
            },
            stats: {
              totalItineraries: 0,
              totalTrips: 0,
              memberSince: new Date()
            },
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } else {
        // No authenticated user, initialize guest mode
        setIsGuest(true);
        setUserProfile(createGuestProfile());
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isGuest,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    signInWithGoogle,
    deleteAccount,
    upgradeGuestToAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
