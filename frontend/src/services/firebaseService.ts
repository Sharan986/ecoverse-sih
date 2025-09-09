import { db, auth } from '../../firebaseClient.js';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ItineraryPayload } from './geminiApi';

export interface SavedItinerary {
  id: string;
  userId: string;
  itinerary: string;
  payload: ItineraryPayload;
  createdAt: Date;
}

// Save itinerary to Firebase
export async function saveItinerary(itinerary: string, payload: ItineraryPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    
    const docRef = await addDoc(collection(db, 'itineraries'), {
      userId,
      itinerary,
      payload,
      createdAt: new Date(),
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
    const userId = user?.uid || 'anonymous';

    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const itineraries: SavedItinerary[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      itineraries.push({
        id: docSnapshot.id,
        userId: data.userId,
        itinerary: data.itinerary,
        payload: data.payload,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });

    return { success: true, itineraries };
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return { success: false, error: 'Failed to fetch saved itineraries.' };
  }
}

// Delete an itinerary
export async function deleteItinerary(itineraryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'itineraries', itineraryId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return { success: false, error: 'Failed to delete itinerary.' };
  }
}

// Submit feedback to Firebase
export async function submitFeedback(message: string, rating?: number): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    const userId = user?.uid || 'anonymous';
    
    await addDoc(collection(db, 'feedback'), {
      userId,
      message,
      rating,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: 'Failed to submit feedback.' };
  }
}
