// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log configuration for debugging
console.log('Environment variables check:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'loaded' : 'missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'loaded' : 'missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'loaded' : 'missing'
});

console.log('Firebase Config loaded successfully for project:', firebaseConfig.projectId);

let app, analytics, db, auth, storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');
  
  // Initialize services
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
  
  auth = getAuth(app);
  console.log('✅ Auth initialized');
  
  storage = getStorage(app);
  console.log('✅ Storage initialized');
  
  // Analytics might fail in localhost, so we'll handle it gracefully
  try {
    analytics = getAnalytics(app);
    console.log('✅ Analytics initialized');
  } catch (analyticsError) {
    console.warn('⚠️ Analytics failed to initialize (this is normal in localhost):', analyticsError.message);
    analytics = null;
  }
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export { app, analytics, db, auth, storage };
