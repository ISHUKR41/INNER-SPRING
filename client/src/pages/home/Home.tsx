import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  ClipboardCheck
} from "lucide-react";

/**
 * Professional MindCare Homepage - Complete Mental Health Platform
 * 
 * Comprehensive homepage with 11 sections designed specifically for student mental health support.
 * Features professional design, dark theme support, and full functionality.
 */
export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  // Quick access feature tiles data
  const featureTiles = [
    {
      title: "24/7 AI Mental Health Support",
      description: "Immediate coping strategies, breathing exercises, and emotional support when you need it most",
      useCase: "Perfect for late-night anxiety, pre-exam stress, or sudden panic",
      button: "Start Chatting Now",
      icon: Bot,
      gradient: "gradient-tile-blue",
      href: "/chatbot"
    },
    {
      title: "Campus Counselor Booking", 
      description: "Schedule confidential appointments with licensed campus counselors and mental health professionals",
      useCase: "When you need deeper support, therapy, or professional diagnosis",
      button: "Book Appointment",
      additionalInfo: "Average wait time: 2-3 days",
      icon: Calendar,
      gradient: "gradient-tile-green", 
      href: "/appointments"
    },
    {
      title: "Evidence-Based Assessment",
      description: "Understand your mental health with validated tools used by professionals (PHQ-9, GAD-7, stress scales)",
      useCase: "When you want to understand what you're feeling", 
      button: "Take Assessment",
      privacyNote: "100% anonymous option available",
      icon: ClipboardList,
      gradient: "gradient-tile-purple",
      href: "/assessment"
    },
    {
      title: "Self-Help Resource Library",
      description: "Videos, articles, audio guides, and interactive tools for managing anxiety, depression, stress, and more",
      useCase: "Learn coping skills at your own pace",
      button: "Browse Resources", 
      contentNote: "Available in multiple languages",
      icon: BookOpen,
      gradient: "gradient-tile-yellow",
      href: "/resources"
    },
    {
      title: "Student Support Community",
      description: "Connect with other students facing similar challenges in moderated, safe discussion groups", 
      useCase: "When you feel alone or need peer understanding",
      button: "Join Community",
      safetyNote: "Professionally moderated",
      icon: Users,
      gradient: "gradient-tile-coral",
      href: "/peer-support"
    },
    {
      title: "Emergency Crisis Support", 
      description: "Immediate help for mental health emergencies, suicidal thoughts, or when you need help right now",
      useCase: "When you're in crisis and need immediate help",
      button: "Get Help Now",
      icon: PhoneCall,
      gradient: "gradient-tile-red",
      href: "/crisis-help",
      isEmergency: true
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
      href: "/assessment",
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

  // Student challenge cards data
  const challengeCards = [
    {
      header: "Academic Stress & Performance Anxiety",
      statistic: "87% of students feel overwhelmed by coursework",
      symptoms: "Test anxiety, perfectionism, imposter syndrome, fear of failure",
      quote: "The pre-exam anxiety was paralyzing until I learned breathing techniques",
      icon: GraduationCap
    },
    {
      header: "Social Isolation & Identity Development", 
      statistic: "43% report feeling lonely despite being surrounded by people",
      symptoms: "Social anxiety, homesickness, identity confusion, relationship problems",
      quote: "Finding my community through peer support changed everything",
      icon: Users
    },
    {
      header: "Financial Stress & Future Uncertainty",
      statistic: "78% worry about student loans and career prospects", 
      symptoms: "Financial anxiety, career uncertainty, family pressure, debt stress",
      quote: "I learned to separate my worth from my financial situation",
      icon: Building
    },
    {
      header: "Life Transitions & Independence",
      statistic: "65% struggle with the transition to adulthood",
      symptoms: "Homesickness, independence anxiety, adult responsibility stress", 
      quote: "Learning to be independent without being alone was key",
      icon: Target
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

  // Breaking barriers data
  const barrierSolutions = [
    {
      title: "Fear of Judgment & Stigma",
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
      author: "Anonymous Junior"
    },
    {
      title: "Limited Access & Long Wait Times",
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
      author: "Anonymous Senior"
    },
    {
      title: "Not Knowing When/How to Get Help",
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
      author: "Anonymous Sophomore"
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
      href: "/assessment",
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

  // Carousel autoplay for success stories
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % successStories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [successStories.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Section 1: Hero Banner - Professional & Modern */}
      <section className="hero-section relative overflow-hidden" data-testid="section-hero">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-shape floating-shape-1 floating"></div>
          <div className="floating-shape floating-shape-2 floating-delayed"></div>
          <div className="floating-shape floating-shape-3 floating"></div>
          <div className="floating-triangle floating-triangle-1"></div>
          <div className="floating-triangle floating-triangle-2"></div>
        </div>

        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Content - Enhanced Typography & Spacing */}
            <div className="space-y-8 lg:space-y-10 fade-in" data-testid="hero-content">
              {/* Main Headlines */}
              <div className="space-y-6">
                <h1 className="text-hero font-bold font-heading leading-tight text-high-contrast" data-testid="text-main-headline">
                  Your Mental Health Journey
                  <span className="block text-emphasis text-glow-primary mt-2">Starts Here</span>
                </h1>
                
                <h2 className="text-lead font-semibold text-medium-contrast leading-snug max-w-2xl" data-testid="text-secondary-headline">
                  Safe, Confidential, Professional Support Available 24/7
                </h2>
                
                <p className="text-body-large text-medium-contrast max-w-2xl leading-relaxed" data-testid="text-hero-description">
                  Break free from the barriers that prevent students from accessing mental health support. Our evidence-based platform combines AI-powered assistance, professional counseling, and peer community support—all designed specifically for the unique challenges of college life.
                </p>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6" data-testid="hero-cta-buttons">
                <Button 
                  asChild
                  size="lg" 
                  className="btn-professional px-8 py-4 text-lg font-semibold rounded-xl w-full sm:w-auto group"
                >
                  <Link href="/assessment" data-testid="button-start-assessment">
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

      {/* Section 2: Problem Awareness Statistics */}
      <section className="stats-section py-16 lg:py-24" data-testid="section-crisis-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-hero text-high-contrast mb-4 text-red-600 dark:text-red-400" data-testid="text-crisis-title">
              The Student Mental Health Crisis Demands Immediate Action
            </h2>
            <p className="text-lead text-medium-contrast max-w-3xl mx-auto" data-testid="text-crisis-subtitle">
              The numbers reveal an urgent need for accessible, comprehensive mental health support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="crisis-statistics-grid">
            {crisisStatistics.map((stat, index) => (
              <Card 
                key={index} 
                className={`crisis-card-${stat.accent} text-center p-8 group`} 
                data-testid={`stat-card-${index}`}
                tabIndex={0}
                role="article"
                aria-label={`Crisis statistic: ${stat.number} ${stat.description}`}
              >
                <CardContent className="space-y-6">
                  {/* Enhanced Icon with Animation */}
                  <div className={`w-20 h-20 mx-auto rounded-2xl crisis-icon-${stat.accent} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  
                  {/* Enhanced Statistic Number with Professional Typography */}
                  <div className={`text-stat-number crisis-stat-${stat.accent} font-bold leading-none tracking-tight drop-shadow-sm`} data-testid={`stat-number-${index}`}>
                    {stat.number}
                  </div>
                  
                  {/* Primary Description with Enhanced Typography */}
                  <p className="text-card-subtitle text-high-contrast leading-tight font-medium" data-testid={`stat-description-${index}`}>
                    {stat.description}
                  </p>
                  
                  {/* Additional Information with Subtle Styling */}
                  {stat.additional && (
                    <p className="text-caption text-medium-contrast leading-relaxed italic border-l-2 border-l-current pl-4 ml-2 opacity-90" data-testid={`stat-additional-${index}`}>
                      {stat.additional}
                    </p>
                  )}
                  
                  {/* Source Attribution with Professional Styling */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-small text-subtle font-medium tracking-wide" data-testid={`stat-source-${index}`}>
                      {stat.source}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      {/* Section 5: Quick Access Feature Tiles */}
      <section className="section-secondary py-16 lg:py-24" data-testid="section-feature-tiles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-lg text-enhanced mb-4" data-testid="text-features-title">
              Choose Your Starting Point
            </h2>
            <p className="text-xl text-medium-contrast max-w-3xl mx-auto" data-testid="text-features-subtitle">
              Every feature designed specifically for student mental health challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="feature-tiles-grid">
            {featureTiles.map((tile, index) => (
              <Card key={index} className={`feature-tile ${tile.gradient} border-none group ${tile.isEmergency ? 'ring-2 ring-red-500 dark:ring-red-400' : ''}`} data-testid={`feature-tile-${index}`} aria-label={tile.isEmergency ? 'Emergency crisis support - immediate help available' : `${tile.title} feature`}>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full ${tile.isEmergency ? 'bg-red-500' : 'bg-white dark:bg-gray-800'} flex items-center justify-center shadow-lg`}>
                      <tile.icon className={`h-8 w-8 ${tile.isEmergency ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-high-contrast" data-testid={`tile-title-${index}`}>
                      {tile.title}
                    </h3>
                  </div>
                  
                  <p className="text-medium-contrast" data-testid={`tile-description-${index}`}>
                    {tile.description}
                  </p>
                  
                  <p className="text-sm text-low-contrast italic" data-testid={`tile-usecase-${index}`}>
                    {tile.useCase}
                  </p>
                  
                  {(tile.additionalInfo || tile.privacyNote || tile.contentNote || tile.safetyNote) && (
                    <p className="text-xs text-low-contrast" data-testid={`tile-note-${index}`}>
                      {tile.additionalInfo || tile.privacyNote || tile.contentNote || tile.safetyNote}
                    </p>
                  )}
                  
                  <Button 
                    asChild
                    className={`w-full ${tile.isEmergency ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-primary hover:bg-gray-50 dark:hover:bg-gray-700'} font-semibold transition-all duration-300`}
                  >
                    <Link 
                      href={tile.href}
                      data-testid={`button-tile-${index}`}
                      aria-label={tile.isEmergency ? 'Get emergency crisis help now' : `${tile.button} - ${tile.title}`}
                    >
                      {tile.button}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Student-Specific Challenges */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-primary)' }} data-testid="section-challenges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-challenges-title">
              Mental Health Challenges Unique to Student Life
            </h2>
            <p className="text-xl text-medium-contrast max-w-3xl mx-auto" data-testid="text-challenges-subtitle">
              We understand the specific pressures you face
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8" data-testid="challenges-grid">
            {challengeCards.map((challenge, index) => (
              <Card key={index} className="card-professional p-8 hover:shadow-xl transition-all duration-300" data-testid={`challenge-card-${index}`}>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <challenge.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-high-contrast" data-testid={`challenge-header-${index}`}>
                      {challenge.header}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-primary" data-testid={`challenge-statistic-${index}`}>
                      {challenge.statistic}
                    </p>
                    
                    <p className="text-medium-contrast" data-testid={`challenge-symptoms-${index}`}>
                      <strong>Common experiences:</strong> {challenge.symptoms}
                    </p>
                    
                    <blockquote className="italic text-low-contrast border-l-4 border-primary pl-4" data-testid={`challenge-quote-${index}`}>
                      "{challenge.quote}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Breaking Barriers */}
      <section className="py-16 lg:py-24" style={{ background: 'var(--section-secondary)' }} data-testid="section-breaking-barriers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-high-contrast mb-4" data-testid="text-barriers-title">
              Breaking Down Every Barrier to Mental Health Care
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12" data-testid="barriers-grid">
            {barrierSolutions.map((barrier, index) => (
              <div key={index} className="space-y-8" data-testid={`barrier-solution-${index}`}>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid={`barrier-title-${index}`}>
                  {barrier.title}
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-high-contrast mb-4">Student Concerns:</h4>
                    <ul className="space-y-2">
                      {barrier.concerns.map((concern, concernIndex) => (
                        <li key={concernIndex} className="text-low-contrast text-sm" data-testid={`concern-${index}-${concernIndex}`}>
                          • {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-high-contrast mb-4">Our Solutions:</h4>
                    <ul className="space-y-2">
                      {barrier.solutions.map((solution, solutionIndex) => (
                        <li key={solutionIndex} className="flex items-start space-x-2" data-testid={`solution-${index}-${solutionIndex}`}>
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-medium-contrast text-sm">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <blockquote className="bg-white dark:bg-gray-900 p-6 rounded-lg border-l-4 border-primary" data-testid={`barrier-testimonial-${index}`}>
                    <p className="italic text-gray-700 dark:text-gray-300 mb-3">
                      "{barrier.testimonial}"
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      - {barrier.author}
                    </p>
                  </blockquote>
                </div>
              </div>
            ))}
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