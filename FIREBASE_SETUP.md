# Firebase Setup Guide

## ✅ Current Status
- Firebase SDK installed via npm
- Environment variables configured in `.env`
- Firebase client initialized with your project credentials
- Firestore, Auth, Storage, and Analytics services ready

## 🔧 Next Steps in Firebase Console

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/project/ecoverse-sih)
2. Click on "Firestore Database" in the left sidebar
3. Click "Create database"
4. Choose "Start in test mode" for development
5. Select a location (choose closest to your users)

### 2. Set up Authentication (Optional)
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Enable sign-in methods you want:
   - Email/Password
   - Google
   - Anonymous (for guests)

### 3. Configure Storage (Optional)
1. Go to "Storage" in Firebase Console
2. Click "Get started"
3. Start in test mode
4. Choose storage location

### 4. Set up Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for development (update for production)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📝 Collections Structure
Your app will use these Firestore collections:

- **itineraries** - Travel itineraries
  ```javascript
  {
    budget: number,
    startDate: string,
    duration: number,
    homePlace: string,
    transport: string,
    arrival: string,
    preferredDestinations: array,
    plan: string, // Generated itinerary
    userId: string,
    createdAt: timestamp
  }
  ```

- **feedback** - User feedback
  ```javascript
  {
    message: string,
    rating: number,
    userId: string,
    createdAt: timestamp,
    status: string
  }
  ```

- **chatHistory** - Chat conversations
  ```javascript
  {
    message: string,
    response: string,
    userId: string,
    timestamp: timestamp
  }
  ```

## 🧪 Testing Firebase Connection

Open your browser console (F12) and look for these messages:
- ✅ Firebase Services Status: {firestore: true, auth: true, ...}
- 🚀 JourneySmith AI Frontend started with Firebase integration

You can also test by creating an itinerary - it will save to Firestore!

## 🔐 Environment Variables

Your `.env` file contains:
```
VITE_FIREBASE_API_KEY=AIzaSyDNjXmGKZUOwP804UiRWeQo-4MkZWSJj8I
VITE_FIREBASE_AUTH_DOMAIN=ecoverse-sih.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ecoverse-sih
VITE_FIREBASE_STORAGE_BUCKET=ecoverse-sih.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=60658567960
VITE_FIREBASE_APP_ID=1:60658567960:web:a181e9c8d5e498791fec6d
VITE_FIREBASE_MEASUREMENT_ID=G-VCQJKC306E
```

## 🚀 Available Firebase Functions

### Itinerary Management
- `generateItinerary(payload)` - Create new itinerary
- `saveItinerary(data)` - Save to Firestore
- `getItineraries(userId)` - Get user's itineraries
- `updateItinerary(id, updates)` - Update existing
- `deleteItinerary(id)` - Delete itinerary

### Chat & Feedback
- `saveChatMessage(message, response, userId)` - Save chat
- `getChatHistory(userId)` - Get chat history
- `submitFeedback(data)` - Submit feedback

### Testing
- `testFirebaseConnection()` - Test all services
- `checkFirebaseServices()` - Check service status

## 🛡️ Security Notes
- Environment variables are secure (not exposed in build)
- `.env` file is gitignored
- Update Firestore rules for production
- Consider implementing user authentication

## 📱 Ready to Use!
Your app is now fully configured with Firebase. Try:
1. Creating an itinerary
2. Using the chatbot
3. Check browser console for Firebase logs
