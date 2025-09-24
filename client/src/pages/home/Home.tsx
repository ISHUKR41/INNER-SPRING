import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Framer Motion imports for smooth animations and interactions
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  useInView,
  useAnimation,
  AnimatePresence,
  stagger,
  useMotionValue,
  useMotionTemplate
} from "framer-motion";
import { 
  MessageCircle, 
  Calendar, 
  ClipboardList, 
  BookOpen, 
  Users, 
  Phone,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Building,
  Target,
  GraduationCap,
  DollarSign,
  ArrowRightLeft,
  Lightbulb,
  Handshake,
  Sprout,
  X,
  Quote,
  Brain,
  Bot,
  PhoneCall,
  BarChart3,
  UserCheck,
  Zap,
  Star,
  ChevronRight,
  Heart,
  PlayCircle,
  HelpCircle,
  ClipboardCheck,
  EyeOff
} from "lucide-react";

/**
 * MindCare Homepage - Enhanced Mental Health Platform
 * 
 * This comprehensive homepage serves as the primary entry point for students seeking mental health support.
 * It combines modern design principles with accessibility features, smooth animations, and responsive layouts.
 * 
 * Key Features:
 * - Framer Motion animations for enhanced user experience
 * - Fully responsive design (320px+ mobile, 768px+ tablet, 1200px+ desktop)
 * - Dark/light theme support with smooth transitions
 * - Scroll-triggered animations and micro-interactions
 * - Comprehensive accessibility features with ARIA labels
 * - Evidence-based content structure for mental health support
 * - Interactive elements with hover effects and loading states
 * 
 * Sections included:
 * 1. Hero section with animated entrance and trust indicators
 * 2. Crisis statistics with animated counters
 * 3. Feature showcase with detailed platform capabilities
 * 4. Platform security and privacy features
 * 5. Student success metrics and journey steps
 * 6. Common challenges with interactive cards
 * 7. Breaking barriers with testimonials
 * 8. Success stories carousel with auto-rotation
 * 9. Evidence-based approach and quality assurance
 * 10. FAQ with smooth accordion animations
 * 11. Call-to-action section with multiple entry points
 */
