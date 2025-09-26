import React from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Clock, Brain } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "wouter";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, loading, sendVerificationEmail, logout } = useAuth();

  console.log(
    "🔍 PrivateRoute - Loading:",
    loading,
    "Current User:",
    currentUser?.email || "No user",
    "Email Verified:",
    currentUser?.emailVerified
  );

  // Show professional loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Animation */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="h-16 w-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">InnerSpring</h2>
          <LoadingSpinner size="lg" text="Verifying your authentication..." />
          <p className="text-gray-600 mt-4">
            Please wait while we secure your session
          </p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!currentUser) {
    console.log("🔄 No user found, redirecting to login...");
    return <Redirect to="/login" />;
  }

  // Show email verification required screen
  if (!currentUser.emailVerified) {
    console.log("📧 Email not verified, showing verification screen...");

    const handleResendVerification = async () => {
      try {
        await sendVerificationEmail();
        // Could show toast notification here
      } catch (error) {
        console.error("Failed to resend verification:", error);
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Failed to logout:", error);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden p-6">
        {/* Background Animation */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 rounded-3xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  className="h-16 w-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Email Verification Required
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Please verify your email address to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              <Alert className="border-blue-200 bg-blue-50">
                <Mail className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  We've sent a verification email to{" "}
                  <span className="font-semibold">{currentUser.email}</span>.
                  Please check your inbox and spam folder.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Shield className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Why verify your email?
                    </p>
                    <p className="text-xs text-gray-600">
                      Email verification helps protect your account and ensures
                      you receive important updates about your mental health
                      journey.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Clock className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Didn't receive the email?
                    </p>
                    <p className="text-xs text-gray-600">
                      Check your spam folder or click the button below to resend
                      the verification email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendVerification}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Resend Verification Email
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  Sign Out & Try Different Email
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                <p>
                  Need help? Contact our support team at{" "}
                  <span className="text-indigo-600 font-medium">
                    support@innerspring.com
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  console.log("✅ User authenticated and verified, showing protected content");
  return <>{children}</>;
};
