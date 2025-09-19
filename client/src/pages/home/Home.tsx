import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { data: featuredResources = [], isLoading: resourcesLoading, error: resourcesError } = useQuery<Resource[]>({
    queryKey: ["/api/resources/featured"],
  });

  // Mock dashboard stats - in production would come from API
  const dashboardStats = {
    studentsHelped: 2847,
    activeSessions: 1234,
    averageResponseTime: "< 2 min",
  };

  // Professional service tiles configuration with enhanced styling
  const serviceTiles = [
    {
      title: "AI Chatbot",
      description: "Instant support and coping strategies available 24/7. Our empathetic AI companion provides personalized guidance for stress, anxiety, and emotional wellness.",
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
      title: "Book Appointments",
      description: "Schedule confidential one-on-one sessions with licensed counselors and mental health professionals. Flexible scheduling with same-day availability.",
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
      title: "Self-Assessment",
      description: "Comprehensive mental health screening using clinically validated tools (PHQ-9, GAD-7, GHQ). Get personalized insights and recommendations.",
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
      title: "Resources Library",
      description: "Access curated mental health resources including guided meditations, educational videos, articles, and downloadable guides in multiple languages.",
      icon: BookOpen,
      href: "/resources",
      gradient: "from-amber-50 to-yellow-100",
      hoverGradient: "amber",
      iconColor: "text-amber-600",
      buttonColor: "text-amber-600",
      shadowColor: "shadow-amber-200/50",
      testId: "tile-resources"
    },
    {
      title: "Peer Support",
      description: "Join safe, moderated community forums where students share experiences and support each other. Anonymous participation with professional oversight.",
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
      title: "Emergency Help",
      description: "24/7 crisis support with immediate access to emergency hotlines, campus counselors, and urgent mental health resources. Help is always available.",
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
                        <p className="text-muted-foreground mb-6 leading-relaxed text-sm group-hover:text-opacity-80 transition-colors duration-300">{tile.description}</p>
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

      {/* Enhanced Featured Resources Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div 
                id="featured-header"
                className={`fade-in ${visibleElements.has('featured-header') ? 'visible' : ''}`}
              >
                <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Featured Mental Health Resources</h2>
                <p className="text-xl text-muted-foreground mb-12">Curated content to support your mental wellness journey</p>
                
                {/* Dynamic Resource Cards with Loading States */}
                {resourcesLoading ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Loading Skeletons */}
                    {[1, 2].map((index) => (
                      <Card key={index} className="shadow-lg border border-border">
                        <CardContent className="p-0">
                          <Skeleton className="w-full h-48 rounded-t-lg" />
                          <div className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-10 w-32" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : resourcesError ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Unable to load featured resources at the moment.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                      data-testid="button-retry-resources"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : featuredResources.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {featuredResources.slice(0, 2).map((resource) => {
                      const getResourceIcon = (type: string) => {
                        switch (type) {
                          case 'video': return Play;
                          case 'audio': return Play;
                          case 'pdf': return Download;
                          case 'article': return BookOpen;
                          default: return BookOpen;
                        }
                      };
                      
                      const getResourceColor = (category: string) => {
                        switch (category) {
                          case 'anxiety': return 'from-blue-50/50 to-white';
                          case 'depression': return 'from-purple-50/50 to-white';
                          case 'stress': return 'from-green-50/50 to-white';
                          case 'sleep': return 'from-indigo-50/50 to-white';
                          case 'academic': return 'from-amber-50/50 to-white';
                          default: return 'from-gray-50/50 to-white';
                        }
                      };
                      
                      const IconComponent = getResourceIcon(resource.type);
                      
                      return (
                        <Card 
                          key={resource.id} 
                          className={`group shadow-lg border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${getResourceColor(resource.category)}`}
                          data-testid={`card-resource-${resource.id}`}
                        >
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img 
                                src={resource.thumbnailUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200`}
                                alt={resource.title} 
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                              {resource.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    <IconComponent className="text-primary ml-1" size={24} fill="currentColor" />
                                  </div>
                                </div>
                              )}
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-primary text-primary-foreground capitalize">
                                  {resource.type} {resource.type === 'pdf' ? 'Guide' : resource.type === 'video' ? 'Guide' : 'Content'}
                                </Badge>
                              </div>
                              {resource.duration && (
                                <div className="absolute bottom-4 right-4">
                                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                                    {resource.duration} min
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                {resource.title}
                              </h3>
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {resource.description || 'Helpful resource for mental wellness and support.'}
                              </p>
                              <div className="flex items-center justify-between">
                                <Button 
                                  className="bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300" 
                                  data-testid={`button-access-${resource.type}`}
                                  onClick={() => resource.url && window.open(resource.url, '_blank')}
                                >
                                  <IconComponent className="mr-2" size={16} />
                                  {resource.type === 'video' ? 'Watch Now' : 
                                   resource.type === 'audio' ? 'Listen Now' :
                                   resource.type === 'pdf' ? 'Download PDF' : 'Read Article'}
                                </Button>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                                  Featured
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback to curated static content when API returns empty */
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Fallback Video Resource Card */}
                    <Card className="group shadow-lg border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50/50 to-white" data-testid="card-breathing-exercise-fallback">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                            alt="Peaceful meditation scene with person in lotus position" 
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                              <Play className="text-primary ml-1" size={24} fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-primary-foreground">Video Guide</Badge>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 text-foreground">5 min</Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">5-Minute Mindful Breathing</h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">Guided breathing exercise to reduce anxiety and stress. Perfect for between classes or during study breaks.</p>
                          <div className="flex items-center justify-between">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300" data-testid="button-start-exercise">
                              <Play className="mr-2" size={16} />
                              Watch Now
                            </Button>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                              4.9 (2.3k views)
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Fallback Study Guide Card */}
                    <Card className="group shadow-lg border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50/50 to-white" data-testid="card-study-guide-fallback">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img 
                            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                            alt="Student studying with healthy habits and wellness items around" 
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-secondary text-secondary-foreground">PDF Guide</Badge>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 text-foreground">15 min read</Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">Study-Life Balance Strategies</h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed">Evidence-based techniques for managing academic pressure while maintaining mental wellness and social connections.</p>
                          <div className="flex items-center justify-between">
                            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white group-hover:shadow-lg transition-all duration-300" data-testid="button-download-guide">
                              <Download className="mr-2" size={16} />
                              Get PDF Guide
                            </Button>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Heart className="w-4 h-4 text-red-400 mr-1" fill="currentColor" />
                              1.8k saves
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Quick Action Resources */}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  <Card className="group p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-violet-100 hover:border-violet-200" data-testid="card-quick-mood-check">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-200 rounded-lg flex items-center justify-center">
                        <Heart className="text-violet-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Quick Mood Check</h4>
                        <p className="text-sm text-muted-foreground">2-minute assessment</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="group p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-amber-100 hover:border-amber-200" data-testid="card-sleep-sounds">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                        <Play className="text-amber-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Sleep Sounds</h4>
                        <p className="text-sm text-muted-foreground">Calming audio tracks</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="group p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-emerald-100 hover:border-emerald-200" data-testid="card-crisis-support">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                        <Phone className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Crisis Support</h4>
                        <p className="text-sm text-muted-foreground">24/7 helplines</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Enhanced Daily Wellness Tip with Rotation */}
            <div 
              id="wellness-tip"
              className={`fade-in ${visibleElements.has('wellness-tip') ? 'visible' : ''}`}
            >
              <Card className="gradient-primary text-white shadow-xl border-0 overflow-hidden" data-testid="card-wellness-tip">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold font-heading">Daily Wellness Tip</h3>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                    <div className="mb-4">
                      <Badge className="bg-white/20 text-white border-white/30 mb-3">Today's Focus: Gratitude</Badge>
                      <p className="text-lg mb-4 leading-relaxed">"Take a moment to practice gratitude. Write down three things you're grateful for today."</p>
                      <p className="text-sm opacity-90 leading-relaxed">Research shows that regular gratitude practice can improve mood, reduce stress, and enhance overall life satisfaction by up to 25%.</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-75">💡 Pro tip: Set a daily reminder</span>
                      <span className="opacity-75">⏱️ 2 min practice</span>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm" data-testid="button-more-tips">
                    <ArrowRight className="mr-2" size={16} />
                    Explore More Tips
                  </Button>
                </CardContent>
              </Card>
              
              {/* Enhanced Quick Statistics Dashboard */}
              <Card className="mt-8 shadow-xl border border-border bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm" data-testid="card-statistics">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground font-heading">Live Platform Impact</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Students Supported</span>
                          <div className="font-bold text-2xl text-foreground" data-testid="text-students-helped">{dashboardStats.studentsHelped.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">+12% this month</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <MessageCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Active Sessions</span>
                          <div className="font-bold text-2xl text-foreground" data-testid="text-active-sessions">{dashboardStats.activeSessions.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">Right now</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Clock className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                          <div className="font-bold text-2xl text-foreground" data-testid="text-response-time">{dashboardStats.averageResponseTime}</div>
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">Excellent</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                    <div className="flex items-center space-x-2">
                      <Shield className="text-primary" size={16} />
                      <span className="text-sm font-medium text-primary">100% Confidential & Anonymous</span>
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