export default function Home() {
  // State management for interactive elements
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleStats, setVisibleStats] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Refs for scroll-triggered animations and intersection observers
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const journeyRef = useRef(null);
  
  // Framer Motion hooks for advanced animations
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  // Spring animation configuration for smooth, natural movement
  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 };
  const springY = useSpring(heroParallax, springConfig);
  
  // Intersection observer hooks for scroll-triggered animations
  const isHeroInView = useInView(heroRef, { once: true, threshold: 0.3 });
  const isStatsInView = useInView(statsRef, { once: true, threshold: 0.2 });
  const isFeaturesInView = useInView(featuresRef, { once: true, threshold: 0.1 });
  const isJourneyInView = useInView(journeyRef, { once: true, threshold: 0.1 });
  
  // Animation controls for complex sequences
  const heroControls = useAnimation();
  const statsControls = useAnimation();
  const featuresControls = useAnimation();

  // Crisis statistics data from specifications
  const crisisStatistics = [
    {
      number: "73%",
      description: "of students experienced a mental health crisis in the past year",
      source: "American College Health Association, 2024",
      icon: UserCheck,
      accent: "red"
    },
    {
      number: "60%", 
      description: "say mental health significantly impacted their academic performance",
      additional: "Leading to lower GPAs, course withdrawals, and delayed graduation",
      icon: TrendingDown,
      accent: "orange"
    },
    {
      number: "85%",
      description: "don't seek help due to stigma, cost, or lack of accessible services", 
      additional: "Traditional counseling centers serve only 15% of students needing help",
      icon: Shield,
      accent: "purple"
    },
    {
      number: "↗️ 35%",
      description: "increase in student suicidal ideation since 2020",
      additional: "Yet campus counseling resources haven't scaled to meet demand", 
      icon: AlertCircle,
      accent: "dark-red"
    }
  ];

  // Quick access feature tiles data - Updated to exact specifications
  const featureTiles = [
    {
      title: "24/7 AI Mental Health Support",
      description: "Immediate coping strategies, breathing exercises, and emotional support when you need it most",
      useCase: "Perfect for late-night anxiety, pre-exam stress, or sudden panic",
      button: "Start Chatting Now",
      icon: MessageCircle,
      gradient: "gradient-tile-blue-purple",
      href: "/chatbot",
      isEmergency: false,
      additionalInfo: null,
      privacyNote: null,
      contentNote: null,
      safetyNote: null
    },
    {
      title: "Campus Counselor Booking",
      description: "Schedule confidential appointments with licensed campus counselors and mental health professionals",
      useCase: "When you need deeper support, therapy, or professional diagnosis",
      button: "Book Appointment",
      icon: Calendar,
      gradient: "gradient-tile-green-teal",
      href: "/appointments",
      isEmergency: false,
      additionalInfo: "Average wait time: 2-3 days",
      privacyNote: null,
      contentNote: null,
      safetyNote: null
    },
    {
      title: "Evidence-Based Assessment",
      description: "Understand your mental health with validated tools used by professionals (PHQ-9, GAD-7, stress scales)",
      useCase: "When you want to understand what you're feeling",
      button: "Take Assessment",
      icon: ClipboardCheck,
      gradient: "gradient-tile-purple-pink",
      href: "/assessments",
      isEmergency: false,
      additionalInfo: null,
      privacyNote: "100% anonymous option available",
      contentNote: null,
      safetyNote: null
    },
    {
      title: "Self-Help Resource Library",
      description: "Videos, articles, audio guides, and interactive tools for managing anxiety, depression, stress, and more",
      useCase: "Learn coping skills at your own pace",
      button: "Browse Resources",
      icon: BookOpen,
      gradient: "gradient-tile-orange-yellow",
      href: "/resources",
      isEmergency: false,
      additionalInfo: null,
      privacyNote: null,
      contentNote: "Available in multiple languages",
      safetyNote: null
    },
    {
      title: "Student Support Community",
      description: "Connect with other students facing similar challenges in moderated, safe discussion groups",
      useCase: "When you feel alone or need peer understanding",
      button: "Join Community",
      icon: Users,
      gradient: "gradient-tile-teal-blue",
      href: "/peer-support",
      isEmergency: false,
      additionalInfo: null,
      privacyNote: null,
      contentNote: null,
      safetyNote: "Professionally moderated"
    },
    {
      title: "Emergency Crisis Support",
      description: "Immediate help for mental health emergencies, suicidal thoughts, or when you need help right now",
      useCase: "When you're in crisis and need immediate help",
      button: "Get Help Now",
      icon: Phone,
      gradient: "gradient-tile-red-orange",
      href: "/emergency",
      isEmergency: true,
      additionalInfo: null,
      privacyNote: null,
      contentNote: null,
      safetyNote: null
    }
  ];

  // 5-step journey data - Updated to match exact specifications
  const journeySteps = [
    {
      title: "Quick Assessment",
      description: "Share your concerns in a safe, judgment-free assessment",
      time: "2-3 minutes", 
      icon: ClipboardCheck,
      action: "Start Assessment",
      href: "/assessments",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Immediate Support",
      description: "Get instant coping strategies from our AI assistant",
      time: "Instant access",
      icon: MessageCircle, 
      action: "Chat Now",
      href: "/chatbot",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Connect with Professional",
      description: "Schedule with licensed counselors who understand students",
      time: "Same day",
      icon: UserCheck,
      action: "Book Session", 
      href: "/appointments",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Build Your Toolkit", 
      description: "Access personalized coping strategies and self-help tools",
      time: "Ongoing",
      icon: BookOpen,
      action: "Explore Resources",
      href: "/resources",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Join Community",
      description: "Connect with supportive peer groups and study wellness", 
      time: "When ready",
      icon: Users,
      action: "Join Groups",
      href: "/peer-support",
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    }
  ];

  // Student challenge cards data - Updated to exact specifications
  const challengeCards = [
    {
      title: "Academic Pressure",
      description: "Overwhelming coursework, perfectionism, and fear of failure affecting your studies and mental health",
      symptoms: "Anxiety before exams, procrastination, feeling never good enough",
      icon: GraduationCap,
      accent: "blue"
    },
    {
      title: "Social Isolation",
      description: "Difficulty making connections, loneliness, and social anxiety in college environments",
      symptoms: "Feeling left out, fear of judgment, avoiding social situations",
      icon: Users,
      accent: "green"
    },
    {
      title: "Financial Stress",
      description: "Money worries, student loans, and working while studying creating additional pressure",
      symptoms: "Constant worry about money, sleep loss, avoiding activities due to cost",
      icon: DollarSign,
      accent: "orange"
    },
    {
      title: "Life Transitions",
      description: "Adjusting to independence, changing relationships, and uncertain future plans",
      symptoms: "Feeling overwhelmed by change, identity confusion, homesickness",
      icon: ArrowRightLeft,
      accent: "purple"
    }
  ];

  // Traditional barriers vs our solutions
  const traditionalBarriers = [
    "Wait 3-6 weeks for counseling appointment",
    "Limited hours (9 AM - 5 PM only)",
    "Fear of judgment and stigma",
    "No immediate help during crisis",
    "One-size-fits-all approach"
  ];

  const ourSolutions = [
    "24/7 AI support and immediate coping strategies",
    "Same-day professional appointment booking",
    "Complete anonymity options available",
    "Instant crisis intervention protocols",
    "Personalized support based on your needs"
  ];

  // Breaking barriers data - Updated to exact specifications with 3 columns
  const breakingBarriers = [
    {
      icon: EyeOff,
      title: "Fear of Judgment & Stigma",
      description: "Breaking down privacy concerns and social stigma around mental health",
      concerns: [
        "What if people find out?",
        "Will this affect my future?", 
        "Am I weak for needing help?",
        "What will my family think?"
      ],
      solutions: [
        "100% anonymous usage options",
        "No names required for AI chat",
        "Private, encrypted conversations",
        "Confidential professional appointments",
        "HIPAA-compliant data protection"
      ],
      testimonial: "I was terrified someone would find out, but the anonymous chat gave me the courage to eventually book counseling.",
      attribution: "Anonymous Junior",
      accent: "purple"
    },
    {
      icon: Clock,
      title: "Limited Access & Long Wait Times",
      description: "Solving accessibility and availability barriers to mental health care",
      concerns: [
        "Counseling center is always booked",
        "I need help at 2 AM, not 2 PM",
        "I can't miss class for appointments",
        "I can't afford private therapy"
      ],
      solutions: [
        "24/7 AI support, never closed",
        "Same-day professional appointments available",
        "Flexible scheduling around your classes",
        "Free campus counseling integration",
        "Multiple communication options (text, video, phone)"
      ],
      testimonial: "Having AI support at 3 AM during finals week literally saved me from a complete breakdown.",
      attribution: "Anonymous Senior",
      accent: "blue"
    },
    {
      icon: HelpCircle,
      title: "Not Knowing When/How to Get Help",
      description: "Providing clarity and guidance for mental health support navigation",
      concerns: [
        "Is this normal college stress or something more?",
        "How do I know if I need professional help?",
        "Where do I even start?",
        "What if I'm overreacting?"
      ],
      solutions: [
        "Evidence-based self-assessments for clarity",
        "Educational resources about mental health",
        "Clear guidance on when to seek help",
        "Step-by-step support navigation",
        "Professional validation of your experiences"
      ],
      testimonial: "The assessment helped me realize that what I was feeling wasn't just 'normal stress' and I deserved support.",
      attribution: "Anonymous Sophomore",
      accent: "green"
    }
  ];

  // Success stories carousel data
  const successStories = [
    {
      studentType: "Freshman, Pre-Med Student",
      challenge: "Severe social anxiety and panic attacks",
      timeline: "6 months of using platform",
      quote: "I went from having panic attacks before every class to confidently presenting my research. The AI chat taught me breathing techniques, and my counselor helped me understand my triggers. My GPA went from 2.1 to 3.8.",
      outcomes: [
        "Anxiety reduced by 80%",
        "GPA improvement of 1.7 points", 
        "Now helps other students as peer mentor"
      ]
    },
    {
      studentType: "Junior, International Student",
      challenge: "Depression, isolation, cultural adjustment",
      timeline: "8 months of comprehensive support",
      quote: "I felt completely alone and was planning to drop out. The peer support forum showed me I wasn't the only one struggling. My counselor helped me understand that depression isn't a personal failure. I'm now thriving in my major.",
      outcomes: [
        "Depression scores improved from severe to minimal",
        "Formed lasting friendships through peer support",
        "Became cultural liaison for international students"
      ]
    },
    {
      studentType: "Senior, First-Generation College",
      challenge: "Suicidal ideation, financial stress, family pressure",
      timeline: "Crisis intervention to 18 months of growth",
      quote: "During my darkest moment, the crisis chat connected me to help immediately. The counselor met me within hours. Now I understand that asking for help was the strongest thing I could do. I graduate next month with honors.",
      outcomes: [
        "Crisis successfully managed with immediate intervention",
        "Graduated with 3.9 GPA",
        "Now works as peer counselor training program"
      ]
    }
  ];

  // FAQ data
  const faqData = [
    {
      question: "Will anyone at my school know I'm using this?",
      answer: "Your privacy is completely protected. You can use our platform entirely anonymously - no names, student IDs, or personal information required for AI chat or self-assessments. If you choose professional counseling, those appointments follow strict HIPAA confidentiality rules, meaning counselors cannot share information without your explicit consent. Your school administration has no access to your usage data or records."
    },
    {
      question: "Is this only for students with 'serious' mental health problems?",
      answer: "Absolutely not! Mental health exists on a spectrum, and everyone deserves support regardless of where they are on that spectrum. Our platform is designed for students experiencing everything from everyday stress and mild anxiety to more significant mental health challenges. Prevention and early intervention are just as important as crisis support. If you're wondering whether you 'qualify' for help, you already do."
    },
    {
      question: "How much does this cost and will insurance be involved?",
      answer: "Our AI support, self-assessments, peer forums, and educational resources are completely free. Campus counseling appointments are typically covered by your student health fees at no additional cost. For off-campus therapy referrals, we help you understand your insurance options and connect you with sliding-scale or low-cost providers when needed. Financial barriers should never prevent you from getting help."
    },
    {
      question: "What if I'm not sure I really need help?",
      answer: "Uncertainty is completely normal and valid. You don't need to have everything figured out to start exploring support. Begin with our anonymous self-assessment - it takes just 5 minutes and can help clarify what you're experiencing. Remember: seeking support is a sign of self-awareness and strength, not weakness. You deserve care and support simply because you're human."
    },
    {
      question: "Can this replace seeing a real therapist?",
      answer: "Our platform is designed to complement, not replace, professional therapy. AI support is excellent for immediate coping strategies, crisis intervention, and ongoing check-ins, while licensed counselors provide deeper therapeutic work, diagnosis, and specialized treatment. We help you determine when professional help is essential and facilitate those connections. Think of us as your mental health support team."
    },
    {
      question: "What happens if I mention suicide or self-harm?",
      answer: "Your safety is our absolute priority. If you express thoughts of suicide or self-harm, our AI will immediately connect you with crisis intervention resources and trained professionals. This may include campus counselors, local crisis teams, or emergency services if you're in immediate danger. We follow evidence-based crisis response protocols to ensure you get the immediate help you need."
    },
    {
      question: "How do I know this will actually help me?",
      answer: "Our platform is built on evidence-based mental health practices with a 94% user satisfaction rate. However, we believe in your autonomy - you can explore our resources risk-free with no commitment. Start with anonymous browsing, try our AI chat, or take a self-assessment. You maintain complete control over your experience and can engage at whatever level feels right for you."
    },
    {
      question: "What if my family/culture doesn't believe in mental health treatment?",
      answer: "We understand and respect cultural differences around mental health. Our platform offers culturally sensitive resources and can connect you with counselors who understand your cultural background. You can begin completely anonymously to explore support on your own terms. We also provide resources for navigating family conversations about mental health when you're ready."
    },
    {
      question: "Will this show up on my academic or medical records?",
      answer: "Anonymous platform usage (AI chat, assessments, forums) creates no records. Campus counseling appointments may be noted in your student health records but are kept completely separate from academic records and cannot affect your grades or standing. Off-campus therapy is private between you and your provider. We're transparent about what gets documented where."
    },
    {
      question: "How is this different from other mental health apps?",
      answer: "We're specifically designed for the unique challenges of student life - academic pressure, social transitions, financial stress, and identity development. Unlike generic apps, we integrate directly with campus resources, provide same-day professional appointments, and offer 24/7 crisis support. Our AI is trained on student-specific mental health scenarios and evidence-based practices."
    }
  ];

  // Take action options
  const actionOptions = [
    {
      title: "Browse Resources Anonymously",
      description: "No signup required - explore helpful content immediately",
      time: "Start in 30 seconds",
      href: "/resources",
      icon: BookOpen
    },
    {
      title: "Take Mental Health Assessment", 
      description: "5-minute private screening to understand your needs",
      time: "Results in 5 minutes",
      href: "/assessments",
      icon: ClipboardList
    },
    {
      title: "Chat with AI Support",
      description: "Get instant coping strategies and emotional support",
      time: "Connected immediately", 
      href: "/chatbot",
      icon: Bot
    },
    {
      title: "Schedule Professional Counseling",
      description: "Connect with licensed counselors when ready",
      time: "Appointments available today",
      href: "/appointments",
      icon: Calendar
    }
  ];

  // Detailed platform features showcase data - Enhanced capabilities section
  const platformFeatures = [
    {
      title: "AI-Powered Mental Health Assistant",
      description: "Advanced conversational AI trained on evidence-based therapeutic techniques",
      capabilities: [
        "Cognitive Behavioral Therapy (CBT) strategies",
        "Crisis intervention and de-escalation",
        "Personalized coping mechanism recommendations",
        "24/7 availability for immediate support",
        "Multi-language support for diverse student populations"
      ],
      icon: Brain,
      accent: "blue",
      stats: "94% effectiveness rate"
    },
    {
      title: "Professional Counselor Network",
      description: "Licensed mental health professionals specializing in student populations",
      capabilities: [
        "Individual therapy sessions (in-person & virtual)",
        "Group therapy and support circles",
        "Crisis intervention and emergency response",
        "Specialized services (trauma, anxiety, depression)",
        "Cultural competency and diversity awareness"
      ],
      icon: UserCheck,
      accent: "green",
      stats: "150+ licensed professionals"
    },
    {
      title: "Evidence-Based Assessment Tools",
      description: "Clinically validated screening instruments used by mental health professionals",
      capabilities: [
        "PHQ-9 (Depression screening)",
        "GAD-7 (Anxiety assessment)",
        "Stress level monitoring tools",
        "Academic performance impact analysis",
        "Personalized mental health insights"
      ],
      icon: ClipboardCheck,
      accent: "purple",
      stats: "12 validated assessment tools"
    },
    {
      title: "Peer Support Community",
      description: "Safe, moderated spaces for students to connect and share experiences",
      capabilities: [
        "Anonymous discussion forums",
        "Peer mentor matching programs",
        "Study group formation tools",
        "Crisis buddy system",
        "Success story sharing platform"
      ],
      icon: Users,
      accent: "teal",
      stats: "10,000+ active community members"
    },
    {
      title: "Comprehensive Resource Library",
      description: "Curated collection of mental health education and self-help materials",
      capabilities: [
        "Interactive coping strategy guides",
        "Meditation and mindfulness exercises",
        "Academic stress management tools",
        "Sleep hygiene and wellness programs",
        "Crisis prevention educational content"
      ],
      icon: BookOpen,
      accent: "orange",
      stats: "500+ resources available"
    },
    {
      title: "Crisis Intervention System",
      description: "Immediate response protocols for mental health emergencies",
      capabilities: [
        "24/7 crisis hotline connectivity",
        "Emergency service coordination",
        "Safety planning and follow-up",
        "Campus security integration",
        "Family notification protocols (when appropriate)"
      ],
      icon: Phone,
      accent: "red",
      stats: "< 2 minute average response time"
    }
  ];

  // Platform security and privacy features - Building trust through transparency
  const securityFeatures = [
    {
      title: "HIPAA-Compliant Data Protection",
      description: "Healthcare-grade security standards for all personal information",
      features: [
        "End-to-end encryption for all communications",
        "Secure data storage with regular audits",
        "Limited access controls and authentication",
        "Regular security penetration testing"
      ],
      icon: Shield,
      color: "blue"
    },
    {
      title: "Anonymous Usage Options",
      description: "Complete privacy protection for students concerned about confidentiality",
      features: [
        "No personal information required for AI chat",
        "Anonymous self-assessment completion",
        "Pseudonym-based community participation",
        "Optional identity verification for professional services"
      ],
      icon: EyeOff,
      color: "purple"
    },
    {
      title: "Professional Confidentiality",
      description: "Strict adherence to mental health professional ethical standards",
      features: [
        "Licensed counselor-client privilege",
        "Mandatory reporting protocols clearly explained",
        "Consent-based information sharing",
        "Transparent privacy policy and data usage"
      ],
      icon: UserCheck,
      color: "green"
    },
    {
      title: "Platform Security Infrastructure",
      description: "Enterprise-level technical security measures",
      features: [
        "Multi-factor authentication options",
        "Regular automated security updates",
        "Intrusion detection and prevention systems",
        "Disaster recovery and data backup protocols"
      ],
      icon: Zap,
      color: "orange"
    }
  ];

  // Student success metrics with visual indicators - Demonstrating real impact
  const successMetrics = [
    {
      category: "Academic Performance",
      metrics: [
        { label: "GPA Improvement", value: "1.2 points average", change: "+23%", icon: TrendingUp, color: "green" },
        { label: "Course Completion Rate", value: "89%", change: "+15%", icon: GraduationCap, color: "blue" },
        { label: "Student Retention", value: "94%", change: "+8%", icon: Target, color: "purple" }
      ]
    },
    {
      category: "Mental Health Outcomes",
      metrics: [
        { label: "Depression Symptoms", value: "67% reduction", change: "-67%", icon: TrendingDown, color: "green" },
        { label: "Anxiety Levels", value: "71% improvement", change: "-71%", icon: Heart, color: "blue" },
        { label: "Crisis Incidents", value: "78% reduction", change: "-78%", icon: Shield, color: "purple" }
      ]
    },
    {
      category: "Platform Engagement",
      metrics: [
        { label: "Daily Active Users", value: "12,000+", change: "+156%", icon: Users, color: "teal" },
        { label: "Session Completion Rate", value: "91%", change: "+12%", icon: CheckCircle, color: "green" },
        { label: "User Satisfaction", value: "4.8/5.0", change: "+0.3", icon: Star, color: "orange" }
      ]
    }
  ];

  // Enhanced scroll and animation effects
  useEffect(() => {
    // Track scroll position for navigation highlighting and parallax effects
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger animations when sections come into view
  useEffect(() => {
    if (isHeroInView) {
      heroControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }
  }, [isHeroInView, heroControls]);

  useEffect(() => {
    if (isStatsInView) {
      setVisibleStats(true);
      statsControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, staggerChildren: 0.1 }
      });
    }
  }, [isStatsInView, statsControls]);

  useEffect(() => {
    if (isFeaturesInView) {
      featuresControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }
      });
    }
  }, [isFeaturesInView, featuresControls]);

  // Animated counter component for statistics
  const AnimatedCounter = ({ end, suffix = "", duration = 2 }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    
    useEffect(() => {
      if (visibleStats && !hasStarted) {
        setHasStarted(true);
        const endValue = parseInt(end.replace(/[^0-9]/g, ''));
        const increment = endValue / (duration * 60); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= endValue) {
            setCount(endValue);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 1000 / 60);
        
        return () => clearInterval(timer);
      }
    }, [visibleStats, hasStarted, end, duration]);
    
    return <span>{count}{suffix}</span>;
  };

  // Carousel autoplay for success stories with enhanced controls
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % successStories.length);
    }, 7000); // Slightly longer duration for better readability
    return () => clearInterval(timer);
  }, [successStories.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Section 1: Hero Banner - Enhanced with Framer Motion Animations */}
      <motion.section 
        ref={heroRef}
        className="hero-section relative overflow-hidden min-h-screen flex items-center" 
        data-testid="section-hero"
        style={{ y: springY, opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Background Elements with Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full blur-lg"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Main Hero Content Container with Enhanced Layout */}
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            
            {/* Left Content - Enhanced with Staggered Animations */}
            <motion.div 
              className="space-y-8 lg:space-y-10" 
              data-testid="hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
            >
              {/* Main Headlines with Gradient Text Effects */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading leading-tight" data-testid="text-main-headline">
                  <motion.span 
                    className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    Your Mental Health
                  </motion.span>
                  <motion.span 
                    className="block text-foreground mt-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Journey Starts Here
                  </motion.span>
                </h1>
                
                <motion.h2 
                  className="text-xl sm:text-2xl lg:text-3xl font-semibold text-muted-foreground leading-relaxed max-w-2xl" 
                  data-testid="text-secondary-headline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Safe, Confidential, Professional Support Available 24/7
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-muted-foreground max-w-2xl leading-relaxed" 
                  data-testid="text-hero-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  Break free from the barriers that prevent students from accessing mental health support. 
                  Our evidence-based platform combines AI-powered assistance, professional counseling, 
                  and peer community support—all designed specifically for the unique challenges of college life.
                </motion.p>
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6" data-testid="hero-cta-buttons">
                <Button 
                  asChild
                  size="lg" 
                  className="btn-professional px-8 py-4 text-lg font-semibold rounded-xl w-full sm:w-auto group"
                >
                  <Link href="/assessments" data-testid="button-start-assessment">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="btn-secondary-outline px-8 py-4 text-lg font-semibold rounded-xl w-full sm:w-auto group"
                >
                  <Link href="/chatbot" data-testid="button-chat-ai">
                    <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Chat with AI Now
                  </Link>
                </Button>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6" data-testid="trust-indicators">
                {[
                  { text: "100% Confidential", icon: Shield },
                  { text: "HIPAA Secure", icon: CheckCircle },
                  { text: "24/7 Available", icon: Clock },
                  { text: "Evidence-Based", icon: Award }
                ].map((indicator, index) => (
                  <div key={index} className="trust-indicator group" data-testid={`trust-indicator-${index}`}>
                    <div className="trust-checkmark">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-high-contrast group-hover:text-primary transition-colors">
                      {indicator.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Enhanced Hero Illustration */}
            <div className="relative fade-in" data-testid="hero-illustration" style={{animationDelay: '0.3s'}}>
              <div className="hero-illustration p-8 floating">
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl rotate-12 floating-delayed"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-full floating"></div>
                <div className="absolute top-1/4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-400 rounded-lg rotate-45 floating-delayed"></div>
                
                <div className="space-y-8 relative z-10">
                  {/* Central focus */}
                  <div className="text-center">
                    <div className="w-24 h-24 gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg floating">
                      <Brain className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-card-title text-high-contrast mb-3 font-semibold" data-testid="text-wellness-title">
                      Supporting Student Wellness
                    </h3>
                    <p className="text-body text-medium-contrast max-w-sm mx-auto" data-testid="text-wellness-description">
                      Join thousands of students finding their path to mental wellness
                    </p>
                  </div>
                  
                  {/* Feature grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Users, label: "Community", color: "text-blue-500" },
                      { icon: Shield, label: "Privacy", color: "text-green-500" },
                      { icon: Heart, label: "Care", color: "text-pink-500" },
                      { icon: Clock, label: "24/7", color: "text-purple-500" },
                      { icon: Target, label: "Goals", color: "text-orange-500" },
                      { icon: Award, label: "Quality", color: "text-teal-500" }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 group" data-testid={`hero-feature-${index}`}>
                        <item.icon className={`h-6 w-6 ${item.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                        <span className="text-small text-medium-contrast font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Wellness metrics */}
                  <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/30">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-emphasis">15K+</div>
                        <div className="text-small text-medium-contrast">Students</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emphasis">94%</div>
                        <div className="text-small text-medium-contrast">Success</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emphasis">24/7</div>
                        <div className="text-small text-medium-contrast">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Problem Awareness Statistics - Enhanced with Animated Counters */}
      <motion.section 
        ref={statsRef}
        className="stats-section py-16 lg:py-24" 
        data-testid="section-crisis-stats"
        initial={{ opacity: 0, y: 50 }}
        animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, staggerChildren: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Enhanced Typography and Animation */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-red-600 dark:text-red-400 mb-6 leading-tight" data-testid="text-crisis-title">
              The Student Mental Health Crisis Demands Immediate Action
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="text-crisis-subtitle">
              The numbers reveal an urgent need for accessible, comprehensive mental health support
            </p>
          </motion.div>

          {/* Enhanced Statistics Grid with Stagger Animation */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" 
            data-testid="crisis-statistics-grid"
            initial={{ opacity: 0 }}
            animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.15, delayChildren: 0.4 }}
          >
            {crisisStatistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isStatsInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <Card 
                  className={`crisis-card-${stat.accent} text-center p-8 group cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 border-transparent hover:border-${stat.accent}/20`} 
                  data-testid={`stat-card-${index}`}
                  tabIndex={0}
                  role="article"
                  aria-label={`Crisis statistic: ${stat.number} ${stat.description}`}
                >
                  <CardContent className="space-y-6">
                    {/* Enhanced Icon with Advanced Animation */}
                    <motion.div 
                      className={`w-20 h-20 mx-auto rounded-2xl crisis-icon-${stat.accent} flex items-center justify-center shadow-lg`}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 5,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <stat.icon className="h-10 w-10" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Animated Counter for Statistics */}
                    <motion.div 
                      className={`text-5xl md:text-6xl crisis-stat-${stat.accent} font-bold leading-none tracking-tight`} 
                      data-testid={`stat-number-${index}`}
                      initial={{ scale: 0 }}
                      animate={isStatsInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1, type: "spring" }}
                    >
                      {visibleStats && stat.number.includes('%') ? (
                        <><AnimatedCounter end={stat.number} duration={2} />%</>
                      ) : visibleStats && /\d/.test(stat.number) ? (
                        <AnimatedCounter end={stat.number} duration={2} />
                      ) : (
                        stat.number
                      )}
                    </motion.div>
                    
                    {/* Enhanced Description with Better Typography */}
                    <motion.p 
                      className="text-lg font-medium text-foreground leading-tight" 
                      data-testid={`stat-description-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      {stat.description}
                    </motion.p>
                    
                    {/* Additional Information with Enhanced Styling */}
                    {stat.additional && (
                      <motion.p 
                        className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-current pl-4 ml-2 opacity-90" 
                        data-testid={`stat-additional-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isStatsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      >
                        {stat.additional}
                      </motion.p>
                    )}
                    
                    {/* Source Attribution with Professional Styling */}
                    <motion.div 
                      className="pt-2 border-t border-border"
                      initial={{ opacity: 0 }}
                      animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    >
                      <p className="text-xs text-muted-foreground font-medium tracking-wide" data-testid={`stat-source-${index}`}>
                        {stat.source}
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2.5: Detailed Platform Features Showcase - New Enhanced Section */}
      <motion.section 
        ref={featuresRef}
        className="py-20 lg:py-28 bg-gradient-to-br from-background via-muted/20 to-background" 
        data-testid="section-platform-features"
        initial={{ opacity: 0 }}
        animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              Comprehensive Mental Health Platform
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Every feature designed with student mental health expertise and evidence-based practices
            </p>
          </motion.div>

          {/* Platform Features Grid */}
          <motion.div 
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12"
            initial={{ opacity: 0 }}
            animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.1, delayChildren: 0.4 }}
          >
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <Card className="h-full p-8 bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl group">
                  <CardContent className="space-y-6">
                    {/* Feature Icon and Title */}
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className={`p-4 rounded-2xl bg-gradient-to-br from-${feature.accent}-500/10 to-${feature.accent}-600/10 border border-${feature.accent}-500/20`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className={`h-8 w-8 text-${feature.accent}-500`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1 rounded-full inline-block">
                          {feature.stats}
                        </p>
                      </div>
                    </div>

                    {/* Feature Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature Capabilities List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        Key Capabilities:
                      </h4>
                      <motion.ul 
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={hoveredFeature === index ? { opacity: 1 } : { opacity: 0.7 }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.capabilities.map((capability, capIndex) => (
                          <motion.li 
                            key={capIndex} 
                            className="flex items-start space-x-3 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={hoveredFeature === index ? { opacity: 1, x: 0 } : { opacity: 0.8, x: 0 }}
                            transition={{ duration: 0.3, delay: capIndex * 0.05 }}
                          >
                            <CheckCircle className={`h-4 w-4 text-${feature.accent}-500 mt-0.5 flex-shrink-0`} />
                            <span className="text-muted-foreground">{capability}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                    {/* Interactive Feature Access Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline" 
                        className={`w-full group border-${feature.accent}-500/20 hover:border-${feature.accent}-500/40 hover:bg-${feature.accent}-500/5 transition-all duration-300`}
                      >
                        <span className="mr-2">Explore Feature</span>
                        <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 text-${feature.accent}-500`} />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2.6: Platform Security and Privacy Features - New Section */}
      <motion.section 
        className="py-20 lg:py-28 bg-gradient-to-br from-muted/10 to-primary/5" 
        data-testid="section-security-features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, threshold: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Your Privacy & Security
              </span>
              <span className="block text-foreground mt-2">Are Our Top Priority</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Healthcare-grade security standards with complete transparency about data protection
            </p>
          </motion.div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((security, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                viewport={{ once: true }}
              >
                <Card className="h-full p-6 bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
                  <CardContent className="space-y-6">
                    {/* Security Icon */}
                    <motion.div 
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-${security.color}-500/10 to-${security.color}-600/10 flex items-center justify-center border border-${security.color}-500/20`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <security.icon className={`h-8 w-8 text-${security.color}-500`} />
                    </motion.div>

                    {/* Security Title and Description */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {security.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {security.description}
                      </p>
                    </div>

                    {/* Security Features List */}
                    <ul className="space-y-2">
                      {security.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-start space-x-2 text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + featureIndex * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className={`h-3 w-3 text-${security.color}-500 mt-0.5 flex-shrink-0`} />
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 2.7: Student Success Metrics - New Section */}
      <motion.section 
        className="py-20 lg:py-28" 
        data-testid="section-success-metrics"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, threshold: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Proven Results
              </span>
              <span className="block text-foreground mt-2">Real Impact on Student Lives</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Data-driven evidence of how our platform transforms student mental health and academic success
            </p>
          </motion.div>

          {/* Success Metrics Categories */}
          <div className="space-y-16">
            {successMetrics.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {category.category}
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {category.metrics.map((metric, metricIndex) => (
                    <motion.div
                      key={metricIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: metricIndex * 0.1 }}
                      whileHover={{ 
                        y: -5,
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      }}
                      viewport={{ once: true }}
                    >
                      <Card className="text-center p-8 bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group">
                        <CardContent className="space-y-6">
                          {/* Metric Icon */}
                          <motion.div 
                            className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-${metric.color}-500/10 to-${metric.color}-600/10 flex items-center justify-center border border-${metric.color}-500/20`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <metric.icon className={`h-8 w-8 text-${metric.color}-500`} />
                          </motion.div>

                          {/* Metric Value */}
                          <div>
                            <motion.div 
                              className={`text-4xl md:text-5xl font-bold text-${metric.color}-500 mb-2`}
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.3 + metricIndex * 0.1, type: "spring" }}
                              viewport={{ once: true }}
                            >
                              {metric.value}
                            </motion.div>
                            <p className="text-lg font-medium text-foreground mb-2">
                              {metric.label}
                            </p>
                            <motion.div 
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                metric.change.startsWith('+') 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.5 + metricIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              {metric.change.startsWith('+') ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              {metric.change}
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 3: Solution Promise */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-secondary)' }} data-testid="section-solution-promise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-hero text-high-contrast mb-4" data-testid="text-solution-title">
              We're Changing How Students Access Mental Health Support
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16" data-testid="comparison-grid">
            {/* Traditional Barriers */}
            <div data-testid="traditional-barriers">
              <h3 className="text-card-title text-red-600 dark:text-red-400 mb-8 flex items-center">
                <X className="h-6 w-6 mr-3" />
                Traditional Barriers
              </h3>
              <div className="space-y-4">
                {traditionalBarriers.map((barrier, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg" data-testid={`barrier-${index}`}>
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-body text-medium-contrast">{barrier}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Solutions */}
            <div data-testid="our-solutions">
              <h3 className="text-card-title text-green-600 dark:text-green-400 mb-8 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                Our Solution
              </h3>
              <div className="space-y-4">
                {ourSolutions.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg" data-testid={`solution-${index}`}>
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-body text-medium-contrast">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Success Story Preview */}
          <Card className="card-professional bg-primary/10 dark:bg-primary/5 border-primary/20 mb-16" data-testid="success-story-preview">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <Quote className="h-12 w-12 text-primary mx-auto" />
                
                <blockquote className="text-lead text-high-contrast italic" data-testid="text-preview-quote">
                  "I went from having daily panic attacks to managing my anxiety confidently. The 24/7 AI chat was there when I needed it most at 2 AM, and it connected me to a counselor who changed my life."
                </blockquote>
                
                <div className="space-y-2">
                  <p className="text-card-subtitle text-emphasis" data-testid="text-preview-author">
                    Sarah M., Junior Psychology Major
                  </p>
                  <p className="text-body-large text-green-600 dark:text-green-400 font-semibold" data-testid="text-preview-result">
                    Anxiety reduced by 70% in 3 months
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Numbers */}
          <div className="grid md:grid-cols-3 gap-8" data-testid="impact-numbers">
            {[
              { number: "15,000+", text: "students already supported" },
              { number: "94%", text: "report improved mental health" },
              { number: "under 30 seconds", text: "average response time" }
            ].map((metric, index) => (
              <div key={index} className="text-center" data-testid={`impact-metric-${index}`}>
                <div className="text-stat-number text-emphasis mb-2" data-testid={`impact-number-${index}`}>{metric.number}</div>
                <p className="text-body text-low-contrast" data-testid={`impact-text-${index}`}>{metric.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: 5-Step Student Journey */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-primary)' }} data-testid="section-student-journey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-hero text-high-contrast mb-4" data-testid="text-journey-title">
              Your Personal Path to Mental Wellness
            </h2>
            <p className="text-lead text-medium-contrast max-w-3xl mx-auto" data-testid="text-journey-subtitle">
              Every journey is unique - start wherever feels right for you
            </p>
          </div>

          {/* Journey Steps with Timeline Visuals */}
          <div className="relative" data-testid="journey-steps">
            {/* Desktop Timeline Connector */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-green-300 via-purple-300 via-orange-300 to-pink-300 dark:from-blue-600 dark:via-green-600 dark:via-purple-600 dark:via-orange-600 dark:to-pink-600 z-0" style={{marginTop: '4rem'}}></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative" data-testid={`journey-step-${index}`}>
                  {/* Mobile Timeline Connector (Vertical) */}
                  {index < journeySteps.length - 1 && (
                    <div className="lg:hidden absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-current to-transparent opacity-30 z-0" style={{color: step.bgColor.includes('blue') ? '#3B82F6' : step.bgColor.includes('green') ? '#10B981' : step.bgColor.includes('purple') ? '#8B5CF6' : step.bgColor.includes('orange') ? '#F59E0B' : '#EC4899'}}></div>
                  )}
                  
                  <Card className={`card-professional ${step.bgColor} border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                    <CardContent className="p-6 text-center space-y-4 flex flex-col h-full">
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                      
                      <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      
                      <h3 className="text-card-title text-high-contrast font-semibold" data-testid={`journey-title-${index}`}>
                        {step.title}
                      </h3>
                      
                      <p className="text-card-description text-medium-contrast flex-grow" data-testid={`journey-description-${index}`}>
                        {step.description}
                      </p>
                      
                      <div className="space-y-3">
                        <p className="text-small text-emphasis font-semibold flex items-center justify-center gap-2" data-testid={`journey-time-${index}`}>
                          <Clock className="h-4 w-4" />
                          {step.time}
                        </p>
                        
                        {/* Functional Action Button */}
                        <Link href={step.href} data-testid={`button-${step.action.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            size="sm"
                          >
                            {step.action}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Quick Access Feature Tiles - Enhanced with Framer Motion and Modern Design */}
      {/* 
        This section provides students with quick access to all major platform features.
        Each tile represents a different entry point into the mental health support system,
        designed with specific use cases and student needs in mind.
        
        Features:
        - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
        - Staggered entrance animations with scroll triggers
        - Interactive hover effects with micro-animations
        - Emergency features highlighted with special styling
        - Full accessibility support with ARIA labels
        - Gradient backgrounds with CSS custom properties for theming
      */}
      <motion.section 
        className="py-20 lg:py-28 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden" 
        data-testid="section-feature-tiles"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, threshold: 0.1 }}
      >
        {/* Background decorative elements for visual appeal */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header with Enhanced Typography and Animation */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-features-title">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Choose Your 
              </span>
              <span className="block text-foreground mt-2">Starting Point</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="text-features-subtitle">
              Every feature designed specifically for student mental health challenges with 
              <span className="font-semibold text-primary"> evidence-based approaches</span> and 
              <span className="font-semibold text-secondary"> 24/7 accessibility</span>
            </p>
          </motion.div>

          {/* Feature Tiles Grid with Enhanced Responsive Design */}
          {/* 
            Grid Layout Strategy:
            - Mobile (320px+): 1 column, full-width cards for touch-friendly interaction
            - Tablet (768px+): 2 columns, balanced layout with adequate spacing
            - Desktop (1024px+): 3 columns, optimal for feature comparison
            - Large screens (1280px+): Enhanced spacing and larger interactive areas
          */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10" 
            data-testid="feature-tiles-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              staggerChildren: 0.1, 
              delayChildren: 0.4 
            }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {featureTiles.map((tile, index) => (
              /* Individual Feature Tile Component with Advanced Animations */
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  scale: 0.9 
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300
                  }
                }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card 
                  className={`
                    h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden
                    ${tile.isEmergency 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-red-400 ring-offset-2 ring-offset-background' 
                      : `bg-gradient-to-br ${
                          tile.gradient === 'gradient-tile-blue-purple' ? 'from-blue-500/10 via-purple-500/10 to-blue-600/10' :
                          tile.gradient === 'gradient-tile-green-teal' ? 'from-green-500/10 via-teal-500/10 to-green-600/10' :
                          tile.gradient === 'gradient-tile-purple-pink' ? 'from-purple-500/10 via-pink-500/10 to-purple-600/10' :
                          tile.gradient === 'gradient-tile-orange-yellow' ? 'from-orange-500/10 via-yellow-500/10 to-orange-600/10' :
                          tile.gradient === 'gradient-tile-teal-blue' ? 'from-teal-500/10 via-blue-500/10 to-teal-600/10' :
                          'from-red-500/10 via-orange-500/10 to-red-600/10'
                        } border border-border/50 hover:border-primary/30`
                    }
                    group cursor-pointer
                  `} 
                  data-testid={`feature-tile-${index}`} 
                  aria-label={tile.isEmergency 
                    ? 'Emergency crisis support - immediate help available' 
                    : `${tile.title} feature - ${tile.description}`
                  }
                >
                  <CardContent className="p-6 md:p-8 space-y-6 h-full flex flex-col">
                    {/* Feature Header with Icon and Title */}
                    <div className="flex items-start space-x-4 flex-shrink-0">
                      <motion.div 
                        className={`
                          w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0
                          ${tile.isEmergency 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-white dark:bg-gray-800 border border-border/20'
                          }
                        `}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 5,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }}
                        >
                          <tile.icon 
                            className={`
                              h-8 w-8 md:h-10 md:w-10 transition-colors duration-300
                              ${tile.isEmergency 
                                ? 'text-white' 
                                : 'text-primary group-hover:text-secondary'
                              }
                            `} 
                          />
                        </motion.div>
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 
                          className={`
                            text-lg md:text-xl lg:text-2xl font-bold leading-tight mb-2
                            ${tile.isEmergency 
                              ? 'text-white' 
                              : 'text-foreground group-hover:text-primary transition-colors duration-300'
                            }
                          `} 
                          data-testid={`tile-title-${index}`}
                        >
                          {tile.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Feature Description and Details */}
                    <div className="space-y-4 flex-grow">
                      <p 
                        className={`
                          text-sm md:text-base leading-relaxed
                          ${tile.isEmergency 
                            ? 'text-white/90' 
                            : 'text-muted-foreground'
                          }
                        `} 
                        data-testid={`tile-description-${index}`}
                      >
                        {tile.description}
                      </p>
                      
                      <motion.p 
                        className={`
                          text-xs md:text-sm italic leading-relaxed
                          ${tile.isEmergency 
                            ? 'text-white/75' 
                            : 'text-muted-foreground/80'
                          }
                        `} 
                        data-testid={`tile-usecase-${index}`}
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="font-medium">Use case:</span> {tile.useCase}
                      </motion.p>
                      
                      {/* Additional Information with Enhanced Styling */}
                      {(tile.additionalInfo || tile.privacyNote || tile.contentNote || tile.safetyNote) && (
                        <motion.div 
                          className={`
                            text-xs p-3 rounded-lg border-l-4 
                            ${tile.isEmergency 
                              ? 'bg-white/10 border-l-white/50 text-white/80' 
                              : 'bg-muted/30 border-l-primary/50 text-muted-foreground'
                            }
                          `}
                          data-testid={`tile-note-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <span className="font-medium">
                            {tile.additionalInfo && "⏱️ "}
                            {tile.privacyNote && "🔒 "}
                            {tile.contentNote && "🌐 "}
                            {tile.safetyNote && "👥 "}
                          </span>
                          {tile.additionalInfo || tile.privacyNote || tile.contentNote || tile.safetyNote}
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Interactive Action Button with Advanced Hover Effects */}
                    <motion.div
                      className="flex-shrink-0 pt-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        asChild
                        className={`
                          w-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg
                          ${tile.isEmergency 
                            ? 'bg-white text-red-600 hover:bg-white/90 hover:text-red-700' 
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl'
                          }
                          group/button
                        `}
                        size="lg"
                      >
                        <Link 
                          href={tile.href}
                          data-testid={`button-tile-${index}`}
                          aria-label={tile.isEmergency 
                            ? 'Get emergency crisis help now - connects you immediately with crisis support' 
                            : `${tile.button} - Access ${tile.title.toLowerCase()} features`
                          }
                          className="flex items-center justify-center space-x-2 py-3 px-6"
                        >
                          <span>{tile.button}</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.3
                            }}
                          >
                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover/button:translate-x-1" />
                          </motion.div>
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call-to-Action Helper Text with Animation */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              💡 <span className="font-medium">Pro tip:</span> Start with our free assessment to get personalized recommendations, 
              or jump directly into AI chat for immediate support. Every feature is designed to work together for comprehensive care.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 6: Student-Specific Challenges */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-primary)' }} data-testid="section-challenges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-challenges-title">
              Student-Specific Mental Health Challenges
            </h2>
            <p className="text-xl text-medium-contrast max-w-3xl mx-auto" data-testid="text-challenges-subtitle">
              We understand the unique pressures you face
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8" data-testid="challenges-grid">
            {challengeCards.map((challenge, index) => (
              <Card 
                key={index} 
                className={`card-professional hover:shadow-xl transition-all duration-300 group border-l-4 ${
                  challenge.accent === 'blue' ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' :
                  challenge.accent === 'green' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20' :
                  challenge.accent === 'orange' ? 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20' :
                  'border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
                }`} 
                data-testid={`challenge-card-${index}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                      challenge.accent === 'blue' ? 'bg-blue-500 dark:bg-blue-600' :
                      challenge.accent === 'green' ? 'bg-green-500 dark:bg-green-600' :
                      challenge.accent === 'orange' ? 'bg-orange-500 dark:bg-orange-600' :
                      'bg-purple-500 dark:bg-purple-600'
                    }`}>
                      <challenge.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-high-contrast" data-testid={`challenge-title-${index}`}>
                        {challenge.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-medium-contrast leading-relaxed" data-testid={`challenge-description-${index}`}>
                    {challenge.description}
                  </p>
                  
                  <div className={`p-4 rounded-lg border-l-4 ${
                    challenge.accent === 'blue' ? 'bg-blue-50 dark:bg-blue-950/30 border-l-blue-500' :
                    challenge.accent === 'green' ? 'bg-green-50 dark:bg-green-950/30 border-l-green-500' :
                    challenge.accent === 'orange' ? 'bg-orange-50 dark:bg-orange-950/30 border-l-orange-500' :
                    'bg-purple-50 dark:bg-purple-950/30 border-l-purple-500'
                  }`}>
                    <p className="text-sm font-semibold text-high-contrast mb-2">Common symptoms:</p>
                    <p className="text-medium-contrast text-sm" data-testid={`challenge-symptoms-${index}`}>
                      {challenge.symptoms}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Breaking Down Every Barrier to Mental Health Care */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background" data-testid="section-breaking-barriers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-barriers-title">
              Breaking Down Every Barrier to Mental Health Care
            </h2>
            <p className="text-xl text-medium-contrast max-w-3xl mx-auto" data-testid="text-barriers-subtitle">
              Addressing the real obstacles that prevent students from accessing mental health support
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12" data-testid="barriers-grid">
            {breakingBarriers.map((barrier, index) => {
              const IconComponent = barrier.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-primary/30 dark:hover:border-primary/50 bg-card/80 dark:bg-card/60 backdrop-blur-sm" 
                  data-testid={`barrier-card-${index}`}
                >
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary p-4 mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-high-contrast mb-4" data-testid={`barrier-title-${index}`}>
                      {barrier.title}
                    </CardTitle>
                    <p className="text-medium-contrast mb-6" data-testid={`barrier-description-${index}`}>
                      {barrier.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Student Concerns */}
                    <div>
                      <h4 className="font-semibold text-lg text-high-contrast mb-4 flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                        Common Student Concerns:
                      </h4>
                      <ul className="space-y-2">
                        {barrier.concerns.map((concern, concernIndex) => (
                          <li key={concernIndex} className="flex items-start space-x-3" data-testid={`concern-${index}-${concernIndex}`}>
                            <Quote className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground italic">"{concern}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Our Solutions */}
                    <div>
                      <h4 className="font-semibold text-lg text-high-contrast mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Our Solutions:
                      </h4>
                      <ul className="space-y-2">
                        {barrier.solutions.map((solution, solutionIndex) => (
                          <li key={solutionIndex} className="flex items-start space-x-3" data-testid={`solution-${index}-${solutionIndex}`}>
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-medium-contrast">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Student Testimonial */}
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-xl p-4 border border-primary/20 dark:border-primary/30">
                      <div className="flex items-start space-x-3">
                        <Quote className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-medium-contrast italic mb-2" data-testid={`testimonial-${index}`}>
                            "{barrier.testimonial}"
                          </p>
                          <p className="text-xs text-muted-foreground font-medium" data-testid={`attribution-${index}`}>
                            - {barrier.attribution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 8: Success Stories Carousel */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-primary)' }} data-testid="section-success-stories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-success-title">
              Real Stories from Students Who Found Their Path
            </h2>
            <p className="text-xl text-medium-contrast max-w-3xl mx-auto" data-testid="text-success-subtitle">
              Anonymous testimonials showing different mental health journeys
            </p>
          </div>

          <Carousel className="max-w-4xl mx-auto" data-testid="success-stories-carousel" role="region" aria-label="Student success stories">
            <CarouselContent>
              {successStories.map((story, index) => (
                <CarouselItem key={index} data-testid={`success-story-${index}`}>
                  <Card className="card-professional bg-primary/5 dark:bg-primary/10 border-primary/20">
                    <CardContent className="p-12 text-center space-y-8">
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-primary" data-testid={`story-type-${index}`}>
                          {story.studentType}
                        </p>
                        <p className="text-lg text-low-contrast" data-testid={`story-challenge-${index}`}>
                          Challenge: {story.challenge}
                        </p>
                        <p className="text-sm text-low-contrast" data-testid={`story-timeline-${index}`}>
                          Timeline: {story.timeline}
                        </p>
                      </div>
                      
                      <Quote className="h-12 w-12 text-primary mx-auto" />
                      
                      <blockquote className="text-xl md:text-2xl font-medium text-high-contrast italic leading-relaxed" data-testid={`story-quote-${index}`}>
                        "{story.quote}"
                      </blockquote>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-high-contrast">Outcomes:</h4>
                        <ul className="space-y-2">
                          {story.outcomes.map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex} className="flex items-center justify-center space-x-2" data-testid={`story-outcome-${index}-${outcomeIndex}`}>
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                              <span className="text-medium-contrast">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious data-testid="carousel-previous" aria-label="View previous success story" />
            <CarouselNext data-testid="carousel-next" aria-label="View next success story" />
          </Carousel>

          {/* Manual Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8" data-testid="carousel-indicators">
            {successStories.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setCurrentTestimonial(index)}
                data-testid={`carousel-indicator-${index}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Evidence-Based Approach */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-secondary)' }} data-testid="section-evidence-based">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-evidence-title">
              Backed by Mental Health Science
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Research Foundation */}
            <div className="space-y-6" data-testid="research-foundation">
              <h3 className="text-2xl font-bold text-primary">Research Foundation</h3>
              <ul className="space-y-4">
                {[
                  "Clinical assessments used by professionals worldwide",
                  "AI responses based on cognitive behavioral therapy principles", 
                  "Peer support proven effective in 200+ research studies",
                  "Crisis intervention protocols following best practices"
                ].map((point, index) => (
                  <li key={index} className="flex items-start space-x-3" data-testid={`research-point-${index}`}>
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-medium-contrast">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform Statistics */}
            <div className="space-y-6" data-testid="platform-statistics">
              <h3 className="text-2xl font-bold text-primary">Platform Statistics</h3>
              <div className="space-y-6">
                {[
                  { stat: "94%", desc: "of users report symptom improvement" },
                  { stat: "78%", desc: "reduction in crisis incidents" },
                  { stat: "89%", desc: "would recommend to other students" },
                  { stat: "4.8/5.0", desc: "average response satisfaction" }
                ].map((item, index) => (
                  <div key={index} className="text-center" data-testid={`platform-stat-${index}`}>
                    <div className="text-3xl font-bold text-primary mb-1" data-testid={`platform-number-${index}`}>{item.stat}</div>
                    <p className="text-low-contrast" data-testid={`platform-desc-${index}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="space-y-6" data-testid="quality-assurance">
              <h3 className="text-2xl font-bold text-primary">Quality Assurance</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Professional Team:</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li data-testid="team-psychologists">• Licensed clinical psychologists</li>
                    <li data-testid="team-counselors">• Campus counseling professionals</li>
                    <li data-testid="team-crisis">• Crisis intervention specialists</li>
                    <li data-testid="team-cultural">• Cultural competency experts</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quality Process:</h4>
                  <ul className="space-y-2">
                    {[
                      "All content reviewed by licensed professionals",
                      "Regular outcome monitoring and improvement",
                      "Continuous staff training and development",
                      "Student feedback integration process"
                    ].map((process, index) => (
                      <li key={index} className="flex items-start space-x-2" data-testid={`quality-process-${index}`}>
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{process}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: FAQ Section */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-primary)' }} data-testid="section-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-faq-title">
              Your Questions, Completely Answered
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion" role="region" aria-label="Frequently asked questions">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg px-6" data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-high-contrast hover:text-primary" data-testid={`faq-question-${index}`} aria-label={`Toggle answer for: ${faq.question}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-medium-contrast leading-relaxed" data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 11: Take Action Today */}
      <section className="py-16 lg:py-24 bg-primary dark:bg-primary/90" data-testid="section-take-action">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-4" data-testid="text-action-title">
              Your Mental Health Journey Can Start Right This Moment
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto" data-testid="text-action-subtitle">
              Every option is confidential, secure, and designed with your complete privacy in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="action-options">
            {actionOptions.map((option, index) => (
              <Card key={index} className="card-professional bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" data-testid={`action-option-${index}`}>
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <option.icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-high-contrast" data-testid={`action-title-${index}`}>
                      {option.title}
                    </h3>
                    <p className="text-medium-contrast" data-testid={`action-description-${index}`}>
                      {option.description}
                    </p>
                    <p className="text-sm font-semibold text-primary" data-testid={`action-time-${index}`}>
                      {option.time}
                    </p>
                  </div>
                  
                  <Button 
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                  >
                    <Link href={option.href} data-testid={`button-action-${index}`}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}