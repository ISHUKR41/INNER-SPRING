import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  Download,
  Star,
  Shield,
  Heart,
  Clock,
  BarChart3
} from "lucide-react";
import type { Resource } from "@/types";

/**
 * Home Page Component - Landing page with hero section and service overview
 * Features responsive design with floating animations and smooth scroll effects
 */
export default function Home() {
  const [visibleElements, setVisibleElements] = useState(new Set());

  // Fetch featured resources for the homepage with proper typing and default values
  const { data: featuredResources = [], isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources/featured"],
  });

  // Mock dashboard stats - in production would come from API
  const dashboardStats = {
    studentsHelped: 2847,
    activeSessions: 1234,
    averageResponseTime: "< 2 min",
  };

  // Service tiles configuration
  const serviceTiles = [
    {
      title: "AI Chatbot",
      description: "Get instant support and personalized coping strategies available 24/7. Our AI companion understands and responds with empathy.",
      icon: MessageCircle,
      href: "/chatbot",
      gradient: "from-blue-100 to-blue-200",
      iconColor: "text-primary",
      buttonColor: "text-primary",
      testId: "tile-ai-chatbot"
    },
    {
      title: "Book Appointments",
      description: "Schedule confidential sessions with qualified counselors and mental health professionals at your convenience.",
      icon: Calendar,
      href: "/appointments",
      gradient: "from-green-100 to-green-200",
      iconColor: "text-secondary",
      buttonColor: "text-secondary",
      testId: "tile-appointments"
    },
    {
      title: "Self-Assessment",
      description: "Take validated mental health assessments (PHQ-9, GAD-7, GHQ) to understand your current state and get personalized recommendations.",
      icon: ClipboardList,
      href: "/assessment",
      gradient: "from-purple-100 to-purple-200",
      iconColor: "text-accent",
      buttonColor: "text-accent",
      testId: "tile-assessment"
    },
    {
      title: "Resources Library",
      description: "Access curated videos, audio guides, articles, and PDFs on mental health topics in multiple languages.",
      icon: BookOpen,
      href: "/resources",
      gradient: "from-orange-100 to-orange-200",
      iconColor: "text-orange-500",
      buttonColor: "text-orange-500",
      testId: "tile-resources"
    },
    {
      title: "Peer Support",
      description: "Connect safely with fellow students in moderated forums. Share experiences and support each other anonymously.",
      icon: Users,
      href: "/peer-support",
      gradient: "from-teal-100 to-teal-200",
      iconColor: "text-teal-500",
      buttonColor: "text-teal-500",
      testId: "tile-peer-support"
    },
    {
      title: "Emergency Help",
      description: "Immediate access to crisis hotlines, emergency contacts, and urgent mental health support when you need it most.",
      icon: Phone,
      href: "/emergency",
      gradient: "from-red-100 to-red-200",
      iconColor: "text-destructive",
      buttonColor: "text-destructive",
      border: "border-red-200",
      testId: "tile-emergency"
    },
  ];

  // Campus events/announcements
  const campusEvents = [
    {
      type: "Workshop",
      title: "Stress Management Workshop",
      description: "Learn effective techniques to manage academic and personal stress.",
      date: "March 15, 2024",
      time: "2:00 PM",
      badgeColor: "bg-primary/10 text-primary",
      testId: "event-stress-workshop"
    },
    {
      type: "Webinar",
      title: "Mental Health Awareness",
      description: "Understanding mental health and breaking stigma in academic environments.",
      date: "March 20, 2024",
      time: "4:00 PM",
      badgeColor: "bg-secondary/10 text-secondary",
      testId: "event-awareness-webinar"
    },
    {
      type: "Support Group",
      title: "Peer Support Circle",
      description: "Weekly peer support meetings for students dealing with anxiety.",
      date: "Every Friday",
      time: "5:00 PM",
      badgeColor: "bg-accent/10 text-accent",
      testId: "event-support-circle"
    },
  ];

  // Student testimonials
  const testimonials = [
    {
      initial: "A",
      major: "Computer Science Major",
      quote: "The AI chatbot helped me through my worst anxiety attacks. Having someone to talk to at 3 AM made all the difference during exam season.",
      gradient: "from-primary to-secondary",
      testId: "testimonial-student-a"
    },
    {
      initial: "B",
      major: "Psychology Major",
      quote: "Booking appointments was so easy and private. The counselors really understand student life and the unique pressures we face.",
      gradient: "from-secondary to-accent",
      testId: "testimonial-student-b"
    },
    {
      initial: "C",
      major: "Business Major",
      quote: "The peer support forum connected me with students who understood exactly what I was going through. I don't feel alone anymore.",
      gradient: "from-accent to-primary",
      testId: "testimonial-student-c"
    },
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
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg pt-20">
        {/* Floating Background Shapes */}
        <div className="absolute inset-0">
          <div className="floating absolute w-20 h-20 top-1/4 left-1/12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10"></div>
          <div className="floating absolute w-30 h-30 top-3/5 right-1/6 rounded-full bg-gradient-to-br from-accent/10 to-primary/10" style={{ animationDelay: '2s' }}></div>
          <div className="floating absolute w-15 h-15 top-2/5 left-3/4 rounded-full bg-gradient-to-br from-secondary/10 to-accent/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight font-heading">
                  Your Mental Health
                  <span className="text-gradient-primary block">Journey Starts Here</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Confidential, anonymous, and free mental health support designed specifically for students. 
                  Professional care is just a click away.
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
                      className={`card-hover border ${tile.border || 'border-border'} h-full cursor-pointer`}
                      data-testid={tile.testId}
                    >
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tile.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                          <IconComponent className={tile.iconColor} size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">{tile.title}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">{tile.description}</p>
                        <Button variant="ghost" className={`${tile.buttonColor} font-semibold hover:underline p-0 h-auto`}>
                          Start Now <ArrowRight className="ml-2" size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div 
                id="featured-header"
                className={`fade-in ${visibleElements.has('featured-header') ? 'visible' : ''}`}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8 font-heading">Featured Mental Health Resources</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="shadow-lg border border-border" data-testid="card-breathing-exercise">
                    <CardContent className="p-6">
                      <img 
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                        alt="Peaceful meditation scene with person in lotus position" 
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                      <h3 className="text-xl font-semibold text-foreground mb-2">5-Minute Breathing Exercise</h3>
                      <p className="text-muted-foreground mb-4">Quick stress relief technique you can use anywhere, anytime.</p>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-start-exercise">
                        <Play className="mr-2" size={16} />
                        Start Exercise
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg border border-border" data-testid="card-study-guide">
                    <CardContent className="p-6">
                      <img 
                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                        alt="Student studying with healthy habits and wellness items around" 
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                      <h3 className="text-xl font-semibold text-foreground mb-2">Study-Life Balance Guide</h3>
                      <p className="text-muted-foreground mb-4">Practical tips for managing academic stress and maintaining wellbeing.</p>
                      <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white" data-testid="button-download-guide">
                        <Download className="mr-2" size={16} />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Daily Wellness Tip */}
            <div 
              id="wellness-tip"
              className={`fade-in ${visibleElements.has('wellness-tip') ? 'visible' : ''}`}
            >
              <Card className="gradient-primary text-white shadow-lg" data-testid="card-wellness-tip">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 font-heading">Daily Wellness Tip</h3>
                  <div className="bg-white/20 rounded-xl p-6 mb-6">
                    <p className="text-lg mb-4">"Take a moment to practice gratitude. Write down three things you're grateful for today."</p>
                    <p className="text-sm opacity-90">This simple practice can improve mood and reduce stress levels.</p>
                  </div>
                  <Button variant="secondary" className="w-full" data-testid="button-more-tips">
                    Get More Tips
                  </Button>
                </CardContent>
              </Card>
              
              {/* Quick Statistics */}
              <Card className="mt-8 shadow-lg border border-border" data-testid="card-statistics">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4 font-heading">Platform Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Students Helped</span>
                      <span className="font-bold text-foreground" data-testid="text-students-helped">{dashboardStats.studentsHelped.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Sessions</span>
                      <span className="font-bold text-foreground" data-testid="text-active-sessions">{dashboardStats.activeSessions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-bold text-foreground" data-testid="text-response-time">{dashboardStats.averageResponseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Events Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="events-header"
            className={`text-center mb-12 fade-in ${visibleElements.has('events-header') ? 'visible' : ''}`}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">Campus Mental Health Events</h2>
            <p className="text-xl text-muted-foreground">Stay updated with workshops, webinars, and support groups</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {campusEvents.map((event, index) => (
              <div
                key={index}
                id={`event-${index}`}
                className={`fade-in ${visibleElements.has(`event-${index}`) ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="shadow-lg border border-border h-full" data-testid={event.testId}>
                  <CardContent className="p-6">
                    <Badge className={`${event.badgeColor} mb-4`}>
                      {event.type}
                    </Badge>
                    <h3 className="text-xl font-semibold text-foreground mb-2 font-heading">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="mr-2" size={16} />
                      <span>{event.date}</span>
                      <Clock className="ml-4 mr-2" size={16} />
                      <span>{event.time}</span>
                    </div>
                    <Button variant="ghost" className="text-primary font-semibold hover:underline p-0" data-testid={`button-${event.testId}`}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="testimonials-header"
            className={`text-center mb-16 fade-in ${visibleElements.has('testimonials-header') ? 'visible' : ''}`}
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">What Students Say</h2>
            <p className="text-xl text-muted-foreground">Real experiences from students who found support through MindCare</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                id={`testimonial-${index}`}
                className={`fade-in ${visibleElements.has(`testimonial-${index}`) ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="shadow-lg border border-border h-full" data-testid={testimonial.testId}>
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold`}>
                        {testimonial.initial}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-foreground">Anonymous Student</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.major}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
