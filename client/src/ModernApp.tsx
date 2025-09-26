/**
 * Main Application Component - InnerSpring Mental Health Support Platform
 *
 * This is the root component of the InnerSpring application, a comprehensive mental health
 * support platform. It provides the foundational structure and context
 * providers that enable all application features.
 *
 * Core Features:
 * - AI-powered mental health chatbot for immediate support
 * - Professional counselor appointment booking system
 * - Standardized mental health assessments (PHQ-9, GAD-7, GHQ)
 * - Comprehensive resource library with educational content
 * - Anonymous peer support forum for community connection
 * - Emergency crisis intervention resources and contacts
 * - Personal dashboard for tracking mental health progress
 *
 * Technical Architecture:
 * - React Router (Wouter) for client-side navigation
 * - TanStack Query for server state management and caching
 * - Shadcn/UI component library for consistent design
 * - Real-time WebSocket communication for chat functionality
 * - Responsive design optimized for mobile and desktop usage
 */

import { Router, Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import { queryClient } from "./lib/queryClient";

/**
 * Page Component Imports - Updated for Modern Design
 */
import Home from "@/pages/home/Home"; // Landing page with platform overview and navigation
import ChatBot from "@/pages/chatbot/NewChatBot"; // AI-powered mental health conversation interface
import Appointments from "@/pages/appointments/Appointments"; // Counselor booking and appointment management
import SelfAssessment from "@/pages/assessments/SelfAssessment"; // Standardized mental health assessments
import Resources from "@/pages/resources/Resources"; // Educational content and resource library
import PeerSupport from "@/pages/peer-support/PeerSupport"; // Anonymous community support forum
import Emergency from "@/pages/emergency/Emergency"; // Crisis intervention and emergency contacts
import CrisisHelp from "@/pages/crisis-help/CrisisHelp"; // Dedicated crisis help and emergency support page
import Dashboard from "@/pages/dashboard/Dashboard"; // Personal progress tracking and overview
import About from "@/pages/about/About"; // Platform information and team details
import NotFound from "@/pages/not-found/not-found"; // 404 error page for invalid routes

// Import new modern authentication pages
import ModernLogin from "@/pages/ModernLogin"; // Modern Firebase authentication login page
import ModernSignup from "@/pages/ModernSignup"; // Modern Firebase authentication signup page
import { VerifyEmail } from "@/pages/VerifyEmail"; // Email verification page
import { FirebaseDebug } from "@/components/FirebaseDebug"; // Firebase debug panel

/**
 * Application Router Component
 *
 * Defines all application routes using Wouter for client-side navigation.
 * The routing structure is designed for intuitive user navigation and
 * follows mental health service workflows.
 *
 * Authentication Flow:
 * - All routes are protected by default except auth routes
 * - Users must be logged in and verified to access any page
 * - Login page is shown first for unauthenticated users
 * - Modern design with professional authentication flow
 */
function AppRouter() {
  return (
    <Router>
      <Switch>
        {/* Authentication routes - accessible without login */}
        <Route path="/login" component={ModernLogin} />
        <Route path="/signup" component={ModernSignup} />
        <Route path="/verify-email" component={VerifyEmail} />
        <Route path="/debug" component={FirebaseDebug} />

        {/* Protected routes - require authentication */}
        <Route path="/">
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        </Route>

        <Route path="/chatbot">
          <PrivateRoute>
            <ChatBot />
          </PrivateRoute>
        </Route>

        <Route path="/appointments">
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        </Route>

        <Route path="/assessments">
          <PrivateRoute>
            <SelfAssessment />
          </PrivateRoute>
        </Route>

        <Route path="/resources">
          <PrivateRoute>
            <Resources />
          </PrivateRoute>
        </Route>

        <Route path="/peer-support">
          <PrivateRoute>
            <SelfAssessment />
          </PrivateRoute>
        </Route>

        <Route path="/emergency">
          <PrivateRoute>
            <Emergency />
          </PrivateRoute>
        </Route>

        <Route path="/crisis-help">
          <PrivateRoute>
            <CrisisHelp />
          </PrivateRoute>
        </Route>

        <Route path="/crisis">
          <PrivateRoute>
            <CrisisHelp />
          </PrivateRoute>
        </Route>

        <Route path="/dashboard">
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        </Route>

        <Route path="/about">
          <PrivateRoute>
            <About />
          </PrivateRoute>
        </Route>

        {/* Fallback route for invalid URLs - must be last */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

/**
 * Main App Component
 *
 * The root component that provides essential context providers and global
 * configuration for the entire application. This component establishes:
 *
 * 1. TanStack Query Client Provider for server state management
 * 2. Theme Provider for light/dark mode support
 * 3. Accessibility Provider for inclusive design
 * 4. Tooltip Provider for enhanced UX
 * 5. Auth Provider for Firebase authentication
 * 6. Toast Notification System for user feedback
 * 7. Application Router for navigation
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="innerspring-ui-theme">
        <AccessibilityProvider>
          <TooltipProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background text-foreground">
                {/* Global toast notification system for user feedback */}
                <Toaster />

                {/* Main application router handling all page navigation */}
                <AppRouter />
              </div>
            </AuthProvider>
          </TooltipProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
