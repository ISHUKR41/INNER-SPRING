import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Shield,
  Heart,
  Clock,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Target,
  Brain,
  UserCheck,
  Lightbulb,
  Handshake,
  Sprout,
  X,
  Building,
  GraduationCap,
  LifeBuoy,
  Award,
  HelpCircle,
  ChevronRight,
  Star,
  Quote,
  Zap,
  HeadphonesIcon,
  Smartphone,
  Globe,
  Accessibility,
  UserPlus,
  Calendar as CalendarIcon,
  Bot,
  PhoneCall
} from "lucide-react";

/**
 * Professional MindCare Homepage - Complete Mental Health Platform
 * 
 * Ultra-detailed, modern, and responsive homepage designed for student mental health support.
 * Features comprehensive content, professional design, and full functionality.
 */
export default function Home() {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev.add(entry.target.id)));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Crisis statistics data
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
      icon: TrendingUp,
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

  // Feature tiles data
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
      icon: CalendarIcon,
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

  // Journey steps data
  const journeySteps = [
    {
      title: "Something Feels Off",
      description: "You're feeling anxious, depressed, overwhelmed, or just not yourself. Academic pressure is mounting, sleep is disrupted, or relationships feel strained.",
      time: "This moment of awareness", 
      icon: Lightbulb,
      action: "Take anonymous self-assessment",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      title: "Private Self-Check",
      description: "Complete evidence-based assessments (PHQ-9, GAD-7) in complete privacy. No judgment, no pressure, just understanding your current state.",
      time: "5-10 minutes",
      icon: Shield, 
      action: "Get personalized recommendations",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Instant AI Guidance",
      description: "Get immediate coping strategies, breathing exercises, crisis support, and personalized recommendations available 24/7.",
      time: "Available instantly",
      icon: Bot,
      action: "Chat now or explore resources", 
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Expert Professional Care", 
      description: "When you're ready, connect with licensed counselors, campus professionals, or specialized therapists who understand student life.",
      time: "Same day to 1 week",
      icon: Handshake,
      action: "Book confidential appointment",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Sustained Wellness",
      description: "Join peer support communities, track your progress, access ongoing resources, and maintain long-term mental health.", 
      time: "Your ongoing journey",
      icon: Sprout,
      action: "Join student community",
      bgColor: "bg-teal-50 dark:bg-teal-900/20"
    }
  ];

  // Challenge cards data
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

  // Solution comparison data
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

  // Testimonial carousel
  const testimonials = [
    {
      quote: "I went from having daily panic attacks to managing my anxiety confidently. The 24/7 AI chat was there when I needed it most at 2 AM, and it connected me to a counselor who changed my life.",
      author: "Sarah M., Junior Psychology Major",
      result: "Anxiety reduced by 70% in 3 months"
    },
    {
      quote: "I felt completely alone and was planning to drop out. The peer support forum showed me I wasn't the only one struggling. My counselor helped me understand that depression isn't a personal failure.",
      author: "Anonymous Junior, International Student", 
      result: "Now thriving in major and helping other students"
    },
    {
      quote: "During my darkest moment, the crisis chat connected me to help immediately. Now I understand that asking for help was the strongest thing I could do.",
      author: "Anonymous Senior, First-Generation College",
      result: "Graduating next month with honors"
    }
  ];

  // Testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-shape floating-shape-1"></div>
          <div className="floating-shape floating-shape-2"></div>
          <div className="floating-shape floating-shape-3"></div>
          <div className="floating-triangle floating-triangle-1"></div>
          <div className="floating-triangle floating-triangle-2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8" data-animate id="hero-content">
              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-gray-900 dark:text-white leading-tight">
                  Your Mental Health Journey
                  <span className="block text-primary">Starts Here</span>
                </h1>
                
                <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                  Safe, Confidential, Professional Support Available 24/7
                </h2>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Break free from the barriers that prevent students from accessing mental health support. Our evidence-based platform combines AI-powered assistance, professional counseling, and peer community support—all designed specifically for the unique challenges of college life.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/assessment">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                    data-testid="button-start-assessment"
                  >
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link href="/chatbot">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto"
                    data-testid="button-chat-ai"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with AI Now
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {[
                  { text: "100% Confidential", icon: Shield },
                  { text: "HIPAA Secure", icon: CheckCircle },
                  { text: "24/7 Available", icon: Clock },
                  { text: "Evidence-Based", icon: Award }
                ].map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{indicator.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image/Illustration */}
            <div className="relative" data-animate id="hero-image">
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform rotate-1">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-secondary rounded-full"></div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Supporting Student Wellness
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Join thousands of students finding their path to mental wellness
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Users, label: "Community" },
                      { icon: HeadphonesIcon, label: "Support" },
                      { icon: Heart, label: "Care" },
                      { icon: Shield, label: "Privacy" },
                      { icon: Clock, label: "24/7" },
                      { icon: Target, label: "Goals" }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <item.icon className="h-6 w-6 text-primary mx-auto mb-1" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crisis Statistics Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900" data-animate id="crisis-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-red-600 dark:text-red-400 mb-4">
              The Student Mental Health Crisis Demands Immediate Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The numbers reveal an urgent need for accessible, comprehensive mental health support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {crisisStatistics.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-red-500 dark:border-t-red-400">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <stat.icon className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  
                  <div className="text-5xl font-bold text-red-600 dark:text-red-400">
                    {stat.number}
                  </div>
                  
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {stat.description}
                  </p>
                  
                  {stat.additional && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.additional}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    {stat.source}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Promise Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800" data-animate id="solution-promise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              We're Changing How Students Access Mental Health Support
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
            {/* Traditional Barriers */}
            <div>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-8 flex items-center">
                <X className="h-6 w-6 mr-3" />
                Traditional Barriers
              </h3>
              <div className="space-y-4">
                {traditionalBarriers.map((barrier, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{barrier}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Solutions */}
            <div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-8 flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                Our Solution
              </h3>
              <div className="space-y-4">
                {ourSolutions.map((solution, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Success Story */}
          <Card className="bg-primary/10 dark:bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <Quote className="h-12 w-12 text-primary mx-auto" />
                
                <blockquote className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <div className="space-y-2">
                  <p className="font-semibold text-primary">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {testimonials[currentTestimonial].result}
                  </p>
                </div>

                {/* Testimonial indicators */}
                <div className="flex justify-center space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                      data-testid={`testimonial-indicator-${index}`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Numbers */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { number: "15,000+", text: "students already supported" },
              { number: "94%", text: "report improved mental health" },
              { number: "< 30 sec", text: "average response time" }
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{metric.number}</div>
                <p className="text-gray-600 dark:text-gray-400">{metric.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Student Journey */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900" data-animate id="student-journey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              Your Personal Path to Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every journey is unique - start wherever feels right for you
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {index + 1}
                  </div>
                  
                  <Card className={`${step.bgColor} border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 pt-8`}>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {step.description}
                      </p>
                      
                      <div className="text-xs text-primary font-medium">
                        {step.time}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4 text-xs"
                        data-testid={`button-${step.action.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {step.action}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Feature Tiles */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800" data-animate id="feature-tiles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              Choose Your Starting Point
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every feature designed specifically for student mental health challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureTiles.map((tile, index) => (
              <Card key={index} className={`${tile.gradient} border-0 hover:scale-105 hover:shadow-2xl transition-all duration-300 ${tile.isEmergency ? 'ring-2 ring-red-400 dark:ring-red-500' : ''}`}>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl ${tile.isEmergency ? 'bg-red-500' : 'bg-white dark:bg-gray-700'} flex items-center justify-center shadow-lg`}>
                      <tile.icon className={`h-7 w-7 ${tile.isEmergency ? 'text-white' : 'text-primary'}`} />
                    </div>
                    {tile.isEmergency && (
                      <Badge className="bg-red-500 text-white">Emergency</Badge>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {tile.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {tile.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
                      {tile.useCase}
                    </p>
                  </div>

                  {(tile.additionalInfo || tile.privacyNote || tile.contentNote || tile.safetyNote) && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
                      {tile.additionalInfo || tile.privacyNote || tile.contentNote || tile.safetyNote}
                    </div>
                  )}

                  <Link href={tile.href}>
                    <Button 
                      className={`w-full ${tile.isEmergency 
                        ? 'bg-red-500 hover:bg-red-600 text-white emergency-pulse' 
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                      } font-semibold py-3 transition-all duration-300`}
                      data-testid={`button-${tile.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {tile.button}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Challenges Section */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-900" data-animate id="student-challenges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              Mental Health Challenges Unique to Student Life
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We understand the specific pressures you face
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {challengeCards.map((challenge, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <challenge.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {challenge.header}
                      </h3>
                      <div className="text-2xl font-bold text-primary mb-3">
                        {challenge.statistic}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Common symptoms:</span> {challenge.symptoms}
                  </p>
                  
                  <blockquote className="border-l-4 border-secondary pl-4 italic text-gray-600 dark:text-gray-400">
                    "{challenge.quote}"
                  </blockquote>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid={`button-learn-more-${index}`}
                  >
                    Learn More & Get Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Breaking Barriers Section */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800" data-animate id="breaking-barriers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              Breaking Down Every Barrier to Mental Health Care
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Stigma & Privacy */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Fear of Judgment & Stigma
              </h3>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Student concerns:</h4>
                {[
                  "What if people find out?",
                  "Will this affect my future?",
                  "Am I weak for needing help?",
                  "What will my family think?"
                ].map((concern, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <HelpCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm italic">"{concern}"</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Our solutions:</h4>
                {[
                  "100% anonymous usage options",
                  "No names required for AI chat",
                  "Private, encrypted conversations",
                  "Confidential professional appointments",
                  "HIPAA-compliant data protection"
                ].map((solution, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{solution}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 italic text-sm text-gray-600 dark:text-gray-400">
                "I was terrified someone would find out, but the anonymous chat gave me the courage to eventually book counseling." - Anonymous Junior
              </blockquote>
            </div>

            {/* Accessibility & Availability */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Limited Access & Long Wait Times
              </h3>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Student concerns:</h4>
                {[
                  "Counseling center is always booked",
                  "I need help at 2 AM, not 2 PM",
                  "I can't miss class for appointments",
                  "I can't afford private therapy"
                ].map((concern, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <HelpCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm italic">"{concern}"</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Our solutions:</h4>
                {[
                  "24/7 AI support, never closed",
                  "Same-day professional appointments available",
                  "Flexible scheduling around your classes",
                  "Free campus counseling integration",
                  "Multiple communication options (text, video, phone)"
                ].map((solution, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{solution}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 italic text-sm text-gray-600 dark:text-gray-400">
                "Having AI support at 3 AM during finals week literally saved me from a complete breakdown." - Anonymous Senior
              </blockquote>
            </div>

            {/* Knowledge & Recognition */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Not Knowing When/How to Get Help
              </h3>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Student concerns:</h4>
                {[
                  "Is this normal college stress or something more?",
                  "How do I know if I need professional help?",
                  "Where do I even start?",
                  "What if I'm overreacting?"
                ].map((concern, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <HelpCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm italic">"{concern}"</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Our solutions:</h4>
                {[
                  "Evidence-based self-assessments for clarity",
                  "Educational resources about mental health",
                  "Clear guidance on when to seek help",
                  "Step-by-step support navigation",
                  "Professional validation of your experiences"
                ].map((solution, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{solution}</span>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 italic text-sm text-gray-600 dark:text-gray-400">
                "The assessment helped me realize that what I was feeling wasn't just 'normal stress' and I deserved support." - Anonymous Sophomore
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-primary dark:bg-primary/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Mental Health Journey Can Start Right This Moment
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Every option is confidential, secure, and designed with your complete privacy in mind
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Browse Resources Anonymously",
                description: "No signup required - explore helpful content immediately",
                time: "Start in 30 seconds",
                href: "/resources"
              },
              {
                title: "Take Mental Health Assessment", 
                description: "5-minute private screening to understand your needs",
                time: "Results in 5 minutes",
                href: "/assessment"
              },
              {
                title: "Chat with AI Support",
                description: "Get instant coping strategies and emotional support",
                time: "Connected immediately", 
                href: "/chatbot"
              },
              {
                title: "Schedule Professional Counseling",
                description: "Connect with licensed counselors when ready",
                time: "Appointments available today",
                href: "/appointments"
              }
            ].map((option, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{option.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  <div className="text-xs text-primary font-medium">{option.time}</div>
                  <Link href={option.href}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white" data-testid={`cta-${index}`}>
                      Get Started
                    </Button>
                  </Link>
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