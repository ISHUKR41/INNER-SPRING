import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";

export const VerifyEmail: React.FC = () => {
  const [, setLocation] = useLocation();
  const { verifyEmail, sendVerificationEmail, currentUser } = useAuth();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "pending"
  >("pending");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const actionCode = urlParams.get("oobCode");
    const mode = urlParams.get("mode");

    if (mode === "verifyEmail" && actionCode) {
      verifyEmailWithCode(actionCode);
    }
  }, []);

  const verifyEmailWithCode = async (actionCode: string) => {
    setStatus("loading");
    try {
      await verifyEmail(actionCode);
      setStatus("success");
      setMessage(
        "Your email has been successfully verified! Redirecting to login page..."
      );

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        setLocation("/login");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Email verification failed."
      );
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await sendVerificationEmail();
      setMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to send verification email."
      );
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4">
            {status === "loading" ? (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <LoadingSpinner size="sm" text="" />
              </div>
            ) : status === "success" ? (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : status === "error" ? (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>

          <CardTitle className="text-2xl font-bold">
            {status === "loading"
              ? "Verifying Email..."
              : status === "success"
              ? "Email Verified!"
              : status === "error"
              ? "Verification Failed"
              : "Check Your Email"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "pending" && (
            <>
              <p className="text-center text-gray-600">
                We've sent a verification link to your email address. Please
                click the link to verify your account.
              </p>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or click
                  below to resend.
                </p>

                <Button
                  onClick={handleResendVerification}
                  disabled={resending}
                  variant="outline"
                  className="w-full"
                >
                  {resending ? (
                    <>
                      <LoadingSpinner size="sm" text="" className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {(status === "success" || status === "error" || message) && (
            <Alert variant={status === "error" ? "destructive" : "default"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="pt-4">
            <Button
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
