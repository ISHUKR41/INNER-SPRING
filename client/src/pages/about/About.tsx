import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Shield, 
  Users, 
  Brain,
  MessageCircle,
  CheckCircle
} from "lucide-react";

/**
 * About Us Page - Platform mission, team, and information
 * Features comprehensive information about MindCare's mission and services
 */
export default function About() {
  // Platform statistics
  const platformStats = [
    { label: "Students Supported", value: "10,000+", icon: Users },
    { label: "Crisis Interventions", value: "500+", icon: Heart },
    { label: "Resources Available", value: "200+", icon: Brain }
  ];

  // Core values
  const values = [
    {
      title: "Accessibility",
      description: "Mental health support should be available to every student, regardless of background or financial situation.",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Privacy",
      description: "Your personal information and conversations are completely confidential and secure.",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Compassion",
      description: "We approach every interaction with empathy, understanding, and non-judgmental support.",
      icon: Heart,
      color: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold text-foreground mb-6">
                About MindCare
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We're dedicated to making mental health support accessible, confidential, and effective for every student. 
                Your wellbeing is our mission.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {platformStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <IconComponent className="mx-auto mb-3 text-primary" size={32} />
                        <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Empowering students with accessible, evidence-based mental health support through technology and human connection
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-foreground">Why MindCare Exists</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Student mental health challenges are at an all-time high, yet many barriers prevent students from getting the help they need. 
                  Long wait times, stigma, cost, and accessibility issues leave too many students struggling alone.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  MindCare bridges this gap by providing immediate, confidential, and professional-grade mental health support. 
                  Our platform combines AI-powered assistance, licensed counselors, peer support, and evidence-based assessment tools 
                  to create a comprehensive support ecosystem.
                </p>
                <div className="flex items-center space-x-4">
                  <Button className="bg-primary text-white" asChild data-testid="button-get-started">
                    <a href="/assessments">Get Started Today</a>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Students supporting each other in a campus setting" 
                  className="rounded-2xl shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Student-Centered</p>
                      <p className="text-sm text-muted-foreground">Designed by and for students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center ${value.color}`}>
                        <IconComponent size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who have found support, understanding, and healing through MindCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild data-testid="button-start-journey">
                <a href="/assessment">
                  <Brain className="mr-2" size={20} />
                  Start Assessment
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild data-testid="button-chat-now">
                <a href="/chatbot">
                  <MessageCircle className="mr-2" size={20} />
                  Chat with AI
                </a>
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}