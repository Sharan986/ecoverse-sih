import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Photo360Viewer from "./pages/ar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Destinations from "./pages/Destinations";
import Experiences from "./pages/Experiences";
import Analytics from "./pages/Analytics";
import MapPage from "./pages/MapPage";
import { checkFirebaseServices } from "./utils/firebase-test";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./components/auth/LoginPage";
import { SignupPage } from "./components/auth/SignupPage";
import { DashboardPage } from "./components/auth/DashboardPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import "./utils/speechTest"; // Initialize speech test utilities

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test Firebase connection on app startup
    checkFirebaseServices();
    console.log('🚀 JourneySmith AI Frontend started with Firebase integration');
    console.log('🎤 Speech recognition utilities available - type testSpeechService() in console');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/ar" element={<Photo360Viewer />} />
              <Route path="/360-tours" element={<Photo360Viewer />} />
              
              {/* Auth Routes - Only accessible when not logged in */}
              <Route path="/auth/login" element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } />
              <Route path="/auth/signup" element={
                <ProtectedRoute requireAuth={false}>
                  <SignupPage />
                </ProtectedRoute>
              } />
              <Route path="/auth/forgot-password" element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPasswordPage />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes - Only accessible when logged in */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
