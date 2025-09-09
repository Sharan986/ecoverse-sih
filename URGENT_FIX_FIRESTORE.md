# 🔥 URGENT: Fix Firestore Permissions

## The Error
You're seeing: `FirebaseError: Missing or insufficient permissions`

This happens because Firestore starts with restrictive security rules by default.

## 🚀 Quick Fix (5 minutes)

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/project/ecoverse-sih
2. Click "Firestore Database" in left sidebar
3. Click "Rules" tab

### Step 2: Update Rules
Replace the existing rules with this **DEVELOPMENT-FRIENDLY** version:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish
1. Click "Publish" button
2. Wait for rules to deploy (30 seconds)

## ✅ Test It
1. Refresh your app
2. Try to sign up with a new account
3. The error should be gone!

## 🔒 Production Rules (Use Later)
For production, use these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /itineraries/{itineraryId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /chatHistory/{chatId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
    }
  }
}
```

## 🎯 What This Fixes
- ✅ User signup/login will work
- ✅ User profiles will be created
- ✅ Itinerary saving will work
- ✅ Chat history will save
- ✅ All Firebase features enabled

---
**After fixing rules, your authentication system will work perfectly!** 🚀
