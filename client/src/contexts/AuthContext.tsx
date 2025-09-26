import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthError,
  sendEmailVerification,
  applyActionCode,
  checkActionCode,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (actionCode: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send verification email immediately after signup with proper settings
      const actionCodeSettings = {
        url: "https://inner-spring.firebaseapp.com/verify-email",
        handleCodeInApp: false,
      };

      await sendEmailVerification(userCredential.user, actionCodeSettings);
      console.log(
        "✅ Verification email sent successfully to:",
        userCredential.user.email
      );
      console.log(
        "📧 Please check your email (including spam folder) for verification link"
      );

      // Sign out user until email is verified
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      console.error("❌ Signup error:", authError);
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Reload user to get latest email verification status
      await userCredential.user.reload();

      console.log(
        "🔍 User email verified status:",
        userCredential.user.emailVerified
      );

      // Check if email is verified after reload
      if (!userCredential.user.emailVerified) {
        await signOut(auth); // Sign out if email not verified
        throw new Error(
          "Please verify your email address before logging in. Check your inbox for a verification link."
        );
      }

      console.log(
        "✅ Login successful! User verified:",
        userCredential.user.email
      );
    } catch (error) {
      const authError = error as AuthError;
      console.error("❌ Login error:", authError);
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("🚪 Logging out user...");
      await signOut(auth);
      console.log("✅ Successfully logged out");

      // Clear any cached data
      localStorage.removeItem("webcrafters_chat_history");

      // Force reload to clear any app state
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw new Error("Failed to log out. Please try again.");
    }
  };

  const sendVerificationEmail = async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        const actionCodeSettings = {
          url: "https://inner-spring.firebaseapp.com/verify-email",
          handleCodeInApp: false,
        };

        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        console.log(
          "✅ Verification email sent successfully to:",
          auth.currentUser.email
        );
        console.log(
          "📧 Please check your email (including spam folder) for verification link"
        );
      } else {
        throw new Error("No user is currently signed in.");
      }
    } catch (error) {
      console.error("❌ Verification email error:", error);
      const authError = error as AuthError;
      if (authError.code === "auth/too-many-requests") {
        throw new Error(
          "Too many verification emails sent. Please wait before requesting another."
        );
      }
      throw new Error("Failed to send verification email. Please try again.");
    }
  };

  const verifyEmail = async (actionCode: string): Promise<void> => {
    try {
      await applyActionCode(auth, actionCode);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError.code));
    }
  };

  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      case "auth/invalid-action-code":
        return "Invalid or expired verification link.";
      case "auth/expired-action-code":
        return "Verification link has expired. Please request a new one.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Reload user to get latest email verification status
        await user.reload();
        console.log(
          "🔍 Auth state changed - User:",
          user.email,
          "Verified:",
          user.emailVerified
        );
      } else {
        console.log("🔍 Auth state changed - No user");
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    sendVerificationEmail,
    verifyEmail,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
