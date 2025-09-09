# JourneySmith AI - Frontend Only

This is a React + TypeScript frontend application for JourneySmith AI, now fully independent and using Firebase as the backend.

## Features

- ✅ **Completely Independent Frontend** - No backend server required
- ✅ **Firebase Integration** - Uses Firestore for data storage
- ✅ **Itinerary Generation** - Create travel itineraries for Jharkhand
- ✅ **Chat Bot** - Interactive tourism assistant
- ✅ **Modern UI** - Built with React, TypeScript, and Tailwind CSS
- ✅ **Component Library** - Uses shadcn/ui components

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Firebase Configuration
The Firebase configuration is already set up in `firebaseClient.js`. If you need to use your own Firebase project:

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Update the configuration in `frontend/firebaseClient.js` with your project details

### 3. Run the Application
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port).

## Architecture

### Firebase Collections
- **itineraries** - Stores generated travel itineraries
- **feedback** - User feedback and reviews
- **chatHistory** - Chat conversation history

### Key Components
- **ItineraryForm** - Generate and save travel itineraries
- **ChatBot** - Interactive tourism assistant
- **ItineraryView** - Display saved itineraries
- **Firebase API** - All Firebase operations in `src/api/firebase-api.js`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

Since this is now a pure frontend application, you can deploy it to any static hosting service:

- **Vercel** - `npm run build` then deploy the `dist` folder
- **Netlify** - Connect your Git repository for auto-deployment
- **Firebase Hosting** - `firebase deploy` after setting up Firebase CLI
- **GitHub Pages** - Use the built `dist` folder

## Firebase Security Rules

Remember to set up proper Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (update this for production)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Firebase** - Backend services
- **React Router** - Client-side routing

---

**Note**: The backend has been completely removed. All functionality now runs through Firebase services directly from the frontend.
