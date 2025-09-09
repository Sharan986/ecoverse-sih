# Firestore Security Rules for JourneySmith AI

## Copy these rules to your Firebase Console:

1. Go to https://console.firebase.google.com/project/ecoverse-sih/firestore/rules
2. Replace the existing rules with the rules below
3. Click "Publish"

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat messages - users can read/write their own chats (including guest users)
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId);
      // Allow guest users to store temporary chat data
      allow create: if request.resource.data.userId == 'guest-user';
      allow read: if resource.data.userId == 'guest-user';
    }
    
    // Itineraries collection - users can read/write their own itineraries
    match /itineraries/{itineraryId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Chat history - users can read/write their own chat history
    match /chatHistory/{chatId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Feedback collection - anyone can create, only admins can read
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        request.auth.token.email.matches('.*admin.*');
    }
    
    // Test collection - for development only (remove in production)
    match /test/{testId} {
      allow read, write: if request.auth != null;
    }
    
    // Public collections (if needed)
    match /destinations/{destinationId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email.matches('.*admin.*');
    }
    
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email.matches('.*admin.*');
    }
  }
}
```

## For Development/Testing (Temporary):
If you want to test quickly, you can use these permissive rules temporarily:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Important**: The permissive rules above should only be used for development. Always use the secure rules for production.
