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
  User,
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
  Phone,
  Building,
  Calendar,
  Check,
  X,
  AlertTriangle,
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
import { Checkbox } from "../components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

// Advanced validation schema with comprehensive rules
const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name is too long")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name is too long")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .refine((email) => {
        // Block temporary email providers
        const blockedDomains = [
          "10minutemail.com",
          "guerrillamail.com",
          "mailinator.com",
          "tempmail.org",
        ];
        const domain = email.split("@")[1];
        return !blockedDomains.includes(domain);
      }, "Please use a permanent email address")
      .refine((email) => {
        // Ensure professional domains or common providers
        const allowedDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "live.com",
          "icloud.com",
        ];
        const domain = email.split("@")[1];
        return (
          allowedDomains.includes(domain) ||
          /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)
        );
      }, "Please use a valid email provider"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .optional()
      .refine((phone) => {
        if (!phone) return true;
        return (
          /^\+?[\d\s\-\(\)]+$/.test(phone) &&
          phone.replace(/\D/g, "").length >= 10
        );
      }, "Please enter a valid phone number"),
    age: z
      .string()
      .min(1, "Age is required")
      .refine((age) => {
        const ageNum = parseInt(age);
        return ageNum >= 13 && ageNum <= 120;
      }, "Age must be between 13 and 120"),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    }),
    marketingConsent: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const AdvancedProfessionalSignup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupProgress, setSignupProgress] = useState(0);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [step, setStep] = useState(1);
  const [emailExists, setEmailExists] = useState(false);

  const { signup, currentUser } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Form setup with react-hook-form and zod validation
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      age: "",
      termsAccepted: false,
      privacyAccepted: false,
      marketingConsent: false,
    },
    mode: "onChange", // Real-time validation
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

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
        setSignupProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setSignupProgress(0);
    }
  }, [isLoading]);

  // Email existence check (debounced)
  useEffect(() => {
    if (watchedEmail && !errors.email) {
      const timer = setTimeout(async () => {
        // Simulate email check - replace with actual API call
        setEmailExists(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [watchedEmail, errors.email]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setSecurityCheck(true);
    setSignupProgress(10);

    try {
      // Security validation simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSignupProgress(30);

      // Create user account
      await signup(data.email, data.password);
      setSignupProgress(80);

      toast({
        title: "Account Created Successfully",
        description:
          "Please check your email to verify your account before signing in.",
        variant: "default",
      });

      setSignupProgress(100);

      // Redirect to login with success message
      setTimeout(() => {
        console.log("✅ Account created, redirecting to login");
        setLocation("/login");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (errorMessage.includes("email-already-in-use")) {
        setEmailExists(true);
        form.setError("email", { message: "This email is already registered" });
      }
    } finally {
      setIsLoading(false);
      setSecurityCheck(false);
      setSignupProgress(0);
    }
  };

  // Real-time validation status
  const getEmailValidationStatus = () => {
    if (!watchedEmail) return null;
    if (emailExists) return "exists";
    if (errors.email) return "error";
    if (watchedEmail && !errors.email) return "success";
    return "validating";
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!watchedPassword) return 0;
    let strength = 0;
    if (watchedPassword.length >= 8) strength += 20;
    if (watchedPassword.length >= 12) strength += 10;
    if (/[A-Z]/.test(watchedPassword)) strength += 20;
    if (/[a-z]/.test(watchedPassword)) strength += 10;
    if (/[0-9]/.test(watchedPassword)) strength += 20;
    if (/[^A-Za-z0-9]/.test(watchedPassword)) strength += 20;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabel =
    passwordStrength < 40 ? "Weak" : passwordStrength < 80 ? "Good" : "Strong";
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  // Password validation checks
  const passwordChecks = [
    { test: (pwd: string) => pwd.length >= 8, label: "At least 8 characters" },
    { test: (pwd: string) => /[A-Z]/.test(pwd), label: "One uppercase letter" },
    { test: (pwd: string) => /[a-z]/.test(pwd), label: "One lowercase letter" },
    { test: (pwd: string) => /[0-9]/.test(pwd), label: "One number" },
    {
      test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
      label: "One special character",
    },
  ];

  // Success stories for social proof
  const successStories = [
    { metric: "50K+", label: "Users Helped", icon: UserCheck },
    { metric: "24/7", label: "Support", icon: Clock },
    { metric: "99.9%", label: "Uptime", icon: Shield },
  ];

  const totalSteps = 2;
  const currentStepProgress = (step / totalSteps) * 100;

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

            {/* Step Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Step {step} of {totalSteps}
                </span>
                <span className="text-sm text-white/80">
                  {Math.round(currentStepProgress)}% Complete
                </span>
              </div>
              <Progress
                value={currentStepProgress}
                className="h-2 bg-white/20"
              />
            </div>

            {/* Benefits */}
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
                    Your personal information is protected with bank-level
                    security.
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
                    AI-Powered Insights
                  </h3>
                  <p className="text-white/80">
                    Get personalized mental health recommendations and support.
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
                  <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                  <p className="text-white/80">
                    Access to licensed professionals and peer support community.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Success Metrics */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h4 className="text-lg font-semibold mb-6">Join our community</h4>
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

        {/* Right Side - Signup Form */}
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
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Join thousands who trust us with their mental health
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
                Create Your Account
              </motion.h1>
              <motion.p
                className="text-gray-600 text-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Start your mental health journey with personalized support
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
                  100% Secure
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-0"
                >
                  <Award className="h-3 w-3 mr-1" />
                  HIPAA Compliant
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
                        Creating Your Account
                      </p>
                      <Progress value={signupProgress} className="mt-2 h-2" />
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
                    {step === 1 ? "Personal Information" : "Account Security"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {step === 1
                      ? "Tell us about yourself"
                      : "Set up your secure account"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pb-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {step === 1 && (
                        <motion.div
                          className="space-y-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Name Fields */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span>First Name</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="John"
                                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <User className="h-4 w-4" />
                                    <span>Last Name</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Doe"
                                      className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Age Field */}
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Age</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="25"
                                    min="13"
                                    max="120"
                                    className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">
                                  You must be at least 13 years old to create an
                                  account
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Phone Field */}
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                  <Phone className="h-4 w-4" />
                                  <span>Phone Number (Optional)</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    className="h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs text-gray-500">
                                  For appointment reminders and emergency
                                  contacts
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={
                              !form.watch("firstName") ||
                              !form.watch("lastName") ||
                              !form.watch("age") ||
                              Boolean(errors.firstName) ||
                              Boolean(errors.lastName) ||
                              Boolean(errors.age)
                            }
                          >
                            Continue to Security
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          className="space-y-6"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
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
                                      placeholder="john.doe@example.com"
                                      className={cn(
                                        "h-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 pr-10",
                                        getEmailValidationStatus() ===
                                          "error" &&
                                          "border-red-300 focus:border-red-500 focus:ring-red-500",
                                        getEmailValidationStatus() ===
                                          "success" &&
                                          "border-green-300 focus:border-green-500 focus:ring-green-500",
                                        getEmailValidationStatus() ===
                                          "exists" &&
                                          "border-red-300 focus:border-red-500 focus:ring-red-500"
                                      )}
                                      disabled={isLoading}
                                    />
                                    {getEmailValidationStatus() ===
                                      "success" && (
                                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                                    )}
                                    {(getEmailValidationStatus() === "error" ||
                                      getEmailValidationStatus() ===
                                        "exists") && (
                                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Password Fields */}
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
                                      placeholder="Create a strong password"
                                      className="h-12 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                      disabled={isLoading}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-gray-100"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
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

                                {/* Password Strength */}
                                {watchedPassword && (
                                  <motion.div
                                    className="space-y-3"
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
                                          passwordStrength < 40
                                            ? "text-red-500"
                                            : passwordStrength < 80
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

                                    {/* Password Requirements */}
                                    <div className="grid grid-cols-1 gap-1">
                                      {passwordChecks.map((check, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center space-x-2"
                                        >
                                          {check.test(watchedPassword) ? (
                                            <Check className="h-3 w-3 text-green-500" />
                                          ) : (
                                            <X className="h-3 w-3 text-gray-400" />
                                          )}
                                          <span
                                            className={cn(
                                              "text-xs",
                                              check.test(watchedPassword)
                                                ? "text-green-600"
                                                : "text-gray-500"
                                            )}
                                          >
                                            {check.label}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                  <Lock className="h-4 w-4" />
                                  <span>Confirm Password</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      placeholder="Confirm your password"
                                      className={cn(
                                        "h-12 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500",
                                        watchedConfirmPassword &&
                                          watchedPassword &&
                                          watchedConfirmPassword ===
                                            watchedPassword &&
                                          "border-green-300 focus:border-green-500",
                                        watchedConfirmPassword &&
                                          watchedPassword &&
                                          watchedConfirmPassword !==
                                            watchedPassword &&
                                          "border-red-300 focus:border-red-500"
                                      )}
                                      disabled={isLoading}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-gray-100"
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      disabled={isLoading}
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                      ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                      )}
                                    </Button>
                                    {watchedConfirmPassword &&
                                      watchedPassword &&
                                      watchedConfirmPassword ===
                                        watchedPassword && (
                                        <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                                      )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Terms and Privacy */}
                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <FormField
                              control={form.control}
                              name="termsAccepted"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm text-gray-700">
                                      I accept the{" "}
                                      <Link href="/terms">
                                        <span className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
                                          Terms of Service
                                        </span>
                                      </Link>{" "}
                                      and{" "}
                                      <Link href="/privacy">
                                        <span className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer">
                                          Privacy Policy
                                        </span>
                                      </Link>
                                    </FormLabel>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="privacyAccepted"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm text-gray-700">
                                      I consent to the processing of my personal
                                      data for mental health services
                                    </FormLabel>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="marketingConsent"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm text-gray-700">
                                      Send me wellness tips and platform updates
                                      (optional)
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setStep(1)}
                              className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                              disabled={isLoading}
                            >
                              Back
                            </Button>
                            <Button
                              type="submit"
                              disabled={isLoading || !isValid}
                              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Creating Account...
                                </>
                              ) : (
                                <>
                                  Create Account
                                  <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </form>
                  </Form>

                  {/* Login Link */}
                  <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link href="/login">
                        <span className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200 cursor-pointer">
                          Sign in here
                        </span>
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer Security */}
            <motion.div
              className="text-center mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Bank-level Security</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>HIPAA Compliant</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Instant Verification</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedProfessionalSignup;
