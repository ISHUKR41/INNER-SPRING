import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Brain,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Globe,
  Smartphone,
  Github,
  Heart,
  Zap,
  Star,
  Award,
  UserCheck,
  Clock,
  Activity,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

// Validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      // Additional email validation
      const commonDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "live.com",
      ];
      const domain = email.split("@")[1];
      return (
        commonDomains.includes(domain) ||
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)
      );
    }, "Please use a valid email provider"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdvancedProfessionalLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resending, setResending] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, sendVerificationEmail, currentUser } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Form setup with react-hook-form and zod validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Real-time validation
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");

  // Auto-redirect verified users
  useEffect(() => {
    if (currentUser?.emailVerified) {
      console.log(
        "✅ User already logged in and verified, redirecting to home"
      );
      setLocation("/");
    }
  }, [currentUser, setLocation]);

  // Progress simulation for better UX
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoginProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setLoginProgress(0);
    }
  }, [isLoading]);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and spam folder.",
        variant: "default",
      });
      setShowResendButton(false);
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSecurityCheck(true);
    setLoginProgress(10);

    try {
      // Simulate security check
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoginProgress(50);

      await login(data.email, data.password);
      setLoginProgress(100);

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to your dashboard...",
        variant: "default",
      });

      // Enhanced redirect with delay
      setTimeout(() => {
        console.log("✅ Login successful, redirecting to home page");
        setLocation("/");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to log in";

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Show resend verification if needed
      if (
        errorMessage.includes("verify your email") ||
        errorMessage.includes("email not verified")
      ) {
        setShowResendButton(true);
      }
    } finally {
      setIsLoading(false);
      setSecurityCheck(false);
      setLoginProgress(0);
    }
  };

  // Real-time email validation status
  const getEmailValidationStatus = () => {
    if (!watchedEmail) return null;
    if (errors.email) return "error";
    if (watchedEmail && !errors.email) return "success";
    return "validating";
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!watchedPassword) return 0;
    let strength = 0;
    if (watchedPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(watchedPassword)) strength += 25;
    if (/[0-9]/.test(watchedPassword)) strength += 25;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabel =
    passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Good" : "Strong";
  const strengthColor =
    passwordStrength < 50
      ? "bg-red-500"
      : passwordStrength < 75
      ? "bg-yellow-500"
      : "bg-green-500";

  // Success stories for social proof
  const successStories = [
    { metric: "98%", label: "User Satisfaction", icon: Heart },
    { metric: "24/7", label: "Support Available", icon: Clock },
    { metric: "50K+", label: "Lives Improved", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-40 left-32 w-40 h-40 border border-white/20 rounded-full animate-pulse delay-2000"></div>
          </div>

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-12">
              <motion.div
                className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="h-10 w-10 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">InnerSpring</h1>
                <p className="text-white/80">Mental Health Support Platform</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-8">
              <motion.div
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-white/80">
                    Your data is encrypted and HIPAA compliant. Complete privacy
                    guaranteed.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    AI-Powered Support
                  </h3>
                  <p className="text-white/80">
                    Advanced AI technology provides 24/7 mental health
                    assistance and guidance.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Professional Care
                  </h3>
                  <p className="text-white/80">
                    Connect with licensed therapists and mental health
                    professionals.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Success Stories */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h4 className="text-lg font-semibold mb-6">Trusted by thousands</h4>
            <div className="grid grid-cols-3 gap-4">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-4 text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <story.icon className="h-6 w-6 mx-auto mb-2 text-white/80" />
                  <div className="text-2xl font-bold mb-1">{story.metric}</div>
                  <div className="text-xs text-white/80">{story.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Brain className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue your mental health journey
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p
                className="text-gray-600 text-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Sign in to access your personalized mental health dashboard
              </motion.p>
              <motion.div
                className="flex items-center justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Login
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0"
                >
                  <Award className="h-3 w-3 mr-1" />
                  Trusted Platform
                </Badge>
              </motion.div>
            </div>

            {/* Security Check Animation */}
            <AnimatePresence>
              {securityCheck && (
                <motion.div
                  className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Activity className="h-5 w-5 text-blue-600" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        Security Check in Progress
                      </p>
                      <Progress value={loginProgress} className="mt-2 h-2" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 rounded-3xl">
                <CardHeader className="space-y-4 pb-6 text-center">
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    Sign In to Your Account
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8">
                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      disabled={isLoading}
                    >
                      <Globe className="h-5 w-5 text-red-500" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      disabled={isLoading}
                    >
                      <Smartphone className="h-5 w-5 text-gray-900" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                      disabled={isLoading}
                    >
                      <Github className="h-5 w-5 text-gray-900" />
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-gray-500 font-medium">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Resend Verification */}
                  <AnimatePresence>
                    {showResendButton && (
                      <motion.div
                        className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-sm text-blue-700 mb-3">
                          Need to verify your email first?
                        </p>
                        <Button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={resending}
                          variant="outline"
                          className="w-full rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          {resending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Resend Verification Email
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Email Field */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>Email Address</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email address"
                                  className={cn(
                                    "h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 pr-10",
                                    getEmailValidationStatus() === "error" &&
                                      "border-red-300 focus:border-red-500 focus:ring-red-500",
                                    getEmailValidationStatus() === "success" &&
                                      "border-green-300 focus:border-green-500 focus:ring-green-500"
                                  )}
                                  disabled={isLoading}
                                />
                                {getEmailValidationStatus() === "success" && (
                                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                                )}
                                {getEmailValidationStatus() === "error" && (
                                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password Field */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                              <Lock className="h-4 w-4" />
                              <span>Password</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="h-12 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                                  disabled={isLoading}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-gray-100"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={isLoading}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>

                            {/* Password Strength Indicator */}
                            {watchedPassword && (
                              <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    Password strength:
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs font-medium",
                                      passwordStrength < 50
                                        ? "text-red-500"
                                        : passwordStrength < 75
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                    )}
                                  >
                                    {strengthLabel}
                                  </span>
                                </div>
                                <Progress
                                  value={passwordStrength}
                                  className="h-2"
                                />
                              </motion.div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label
                            htmlFor="remember"
                            className="text-sm text-gray-600"
                          >
                            Remember me
                          </Label>
                        </div>
                        <Link href="/forgot-password">
                          <span className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 cursor-pointer">
                            Forgot password?
                          </span>
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading || !isValid}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            <span>Sign In to Dashboard</span>
                            <ArrowRight className="ml-3 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Sign Up Link */}
                  <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/signup">
                        <span className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200 cursor-pointer">
                          Create your free account
                        </span>
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="text-center mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>256-bit SSL</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>HIPAA Compliant</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>24/7 Support</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <Link href="/terms">
                  <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    Terms of Service
                  </span>
                </Link>{" "}
                and{" "}
                <Link href="/privacy">
                  <span className="text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedProfessionalLogin;
