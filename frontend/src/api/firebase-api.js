import { db, storage } from '../../firebaseClient.js';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Check if Firebase is properly initialized
const checkFirebaseInit = () => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please check your Firebase configuration.');
  }
};

// Collections
const ITINERARIES_COLLECTION = 'itineraries';
const FEEDBACK_COLLECTION = 'feedback';
const CHAT_HISTORY_COLLECTION = 'chatHistory';
const USERS_COLLECTION = 'users';

// Itinerary functions
export const generateItinerary = async (payload) => {
  try {
    checkFirebaseInit();
    console.log('Generating itinerary with payload:', payload);
    
    // For now, we'll generate a mock itinerary
    // In a real app, you might call an AI service or use Firebase Functions
    const mockPlan = `# Your Jharkhand Adventure

## Day 1: Arrival in ${payload.arrival || 'Ranchi'}
- **Morning**: Arrive and check into accommodation
- **Afternoon**: Explore local markets and get oriented
- **Evening**: Traditional Jharkhand dinner
- **Budget for day**: ₹${Math.round(payload.budget * 0.3)}

## Day 2: Cultural Exploration
- **Morning**: Visit Rock Garden and Kanke Dam
- **Afternoon**: Explore Tribal Research Institute
- **Evening**: Folk dance performance
- **Budget for day**: ₹${Math.round(payload.budget * 0.35)}

## Day 3: Nature and Adventure
- **Morning**: Trip to Dassam Falls
- **Afternoon**: Hiking and photography
- **Evening**: Return and departure preparation
- **Budget for day**: ₹${Math.round(payload.budget * 0.35)}

**Transportation**: ${payload.transport}
**Total Duration**: ${payload.duration} days
**Preferred Destinations**: ${payload.preferredDestinations.join(', ') || 'Default attractions'}
`;

    console.log('✅ Itinerary generated successfully');
    return {
      success: true,
      plan: mockPlan
    };
  } catch (error) {
    console.error('❌ Error generating itinerary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const saveItinerary = async (itineraryData, userId = 'anonymous') => {
  try {
    const docRef = await addDoc(collection(db, ITINERARIES_COLLECTION), {
      ...itineraryData,
      createdAt: new Date(),
      userId: userId
    });
    
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getItineraries = async (userId = 'anonymous') => {
  try {
    const q = query(
      collection(db, ITINERARIES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const itineraries = [];
    
    querySnapshot.forEach((doc) => {
      itineraries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      itineraries
    };
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateItinerary = async (id, updates) => {
  try {
    const itineraryRef = doc(db, ITINERARIES_COLLECTION, id);
    await updateDoc(itineraryRef, {
      ...updates,
      updatedAt: new Date()
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteItinerary = async (id) => {
  try {
    await deleteDoc(doc(db, ITINERARIES_COLLECTION, id));
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Feedback functions
export const submitFeedback = async (feedbackData) => {
  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedbackData,
      createdAt: new Date(),
      status: 'pending'
    });
    
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Chat functions
export const saveChatMessage = async (message, response, userId = 'anonymous') => {
  try {
    const docRef = await addDoc(collection(db, CHAT_HISTORY_COLLECTION), {
      message,
      response,
      userId,
      timestamp: new Date()
    });
    
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getChatHistory = async (userId = 'anonymous') => {
  try {
    const q = query(
      collection(db, CHAT_HISTORY_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const chatHistory = [];
    
    querySnapshot.forEach((doc) => {
      chatHistory.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      chatHistory
    };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
