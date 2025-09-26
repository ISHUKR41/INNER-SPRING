import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "wouter";
import { Loader2, Shield, Brain, Heart, Lock } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const UltraProfessionalAuthGuard: React.FC<AuthGuardProps> = ({
  children,
}) => {
  const { currentUser, loading } = useAuth();

  console.log(
    "🔍 AuthGuard - Loading:",
    loading,
    "Current User:",
    currentUser?.email || "No user",
    "Email Verified:",
    currentUser?.emailVerified || false
  );

  // Enhanced Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 max-w-md mx-4">
          {/* Animated Logo */}
          <div className="relative mb-8">
            <div className="h-20 w-20 mx-auto bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Brain className="h-12 w-12 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-green-400 rounded-full border-4 border-white animate-bounce">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
              InnerSpring
            </h2>
            <p className="text-gray-600 font-medium">
              Authenticating your session...
            </p>
          </div>

          {/* Security Indicators */}
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="h-4 w-4 text-blue-500" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Private</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No user - redirect to login
  if (!currentUser) {
    console.log("🔄 No user found, redirecting to login...");
    return <Redirect to="/login" />;
  }

  // User not verified - redirect to verification
  if (!currentUser.emailVerified) {
    console.log("📧 User email not verified, redirecting to verification...");
    return <Redirect to="/verify-email" />;
  }

  console.log("✅ User authenticated and verified, showing protected content");
  return <>{children}</>;
};
