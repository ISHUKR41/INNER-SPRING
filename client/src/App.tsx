/**
 * Main Application Component - MindCare Mental Health Support Platform
 *
 * This is the root component of the MindCare application, a comprehensive mental health
 * support platform for students. It provides the foundational structure and context
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
 *
 * The application follows a feature-based folder structure where each major
 * feature (chatbot, appointments, assessments, etc.) has its own dedicated
 * folder containing components, hooks, utilities, and styles.
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
 * Page Component Imports
 *
 * All pages are imported from their organized folder structure where each
 * page lives in its own dedicated folder containing:
 * - Main page component file
 * - components/ subfolder for page-specific components
 * - hooks/ subfolder for page-specific custom hooks
 * - utils/ subfolder for page-specific utility functions
 * - styles/ subfolder for page-specific styles (if needed)
 */
import Home from "@/pages/home/Home"; // Landing page with platform overview and navigation
import ModernProfessionalChat from "@/pages/chatbot/ModernProfessionalChat"; // Modern Professional AI-powered mental health conversation interface
import Appointments from "@/pages/appointments/Appointments"; // Counselor booking and appointment management
import SelfAssessment from "@/pages/assessments/SelfAssessment"; // Standardized mental health assessments
import Resources from "@/pages/resources/Resources"; // Educational content and resource library
import PeerSupport from "@/pages/peer-support/PeerSupport"; // Anonymous community support forum
import Emergency from "@/pages/emergency/Emergency"; // Crisis intervention and emergency contacts
import CrisisHelp from "@/pages/crisis-help/CrisisHelp"; // Dedicated crisis help and emergency support page
import Dashboard from "@/pages/dashboard/Dashboard"; // Personal progress tracking and overview
import About from "@/pages/about/About"; // Platform information and team details
import NotFound from "@/pages/not-found/not-found"; // 404 error page for invalid routes
import AdvancedProfessionalLogin from "./pages/AdvancedProfessionalLogin"; // Advanced Professional Firebase authentication login page with libraries
import AdvancedProfessionalSignup from "./pages/AdvancedProfessionalSignup"; // Advanced Professional Firebase authentication signup page with validation
import { VerifyEmail } from "@/pages/VerifyEmail"; // Email verification page
import { FirebaseDebug } from "@/components/FirebaseDebug"; // Firebase debug panel

/**
 * Application Router Component
 *
 * Defines all application routes using Wouter for client-side navigation.
 * The routing structure is designed for intuitive user navigation and
 * follows mental health service workflows.
 *
 * Route Organization:
 * - "/" - Home page with platform overview and quick access
 * - "/chatbot" - AI mental health assistant for immediate support
 * - "/appointments" - Professional counselor booking and scheduling
 * - "/assessments" - Mental health self-assessment tools
 * - "/resources" - Educational content and coping resources
 * - "/peer-support" - Anonymous community discussion forum
 * - "/emergency" - Crisis intervention and emergency contacts
 * - "/crisis-help" - Dedicated crisis help and emergency support
 * - "/dashboard" - Personal progress tracking and history
 * - "/about" - Platform information and support details
 *
 * The router includes a fallback route to handle invalid URLs gracefully
 * by showing a helpful 404 page instead of breaking the application.
 */
function AppRouter() {
  return (
    <Router>
      <Switch>
        {/* Authentication routes - accessible without login */}
        <Route path="/login" component={AdvancedProfessionalLogin} />
        <Route path="/signup" component={AdvancedProfessionalSignup} />
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
            <ModernProfessionalChat />
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
            <PeerSupport />
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
 * 1. TanStack Query Client Provider:
 *    - Manages server state caching and synchronization
 *    - Handles API request deduplication and background refetching
 *    - Provides optimistic updates for better user experience
 *    - Configured with error retry logic and stale time settings
 *
 * 2. Tooltip Provider:
 *    - Enables accessible tooltips throughout the application
 *    - Provides hover and focus context for interactive elements
 *    - Essential for user guidance and accessibility compliance
 *
 * 3. Global Layout and Styling:
 *    - Establishes full-height layout (min-h-screen)
 *    - Applies theme-aware background and text colors
 *    - Supports both light and dark mode themes
 *
 * 4. Toast Notification System:
 *    - Provides user feedback for actions and system events
 *    - Displays success, error, and informational messages
 *    - Positioned to avoid interference with main content
 *
 * 5. Application Router:
 *    - Handles all client-side navigation between pages
 *    - Maintains browser history and supports back/forward navigation
 *    - Provides seamless single-page application experience
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="mindcare-ui-theme">
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
