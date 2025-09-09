import axios from 'axios';
import { db, auth } from '../../firebaseClient.js';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// API configuration
const API_BASE_URL = import.meta.env.VITE_ITINERARY_API_BASE || 'http://localhost:3010/api';

// Interfaces
export interface ItineraryPayload {
  budget: number;
  startDate: string;
  duration: number;
  homePlace: string;
  transport: 'car' | 'train' | 'flight' | 'bus';
  arrival: string;
  preferredDestinations: string[];
}

export interface SavedItinerary {
  id: string;
  userId: string;
  itinerary: string;
  createdAt: Date;
  payload?: ItineraryPayload;
}

// AI Itinerary Generation using Gemini API
export async function generateItinerary(payload: ItineraryPayload): Promise<{ success: boolean; plan?: string; error?: string }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/itinerary/generate`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout for AI generation
    });

    return response.data;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 500) {
        return { success: false, error: 'AI service temporarily unavailable. Please try again.' };
      }
      if (error.code === 'ECONNABORTED') {
        return { success: false, error: 'Request timeout. The AI is taking too long to respond.' };
      }
    }
    
    return { success: false, error: 'Failed to generate itinerary. Please check your connection.' };
  }
}

// Save itinerary to Firebase
export async function saveItineraryToFirebase(itinerary: string, payload?: ItineraryPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    
    const docRef = await addDoc(collection(db, 'itineraries'), {
      userId,
      itinerary,
      payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return { success: false, error: 'Failed to save itinerary to database.' };
  }
}

// Get user's saved itineraries
export async function getUserItineraries(): Promise<{ success: boolean; itineraries?: SavedItinerary[]; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const itineraries: SavedItinerary[] = [];

    querySnapshot.forEach((doc) => {
      itineraries.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as SavedItinerary);
    });

    return { success: true, itineraries };
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return { success: false, error: 'Failed to fetch saved itineraries.' };
  }
}

// Chat with AI about itinerary
export async function chatWithAI(message: string, language: string = 'en'): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, {
      message,
      lang: language,
    });

    return response.data;
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return { success: false, error: 'Failed to get AI response.' };
  }
}

// Submit feedback
export async function submitFeedback(message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    
    const response = await axios.post(`${API_BASE_URL}/feedback/submit`, {
      message,
      userId,
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: 'Failed to submit feedback.' };
  }
}
