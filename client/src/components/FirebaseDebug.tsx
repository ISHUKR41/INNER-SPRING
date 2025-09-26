import React, { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

export const FirebaseDebug: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("🔍 Auth State Changed:", currentUser);
    });

    return unsubscribe;
  }, []);

  const testEmailVerification = async () => {
    try {
      if (user) {
        const actionCodeSettings = {
          url: "https://inner-spring.firebaseapp.com/verify-email",
          handleCodeInApp: false,
        };

        await sendEmailVerification(user, actionCodeSettings);
        setMessage(`✅ Test verification email sent to: ${user.email}`);
        console.log("📧 Email verification test successful!");
      } else {
        setMessage("❌ No user logged in to test email");
      }
    } catch (error: any) {
      console.error("❌ Email test failed:", error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading Firebase Debug...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto m-4">
      <CardHeader>
        <CardTitle>🔥 Firebase Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Firebase Configuration:</h3>
          <div className="text-sm space-y-1">
            <p>📧 Project ID: inner-spring</p>
            <p>🌐 Auth Domain: inner-spring.firebaseapp.com</p>
            <p>🔑 API Key: AIzaSyBBcICkB_zO0GKQbd2RF0uMp1tX2b0og2k</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Current User Status:</h3>
          {user ? (
            <div className="text-sm space-y-1">
              <p>✅ User: {user.email}</p>
              <p>
                📧 Email Verified: {user.emailVerified ? "✅ Yes" : "❌ No"}
              </p>
              <p>🆔 UID: {user.uid.substring(0, 20)}...</p>
            </div>
          ) : (
            <p className="text-sm">❌ No user logged in</p>
          )}
        </div>

        {user && (
          <div className="space-y-2">
            <Button onClick={testEmailVerification} variant="outline">
              🧪 Test Email Verification
            </Button>
          </div>
        )}

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Next Steps:</h3>
          <div className="text-sm space-y-1">
            <p>1. ✅ Firebase project exists</p>
            <p>2. ⚠️ Need to enable Authentication in Firebase Console</p>
            <p>3. ⚠️ Need to register Web App properly</p>
            <p>4. 🔍 Check spam folder for emails</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
