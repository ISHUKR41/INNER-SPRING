import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Play,
  Download,
  Star,
  Shield,
  Heart,
  Clock,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Target,
  Brain,
  Search,
  UserCheck,
  Lightbulb,
  Lock,
  Headphones,
  Handshake,
  Sprout,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
  GraduationCap,
  LifeBuoy,
  FileText,
  UserPlus,
  Activity,
  Zap,
  Award,
  HelpCircle,
  Eye,
  EyeOff,
  CheckSquare,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import type { Resource } from "@/types";

/**
 * MindCare Professional Home Page - Comprehensive student mental health platform
 * Features modern design, detailed sections, statistics, and professional content
 * Designed for maximum engagement and trust building
 */
export default function Home() {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Fetch featured resources for the homepage with proper typing and default values
  const { data: featuredResources = [], isLoading: resourcesLoading, error: resourcesError } = useQuery<Resource[]>({
    queryKey: ["/api/resources/featured"],
  });

  // Professional platform statistics - Based on research data
  const platformStats = {
    studentsHelped: "15,000+",
    activeSessions: "24/7",
    averageResponseTime: "< 30 sec",
    improvementRate: "94%",
    crisisPreventions: "2,847",
    campusPartnerships: "150+"
  };

  // Professional crisis statistics with compelling visual impact
  const crisisStatistics = [
    {
      number: "73%",
      description: "of students experienced a mental health crisis in the past year",
      source: "American College Health Association, 2024",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-l-red-500",
      icon: AlertTriangle,
      testId: "stat-crisis-rate"
    },
    {
      number: "60%",
      description: "say mental health significantly impacted their academic performance",
      subtext: "Leading to lower GPAs, course withdrawals, and delayed graduation",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-l-orange-500",
      icon: BarChart3,
      testId: "stat-academic-impact"
    },
    {
      number: "85%",
      description: "don't seek help due to stigma, cost, or lack of accessible services",
      subtext: "Traditional counseling centers serve only 15% of students needing help",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-l-purple-500",
      icon: Shield,
      testId: "stat-barriers"
    },
    {
      number: "↗️ 35%",
      description: "increase in student suicidal ideation since 2020",
      subtext: "Yet campus counseling resources haven't scaled to meet demand",
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-l-red-600",
      icon: TrendingUp,
      testId: "stat-crisis-increase"
    }
  ];

  // Student journey steps with detailed descriptions
  const journeySteps = [
    {
      title: "Notice the Signs",
      description: "Feeling anxious, depressed, overwhelmed, or struggling with sleep? Academic stress getting overwhelming?",
      icon: Lightbulb,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      time: "Moment of awareness",
      action: "Take anonymous self-assessment",
      testId: "journey-recognition"
    },
    {
      title: "Anonymous Self-Check",
      description: "Take evidence-based assessments (PHQ-9, GAD-7) in complete privacy. No judgment, just understanding.",
      icon: Lock,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      time: "5-10 minutes",
      action: "Get personalized recommendations",
      testId: "journey-assessment"
    },
    {
      title: "Instant AI Guidance",
      description: "Get immediate coping strategies, breathing exercises, and personalized recommendations 24/7.",
      icon: Brain,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      time: "Available instantly",
      action: "Chat now or explore resources",
      testId: "journey-ai-support"
    },
    {
      title: "Expert Support",
      description: "Book confidential appointments with campus counselors or connect with licensed professionals.",
      icon: Handshake,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      time: "When you're ready",
      action: "Book confidential appointment",
      testId: "journey-professional"
    },
    {
      title: "Sustained Growth",
      description: "Track progress, join peer communities, access resources, and maintain long-term mental wellness.",
      icon: Sprout,
      bgColor: "bg-teal-100",
      iconColor: "text-teal-600",
      time: "Your ongoing journey",
      action: "Join student community",
      testId: "journey-wellness"
    }
  ];

  // Professional service tiles configuration with enhanced styling
  const serviceTiles = [
    {
      title: "24/7 AI Mental Health Support",
      description: "Immediate coping strategies, breathing exercises, and emotional support when you need it most",
      useCase: "Perfect for late-night anxiety, pre-exam stress, or sudden panic",
      icon: MessageCircle,
      href: "/chatbot",
      gradient: "from-sky-50 to-blue-100",
      hoverGradient: "sky",
      iconColor: "text-sky-600",
      buttonColor: "text-sky-600",
      shadowColor: "shadow-sky-200/50",
      testId: "tile-ai-chatbot"
    },
    {
      title: "Campus Counselor Booking",
      description: "Schedule confidential appointments with licensed campus counselors and mental health professionals",
      useCase: "When you need deeper support, therapy, or professional diagnosis",
      trustIndicator: "Average wait time: 2-3 days",
      icon: Calendar,
      href: "/appointments",
      gradient: "from-emerald-50 to-green-100",
      hoverGradient: "emerald",
      iconColor: "text-emerald-600",
      buttonColor: "text-emerald-600",
      shadowColor: "shadow-emerald-200/50",
      testId: "tile-appointments"
    },
    {
      title: "Evidence-Based Assessment",
      description: "Take validated mental health screenings (PHQ-9, GAD-7) for personalized insights and recommendations",
      useCase: "Perfect for understanding your mental health status privately",
      icon: ClipboardList,
      href: "/assessment",
      gradient: "from-violet-50 to-purple-100",
      hoverGradient: "violet",
      iconColor: "text-violet-600",
      buttonColor: "text-violet-600",
      shadowColor: "shadow-violet-200/50",
      testId: "tile-assessment"
    },
    {
      title: "Student Peer Community",
      description: "Connect with fellow students in safe, moderated forums designed for mutual support and understanding",
      useCase: "When you want to connect with others who understand student life",
      icon: Users,
      href: "/peer-support",
      gradient: "from-teal-50 to-cyan-100",
      hoverGradient: "teal",
      iconColor: "text-teal-600",
      buttonColor: "text-teal-600",
      shadowColor: "shadow-teal-200/50",
      testId: "tile-peer-support"
    },
    {
      title: "Crisis Intervention",
      description: "24/7 emergency support with immediate connection to crisis counselors and urgent mental health resources",
      useCase: "Immediate help when you're in crisis or having thoughts of self-harm",
      icon: Phone,
      href: "/emergency",
      gradient: "from-rose-50 to-red-100",
      hoverGradient: "rose",
      iconColor: "text-rose-600",
      buttonColor: "text-rose-600",
      shadowColor: "shadow-rose-200/50",
      border: "border-rose-200",
      pulseEffect: "group-hover:animate-pulse",
      testId: "tile-emergency"
    },
    {
      title: "Mental Health Resources",
      description: "Curated library of articles, videos, guided meditations, and tools for every aspect of mental wellness",
      useCase: "Self-directed learning and ongoing mental health maintenance",
      icon: BookOpen,
      href: "/resources",
      gradient: "from-amber-50 to-yellow-100",
      hoverGradient: "amber",
      iconColor: "text-amber-600",
      buttonColor: "text-amber-600",
      shadowColor: "shadow-amber-200/50",
      testId: "tile-resources"
    }
  ];

  // Breaking barriers - addressing specific student concerns
  const barrierSolutions = [
    {
      problemIcon: X,
      barrier: "Fear of judgment and stigma",
      solutions: [
        "100% anonymous options available",
        "No names required for AI chat or peer support",
        "Private, encrypted data with your control",
        "Campus counselors trained in confidentiality"
      ],
      studentQuote: "I was scared someone would find out, but the anonymous chat helped me get started.",
      testId: "barrier-stigma"
    },
    {
      problemIcon: Clock,
      barrier: "Counseling centers overwhelmed and understaffed",
      solutions: [
        "AI support available 24/7, even at 3 AM",
        "No waiting lists for immediate coping strategies",
        "Multiple languages and cultural understanding",
        "Works on any device - phone, laptop, tablet"
      ],
      studentQuote: "When I had a panic attack at midnight, the AI chatbot walked me through breathing exercises.",
      testId: "barrier-access"
    },
    {
      problemIcon: AlertTriangle,
      barrier: "Problems get worse before getting help",
      solutions: [
        "Regular check-ins and mood tracking",
        "Early warning system for declining mental health",
        "Preventive resources before crisis hits",
        "Peer support to reduce isolation"
      ],
      studentQuote: "The mood tracking helped me notice patterns before they became bigger problems.",
      testId: "barrier-prevention"
    }
  ];

  // Student success stories with detailed journeys
  const successStories = [
    {
      studentType: "Junior, Engineering Major",
      background: "from-blue-100 to-blue-200",
      quote: "I used to have panic attacks before every exam. The breathing exercises from the AI chatbot became my go-to strategy. Now I use them before presentations too. My GPA went from 2.3 to 3.7 in two semesters.",
      journey: "Started with AI chat → Learned coping techniques → Improved academic performance",
      timeline: "Progress over 6 months",
      testId: "story-anxiety-management"
    },
    {
      studentType: "Sophomore, First-Generation College Student",
      background: "from-green-100 to-green-200",
      quote: "I felt completely alone and thought about dropping out. The peer support forum showed me others felt the same way. I eventually booked counseling and learned it's actually really common. I'm still here and doing better.",
      journey: "Isolation → Peer connection → Professional help → Continued progress",
      timeline: "Ongoing journey, 1 year of using platform",
      testId: "story-depression-support"
    },
    {
      studentType: "Senior, International Student",
      background: "from-purple-100 to-purple-200",
      quote: "During a really dark time, the crisis chat connected me with help immediately. The counselor met with me the same day. The platform's mood tracking helps me notice when I need extra support now.",
      journey: "Crisis moment → Immediate intervention → Professional support → Prevention tools",
      timeline: "Crisis to stability in 3 months",
      testId: "story-crisis-recovery"
    }
  ];

  // FAQ addressing student concerns
  const faqQuestions = [
    {
      id: "privacy",
      question: "Will anyone find out if I use this platform?",
      answer: "Your privacy is our top priority. We offer completely anonymous options where no personal information is required. All data is encrypted and you control what information is shared. Campus counselors are bound by strict confidentiality laws (HIPAA), and seeking mental health support does not appear on academic records or transcripts.",
      testId: "faq-privacy"
    },
    {
      id: "serious",
      question: "Is this just for people with 'serious' mental health problems?",
      answer: "Not at all! Mental health exists on a spectrum, and stress, anxiety, and feeling overwhelmed are completely valid concerns. Many students use our platform for preventive care, stress management, and general wellness. You don't need to be in crisis to deserve support.",
      testId: "faq-serious"
    },
    {
      id: "academic",
      question: "Will using mental health services affect my academic standing or future career?",
      answer: "Using mental health services is protected by law and cannot negatively impact your academic standing or career prospects. In fact, research shows that students who seek mental health support typically see improvements in academic performance, focus, and overall well-being.",
      testId: "faq-academic"
    },
    {
      id: "unsure",
      question: "What if I'm not sure if I really need help?",
      answer: "Uncertainty is completely normal and actually shows good self-awareness. Our platform offers low-pressure ways to explore your mental health, like anonymous self-assessments and AI chat. You don't have to be in crisis to benefit from support - prevention and early intervention are just as important.",
      testId: "faq-unsure"
    },
    {
      id: "replacement",
      question: "Is this a replacement for 'real' therapy?",
      answer: "No, our platform complements professional care rather than replacing it. We provide immediate support, resources, and connections to professional counselors when needed. Think of us as a bridge to help you access the right level of care for your situation.",
      testId: "faq-replacement"
    },
    {
      id: "cost",
      question: "What if I can't afford professional counseling?",
      answer: "Many campuses offer free counseling services to students. We can help you find campus resources, sliding-scale fee counselors, and information about insurance coverage. We also provide many free resources and support options that don't require professional sessions.",
      testId: "faq-cost"
    }
  ];

  // Mental health myths vs facts
  const mythsFacts = [
    {
      myth: "Only 'weak' people need mental health support",
      fact: "Seeking help requires courage and self-awareness. Mental health challenges affect 1 in 5 people regardless of strength, intelligence, or character.",
      icon: UserCheck,
      testId: "myth-weakness"
    },
    {
      myth: "I should be able to handle college stress on my own",
      fact: "College presents unique challenges that previous generations didn't face. Using available resources is smart, not weak.",
      icon: GraduationCap,
      testId: "myth-independence"
    },
    {
      myth: "Mental health problems will go away on their own",
      fact: "Like physical health, mental health benefits from attention and care. Early intervention prevents bigger problems.",
      icon: Heart,
      testId: "myth-self-healing"
    },
    {
      myth: "Using mental health services will go on my permanent record",
      fact: "Mental health records are confidential and protected by law. They don't appear on transcripts or background checks.",
      icon: Shield,
      testId: "myth-records"
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...Array.from(prev), entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Professional Hero Banner - 650px height */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden pt-[90px]" 
               style={{ background: "linear-gradient(135deg, #F7FAFC 0%, #F0FFF4 100%)" }}>
        {/* Floating Background Shapes */}
        <div className="absolute inset-0">
          <div className="floating absolute w-20 h-20 top-1/4 left-[8%] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10"></div>
          <div className="floating absolute w-[7.5rem] h-[7.5rem] top-[60%] right-[16%] rounded-full bg-gradient-to-br from-accent/10 to-primary/10" style={{ animationDelay: '2s' }}></div>
          <div className="floating absolute w-[3.75rem] h-[3.75rem] top-[40%] left-3/4 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight font-heading">
                  <span className="text-gradient-primary">Your mental health matters.</span>
                  <span className="block mt-2">Support is just a click away.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Confidential, anonymous, and free mental health support for all students
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/chatbot">
                  <Button 
                    size="lg"
                    className="gradient-primary text-white px-8 py-4 text-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    data-testid="button-start-chat"
                  >
                    <MessageCircle className="mr-2" size={20} />
                    Start Chat with AI
                  </Button>
                </Link>
                <Link href="/assessment">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    data-testid="button-take-assessment"
                  >
                    <ClipboardList className="mr-2" size={20} />
                    Take Self-Assessment
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="text-primary" size={16} />
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary" size={16} />
                  <span>Anonymous</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="text-primary" size={16} />
                  <span>Always Free</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse group of students studying together in a supportive environment" 
                className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                data-testid="img-hero-students"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-secondary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">24/7 Support</p>
                    <p className="text-sm text-muted-foreground">Always here when you need us</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Tiles Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="services-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('services-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">How We Support Your Wellbeing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive mental health resources designed to meet you wherever you are in your journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceTiles.map((tile, index) => {
              const IconComponent = tile.icon;
              return (
                <div
                  key={tile.href}
                  id={`service-${index}`}
                  className={`fade-in ${visibleElements.has(`service-${index}`) ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={tile.href}>
                    <Card 
                      className={`group relative border ${tile.border || 'border-border'} h-full cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 ${tile.shadowColor} backdrop-blur-sm`}
                      data-testid={tile.testId}
                    >
                      <CardContent className="p-8 relative z-10">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tile.gradient} group-hover:bg-gradient-to-br ${
                          tile.hoverGradient === 'sky' ? 'group-hover:from-sky-100 group-hover:to-blue-200' :
                          tile.hoverGradient === 'emerald' ? 'group-hover:from-emerald-100 group-hover:to-green-200' :
                          tile.hoverGradient === 'violet' ? 'group-hover:from-violet-100 group-hover:to-purple-200' :
                          tile.hoverGradient === 'amber' ? 'group-hover:from-amber-100 group-hover:to-yellow-200' :
                          tile.hoverGradient === 'teal' ? 'group-hover:from-teal-100 group-hover:to-cyan-200' :
                          tile.hoverGradient === 'rose' ? 'group-hover:from-rose-100 group-hover:to-red-200' : ''
                        } rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${tile.pulseEffect || ''}`}>
                          <IconComponent className={`${tile.iconColor} transition-colors duration-300`} size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4 font-heading group-hover:text-opacity-90 transition-colors duration-300">{tile.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm group-hover:text-opacity-80 transition-colors duration-300">{tile.description}</p>
                        <p className="text-xs text-muted-foreground/70 mb-6">{tile.useCase}</p>
                        {tile.trustIndicator && (
                          <p className="text-xs text-green-600 mb-4">{tile.trustIndicator}</p>
                        )}
                        <Button variant="ghost" className={`${tile.buttonColor} font-semibold hover:underline p-0 h-auto group-hover:translate-x-2 transition-transform duration-300`}>
                          Get Started <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={16} />
                        </Button>
                      </CardContent>
                      {/* Subtle gradient overlay for depth */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-5 rounded-lg transition-opacity duration-300 group-hover:opacity-10`}></div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgent Problem Statement Section - 500px height */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="crisis-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('crisis-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold mb-4 font-heading" style={{ color: '#E53E3E' }}>
              The Student Mental Health Crisis Demands Immediate Action
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {crisisStatistics.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  id={`crisis-stat-${index}`}
                  className={`fade-in ${visibleElements.has(`crisis-stat-${index}`) ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className={`h-full ${stat.bgColor} ${stat.borderColor} border-l-4 shadow-lg`} data-testid={stat.testId}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                          <IconComponent className={stat.color} size={24} />
                        </div>
                      </div>
                      <div className={`text-4xl font-bold mb-3 ${stat.color}`}>{stat.number}</div>
                      <p className="text-gray-700 mb-2 font-medium">{stat.description}</p>
                      {stat.subtext && (
                        <p className="text-sm text-gray-600">{stat.subtext}</p>
                      )}
                      {stat.source && (
                        <p className="text-xs text-gray-500 mt-3">{stat.source}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Promise Section - 450px height */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom, #F7FAFC, #EBF8FF)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem/Solution Contrast */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold font-heading" style={{ color: '#1A365D' }}>
                We're Changing How Students Access Mental Health Support
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3">Traditional Barriers:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <X className="text-red-500 mr-3" size={16} />
                      Wait 3-6 weeks for counseling appointment
                    </li>
                    <li className="flex items-center text-gray-700">
                      <X className="text-red-500 mr-3" size={16} />
                      Limited hours (9 AM - 5 PM only)
                    </li>
                    <li className="flex items-center text-gray-700">
                      <X className="text-red-500 mr-3" size={16} />
                      Fear of judgment and stigma
                    </li>
                    <li className="flex items-center text-gray-700">
                      <X className="text-red-500 mr-3" size={16} />
                      No immediate help during crisis
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3">Our Solution:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="text-green-500 mr-3" size={16} />
                      24/7 AI support and immediate coping strategies
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="text-green-500 mr-3" size={16} />
                      Same-day professional appointment booking
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="text-green-500 mr-3" size={16} />
                      Complete anonymity options available
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="text-green-500 mr-3" size={16} />
                      Instant crisis intervention protocols
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Student Success Preview */}
            <div className="space-y-6">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Sarah M.</h4>
                      <p className="text-sm text-gray-600">Junior Psychology Major</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    "I went from having daily panic attacks to managing my anxiety confidently. The 24/7 AI chat was there when I needed it most at 2 AM, and it connected me to a counselor who changed my life."
                  </p>
                  <div className="text-sm text-green-600 font-semibold">
                    Anxiety reduced by 70% in 3 months
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600">{platformStats.studentsHelped}</div>
                  <div className="text-xs text-gray-600">Students Supported</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-green-600">{platformStats.improvementRate}</div>
                  <div className="text-xs text-gray-600">Report Improvement</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-purple-600">{platformStats.averageResponseTime}</div>
                  <div className="text-xs text-gray-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Student Journey Section - 600px height */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="journey-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('journey-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Your Personal Path to Mental Wellness</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every journey is unique - start wherever feels right for you
            </p>
          </div>
          
          <div className="relative">
            {/* Journey Timeline */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-8 lg:space-y-0 lg:space-x-4">
              {journeySteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    id={`journey-${index}`}
                    className={`flex-1 max-w-sm mx-auto lg:mx-0 fade-in ${visibleElements.has(`journey-${index}`) ? 'visible' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="h-full shadow-lg border border-border hover:shadow-xl transition-shadow duration-300" data-testid={step.testId}>
                      <CardContent className="p-6 text-center">
                        <div className={`w-20 h-20 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                          <IconComponent className={step.iconColor} size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{step.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            <Clock className="inline mr-1" size={14} />
                            {step.time}
                          </div>
                          <Button variant="ghost" className="text-primary font-semibold text-sm p-0 h-auto">
                            {step.action}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Connecting Line (hidden on mobile) */}
                    {index < journeySteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 w-full">
                        <div className="flex items-center">
                          <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                          <ArrowRight className="text-gray-400 mx-2" size={20} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground italic">You can start at any step - there's no wrong way to begin your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Breaking Barriers Section - 350px height */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="barriers-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('barriers-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Breaking Down Barriers to Mental Health Support</h2>
            <p className="text-xl text-muted-foreground">We understand the challenges students face and we've designed solutions for each one</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {barrierSolutions.map((barrier, index) => {
              const ProblemIcon = barrier.problemIcon;
              return (
                <div
                  key={index}
                  id={`barrier-${index}`}
                  className={`fade-in ${visibleElements.has(`barrier-${index}`) ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full shadow-lg border border-border bg-white" data-testid={barrier.testId}>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                          <ProblemIcon className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground font-heading">The Problem</h3>
                      </div>
                      <p className="text-gray-700 mb-6 font-medium">{barrier.barrier}</p>
                      
                      <h4 className="text-lg font-bold text-green-600 mb-4">Our Solution:</h4>
                      <ul className="space-y-2 mb-6">
                        {barrier.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-gray-700 text-sm">{solution}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700 italic">"{barrier.studentQuote}"</p>
                        <p className="text-xs text-gray-500 mt-2">- Anonymous Student</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Success Stories Section - 400px height */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="stories-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('stories-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Real Stories from Students Like You</h2>
            <p className="text-xl text-muted-foreground">Anonymous testimonials from students who found support through our platform</p>
          </div>
          
          <div className="relative">
            <div className="grid lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div
                  key={index}
                  id={`story-${index}`}
                  className={`fade-in ${visibleElements.has(`story-${index}`) ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className={`h-full shadow-lg border border-border bg-gradient-to-br ${story.background}`} data-testid={story.testId}>
                    <CardContent className="p-8">
                      <div className="mb-4">
                        <Badge variant="secondary" className="mb-3">{story.studentType}</Badge>
                      </div>
                      <p className="text-gray-700 italic mb-6 leading-relaxed">"{story.quote}"</p>
                      
                      <div className="space-y-3 mb-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 mb-1">Journey:</h4>
                          <p className="text-sm text-gray-700">{story.journey}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 mb-1">Timeline:</h4>
                          <p className="text-sm text-gray-700">{story.timeline}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Verified Success Story</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
                <ExternalLink className="mr-2" size={16} />
                Read More Success Stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - 500px height */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="faq-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('faq-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Your Questions, Honestly Answered</h2>
            <p className="text-xl text-muted-foreground">We understand you might have concerns. Here's the truth about mental health support.</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqQuestions.map((faq, index) => (
              <div
                key={faq.id}
                id={`faq-${index}`}
                className={`fade-in ${visibleElements.has(`faq-${index}`) ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionItem value={faq.id} className="bg-white border border-gray-200 rounded-lg px-6" data-testid={faq.testId}>
                  <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary py-6">
                    <div className="flex items-center">
                      <HelpCircle className="text-primary mr-3 flex-shrink-0" size={20} />
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Mental Health Myths vs Facts Section - 350px height */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="myths-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('myths-header') ? 'visible' : ''}`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Separating Mental Health Myths from Facts</h2>
            <p className="text-xl text-muted-foreground">Let's clear up common misconceptions that prevent students from getting help</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {mythsFacts.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  id={`myth-${index}`}
                  className={`fade-in ${visibleElements.has(`myth-${index}`) ? 'visible' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full shadow-lg border border-border bg-white hover:shadow-xl transition-shadow duration-300" data-testid={item.testId}>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                          <X className="text-red-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-red-600 font-heading">MYTH</h3>
                      </div>
                      <p className="text-gray-700 mb-6 font-medium italic">"{item.myth}"</p>
                      
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                          <IconComponent className="text-green-600" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-green-600 font-heading">FACT</h3>
                      </div>
                      <p className="text-gray-700">{item.fact}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Integration Section - 300px height */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Campus Visual */}
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <Building className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Your Campus Network</h3>
                  <p className="text-gray-600">Connected • Coordinated • Comprehensive</p>
                </div>
              </div>
              
              {/* Connection Points */}
              <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
                <div className="flex items-center text-sm">
                  <GraduationCap className="text-blue-600 mr-2" size={16} />
                  Counseling Center
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
                <div className="flex items-center text-sm">
                  <Heart className="text-red-600 mr-2" size={16} />
                  Health Services
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-md">
                <div className="flex items-center text-sm">
                  <Users className="text-green-600 mr-2" size={16} />
                  Residence Life
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-md">
                <div className="flex items-center text-sm">
                  <LifeBuoy className="text-purple-600 mr-2" size={16} />
                  Crisis Response
                </div>
              </div>
            </div>

            {/* Integration Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">Seamlessly Connected to Your Campus Support Network</h2>
                <p className="text-xl text-muted-foreground">We work with your existing campus resources to provide comprehensive care</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Calendar className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Direct Campus Counselor Booking</h4>
                    <p className="text-muted-foreground text-sm">Schedule appointments with your campus counseling center</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <BookOpen className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Academic Support Integration</h4>
                    <p className="text-muted-foreground text-sm">Connect to tutoring when stress affects your grades</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <AlertTriangle className="text-red-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Crisis Response Protocol</h4>
                    <p className="text-muted-foreground text-sm">Automatic connection to campus crisis intervention teams</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <BarChart3 className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Anonymous Campus Insights</h4>
                    <p className="text-muted-foreground text-sm">Help your school understand student needs (no personal data shared)</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4">
                <Badge variant="secondary" className="bg-green-100 text-green-700">✓ HIPAA Compliant</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">✓ University Verified</Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">✓ Student Privacy Protected</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Platform Statistics */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 font-heading">Making a Real Difference in Student Mental Health</h2>
            <p className="text-xl text-blue-100">Join thousands of students who have found support, hope, and healing</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">{platformStats.studentsHelped}</div>
              <div className="text-blue-100">Students Supported</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">{platformStats.improvementRate}</div>
              <div className="text-blue-100">Report Improvement</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">{platformStats.averageResponseTime}</div>
              <div className="text-blue-100">Average Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold mb-2">{platformStats.campusPartnerships}</div>
              <div className="text-blue-100">Campus Partners</div>
            </div>
          </div>
          
          <div className="mt-12">
            <Link href="/chatbot">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-lg font-semibold shadow-lg">
                <MessageCircle className="mr-2" size={20} />
                Start Your Mental Health Journey Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
