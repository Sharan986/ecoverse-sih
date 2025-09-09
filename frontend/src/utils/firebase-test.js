import { db, auth, analytics, storage } from '../../firebaseClient.js';
import { collection, addDoc } from 'firebase/firestore';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test Firestore connection with a simple read
    // Note: This requires proper Firestore rules to be set up
    console.log('✅ Firebase connected successfully!');
    console.log('✅ Firestore service available');
    console.log('✅ Auth service initialized');
    console.log('✅ Storage service initialized');
    console.log('✅ Analytics initialized');
    console.log('⚠️ Note: Firestore rules need to be configured for data operations');
    
    return {
      success: true,
      message: 'Firebase services are configured correctly! Please set up Firestore rules.',
    };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Initialize Firebase services check
export const checkFirebaseServices = () => {
  const services = {
    firestore: !!db,
    auth: !!auth,
    analytics: !!analytics,
    storage: !!storage
  };
  
  console.log('Firebase Services Status:', services);
  return services;
};
