import { useState } from "react";
import ProfessionalNavbar from "@/components/layout/ProfessionalNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  MessageSquare,
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
  HeartHandshake,
  Brain,
  Video,
  Mail,
  ExternalLink,
  User,
  Users,
  Heart,
  CheckCircle,
} from "lucide-react";

/**
 * Crisis Help Page - Dedicated emergency support and crisis intervention
 *
 * This page provides immediate access to crisis support resources, emergency contacts,
 * and guided assistance for students experiencing mental health emergencies.
 * Designed for maximum accessibility and immediate help during crisis situations.
 *
 * Features:
 * - Immediate emergency contacts with one-click calling
 * - Crisis assessment and guided support steps
 * - Local and national crisis hotlines
 * - Safety planning resources
 * - Professional emergency intervention options
 * - 24/7 availability information
 *
 * @author MindCare Development Team
 * @version 1.0.0
 */
export default function CrisisHelp() {
  const [selectedTab, setSelectedTab] = useState("immediate");
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // National crisis hotlines with comprehensive contact information
  const nationalCrisisLines = [
    {
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      description:
        "Free, confidential support 24/7 for people in suicidal crisis or emotional distress",
      available: "24/7",
      languages: ["English", "Spanish"],
      type: "phone",
      priority: "high",
      testId: "crisis-988",
    },
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to 741741 for free, 24/7 crisis counseling",
      available: "24/7",
      languages: ["English", "Spanish"],
      type: "text",
      priority: "high",
      textInstructions: "Text HOME to 741741",
      testId: "crisis-text",
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "24/7 confidential support for domestic violence survivors",
      available: "24/7",
      languages: ["Multiple languages"],
      type: "phone",
      priority: "medium",
      testId: "crisis-domestic-violence",
    },
    {
      name: "LGBTQ National Lifeline",
      number: "1-888-843-4564",
      description: "Confidential support for LGBTQ+ individuals in crisis",
      available: "24/7",
      languages: ["English"],
      type: "phone",
      priority: "medium",
      testId: "crisis-lgbtq",
    },
  ];

  // Local campus emergency resources
  const campusEmergencyResources = [
    {
      service: "Campus Emergency Services",
      contact: "911",
      description:
        "Immediate emergency response for life-threatening situations",
      location: "Available campus-wide",
      response: "Immediate",
      type: "emergency",
    },
    {
      service: "Campus Crisis Counselor",
      contact: "(555) 123-HELP",
      description: "24/7 on-call mental health crisis intervention",
      location: "Student Health Center",
      response: "Within 30 minutes",
      type: "crisis",
    },
    {
      service: "Campus Security Escort",
      contact: "(555) 123-SAFE",
      description: "Safe escort services anywhere on campus",
      location: "Campus-wide",
      response: "Within 15 minutes",
      type: "safety",
    },
    {
      service: "Emergency Room - University Hospital",
      contact: "(555) 123-ER99",
      description: "24/7 emergency medical and psychiatric care",
      location: "1234 University Ave",
      response: "Immediate",
      type: "medical",
    },
  ];

  // Crisis assessment questions to help guide users
  const crisisAssessmentSteps = [
    {
      title: "Immediate Safety Check",
      questions: [
        "Are you in immediate physical danger?",
        "Do you have thoughts of harming yourself or others?",
        "Are you in a safe location right now?",
      ],
      action: "If YES to any danger questions, call 911 or 988 immediately",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Current Support System",
      questions: [
        "Is there someone you trust nearby?",
        "Do you have a safe person you can contact?",
        "Are you alone right now?",
      ],
      action: "Contact a trusted person or crisis counselor for support",
      icon: HeartHandshake,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Professional Help Assessment",
      questions: [
        "Have you been thinking about this crisis for more than a few hours?",
        "Do you feel unable to cope with current stress?",
        "Would talking to a professional help right now?",
      ],
      action:
        "Consider speaking with a campus counselor or calling a crisis line",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  // Safety planning steps for crisis management
  const safetyPlanningSteps = [
    {
      step: 1,
      title: "Recognize Warning Signs",
      description:
        "Identify thoughts, feelings, or situations that indicate you may be entering a crisis",
      icon: Brain,
    },
    {
      step: 2,
      title: "Internal Coping Strategies",
      description:
        "Things you can do to distract yourself or feel better without contacting others",
      icon: HeartHandshake,
    },
    {
      step: 3,
      title: "Contact Support People",
      description:
        "Friends, family, or mentors who can provide support and help you feel better",
      icon: User,
    },
    {
      step: 4,
      title: "Contact Professionals",
      description:
        "Mental health professionals, crisis hotlines, or emergency services",
      icon: Phone,
    },
    {
      step: 5,
      title: "Secure Your Environment",
      description:
        "Remove or secure access to potentially harmful items or situations",
      icon: Shield,
    },
  ];

  /**
   * Handle emergency call initiation
   * Opens phone dialer for immediate contact
   */
  const handleEmergencyCall = (number: string, label: string) => {
    // Analytics tracking for crisis intervention
    console.log(`Crisis call initiated: ${label} - ${number}`);

    // Open phone dialer
    window.open(`tel:${number}`, "_self");

    // Set emergency mode to show additional resources
    setIsEmergencyMode(true);
  };

  /**
   * Handle text crisis line initiation
   * Provides instructions for text-based crisis support
   */
  const handleTextCrisis = (instructions: string) => {
    // Create SMS link with pre-filled message
    const smsLink = `sms:741741?body=HOME`;
    window.open(smsLink, "_self");
  };

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalNavbar />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Emergency Alert Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="text-white" size={40} />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 font-heading">
              Crisis Help & Support
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              You are not alone. Professional help is available 24/7. If you're
              in immediate danger, call 911 or 988 now.
            </p>

            {/* Immediate Crisis Banner */}
            <Alert variant="destructive" className="max-w-5xl mx-auto mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-left">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold block mb-2">
                      IMMEDIATE CRISIS:
                    </span>
                    <div className="space-y-1 text-sm">
                      <div>
                        • Call 911 if you're in immediate physical danger
                      </div>
                      <div>• Call 988 if you're having thoughts of suicide</div>
                      <div>• Go to your nearest emergency room</div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() =>
                        handleEmergencyCall("911", "Emergency Services")
                      }
                      data-testid="button-call-911"
                    >
                      <Phone size={16} className="mr-1" />
                      Call 911
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() =>
                        handleEmergencyCall("988", "Crisis Lifeline")
                      }
                      data-testid="button-call-988"
                    >
                      <Phone size={16} className="mr-1" />
                      Call 988
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Main Crisis Support Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="immediate" data-testid="tab-immediate">
                Immediate Help
              </TabsTrigger>
              <TabsTrigger value="assessment" data-testid="tab-assessment">
                Crisis Assessment
              </TabsTrigger>
              <TabsTrigger value="planning" data-testid="tab-planning">
                Safety Planning
              </TabsTrigger>
              <TabsTrigger value="local" data-testid="tab-local">
                Local Resources
              </TabsTrigger>
            </TabsList>

            {/* Immediate Help Tab */}
            <TabsContent value="immediate" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* National Crisis Lines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Phone className="mr-2" size={24} />
                      National Crisis Lines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nationalCrisisLines.map((hotline, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 space-y-3 ${
                          hotline.priority === "high"
                            ? "border-red-200 bg-red-50/50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-foreground">
                                {hotline.name}
                              </h3>
                              {hotline.priority === "high" && (
                                <Badge className="bg-red-100 text-red-700">
                                  Priority
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {hotline.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{hotline.available}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageSquare size={14} />
                                <span>{hotline.languages.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone size={16} className="text-primary" />
                              <span className="font-mono text-lg font-bold">
                                {hotline.number}
                              </span>
                            </div>
                            {hotline.textInstructions && (
                              <div className="text-sm text-muted-foreground">
                                {hotline.textInstructions}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            {hotline.type === "phone" && (
                              <Button
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() =>
                                  handleEmergencyCall(
                                    hotline.number,
                                    hotline.name
                                  )
                                }
                                data-testid={hotline.testId}
                              >
                                <Phone size={16} className="mr-1" />
                                Call Now
                              </Button>
                            )}
                            {hotline.type === "text" && (
                              <Button
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  handleTextCrisis(
                                    hotline.textInstructions || ""
                                  )
                                }
                                data-testid={hotline.testId}
                              >
                                <MessageSquare size={16} className="mr-1" />
                                Text Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Immediate Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <CheckCircle className="mr-2" size={24} />
                      What You Can Do Right Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">
                          If you're having thoughts of suicide:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>
                            • Call 988 (Suicide & Crisis Lifeline) immediately
                          </li>
                          <li>• Stay with someone you trust</li>
                          <li>• Remove access to lethal means</li>
                          <li>• Go to the nearest emergency room</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">
                          If you're feeling overwhelmed:
                        </h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Take slow, deep breaths</li>
                          <li>• Call a trusted friend or family member</li>
                          <li>• Use grounding techniques (5-4-3-2-1 method)</li>
                          <li>• Call our campus crisis counselor</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">
                          If you're supporting someone in crisis:
                        </h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Listen without judgment</li>
                          <li>• Don't leave them alone</li>
                          <li>• Help them call a crisis line</li>
                          <li>• Remove access to harmful items</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Crisis Assessment Tab */}
            <TabsContent value="assessment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2" size={24} />
                    Crisis Assessment Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    These questions can help you determine the level of support
                    you need. Answer honestly - there's no judgment here.
                  </p>

                  <div className="space-y-6">
                    {crisisAssessmentSteps.map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div
                          key={index}
                          className={`p-6 rounded-lg ${step.bgColor} border`}
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${step.color}`}
                            >
                              <IconComponent size={24} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground mb-3">
                                {step.title}
                              </h3>
                              <div className="space-y-2 mb-4">
                                {step.questions.map((question, qIndex) => (
                                  <div
                                    key={qIndex}
                                    className="flex items-start space-x-2"
                                  >
                                    <span className="text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-foreground">
                                      {question}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div
                                className={`p-3 rounded-md bg-white border-l-4 ${
                                  step.color.includes("red")
                                    ? "border-red-400"
                                    : step.color.includes("blue")
                                    ? "border-blue-400"
                                    : "border-green-400"
                                }`}
                              >
                                <p className="font-medium text-foreground">
                                  {step.action}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Safety Planning Tab */}
            <TabsContent value="planning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2" size={24} />
                    Create Your Safety Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    A safety plan is a personalized, practical plan that can
                    help you stay safe when having thoughts of suicide.
                  </p>

                  <div className="space-y-6">
                    {safetyPlanningSteps.map((step) => {
                      const IconComponent = step.icon;
                      return (
                        <div
                          key={step.step}
                          className="flex items-start space-x-4 p-4 border rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <IconComponent
                                className="text-primary"
                                size={20}
                              />
                              <h3 className="text-lg font-semibold text-foreground">
                                {step.title}
                              </h3>
                            </div>
                            <p className="text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExternalLink className="text-blue-600" size={20} />
                      <h4 className="font-semibold text-blue-900">
                        Professional Safety Planning
                      </h4>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      For a comprehensive safety plan, consider working with a
                      mental health professional who can guide you through the
                      process.
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open("/appointments", "_blank")}
                      data-testid="button-book-safety-planning"
                    >
                      Book Appointment for Safety Planning
                      <ExternalLink size={16} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Local Resources Tab */}
            <TabsContent value="local" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2" size={24} />
                    Campus & Local Emergency Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {campusEmergencyResources.map((resource, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {resource.service}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {resource.description}
                            </p>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <MapPin size={14} />
                                <span>{resource.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock size={14} />
                                <span>Response: {resource.response}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Phone size={16} className="text-primary" />
                            <span className="font-mono text-lg font-bold">
                              {resource.contact}
                            </span>
                          </div>

                          <Button
                            variant={
                              resource.type === "emergency"
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleEmergencyCall(
                                resource.contact,
                                resource.service
                              )
                            }
                            data-testid={`button-call-${resource.service
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            <Phone size={16} className="mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Additional Resources */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="text-lg font-semibold mb-4">
                      Additional Support Options
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="text-primary" size={20} />
                          <h5 className="font-medium">AI Crisis Support</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Get immediate support from our crisis-trained AI
                          assistant
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open("/chatbot?crisis=true", "_blank")
                          }
                          data-testid="button-ai-crisis-support"
                        >
                          Start Crisis Chat
                        </Button>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Video className="text-primary" size={20} />
                          <h5 className="font-medium">Telehealth Crisis</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Connect with a crisis counselor via video call
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open("/appointments?crisis=true", "_blank")
                          }
                          data-testid="button-telehealth-crisis"
                        >
                          Video Counseling
                        </Button>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="text-primary" size={20} />
                          <h5 className="font-medium">Peer Crisis Support</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Connect with trained peer crisis supporters
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open("/peer-support?crisis=true", "_blank")
                          }
                          data-testid="button-peer-crisis-support"
                        >
                          Peer Support
                        </Button>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Emergency Mode Additional Resources */}
          {isEmergencyMode && (
            <Card className="mt-8 border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <HeartHandshake className="mr-2" size={24} />
                  You've Taken an Important Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground">
                    Reaching out for help shows incredible strength. Here are
                    some additional resources while you wait for support:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold mb-2">While You Wait:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Stay in a safe environment</li>
                        <li>• Keep your phone charged and nearby</li>
                        <li>• Try deep breathing exercises</li>
                        <li>• Stay connected with someone you trust</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold mb-2">Immediate Comfort:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Listen to calming music</li>
                        <li>• Use a comforting object or blanket</li>
                        <li>• Practice the 5-4-3-2-1 grounding technique</li>
                        <li>• Remember: This feeling will pass</li>
                      </ul>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>You are not alone.</strong> Help is available, and
                      you deserve support. Crisis counselors are specially
                      trained to help people in your situation.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy and Confidentiality Notice */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Shield className="mr-2" size={24} />
                Your Privacy & Confidentiality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Crisis Services Are:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Completely confidential and anonymous</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Available 24/7 without appointments</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Free of charge to all students</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Staffed by trained crisis professionals</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    We Understand:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <Heart className="text-red-500" size={16} />
                      <span>It takes courage to reach out for help</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Heart className="text-red-500" size={16} />
                      <span>You may feel scared or uncertain</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Heart className="text-red-500" size={16} />
                      <span>Crisis situations can feel overwhelming</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Heart className="text-red-500" size={16} />
                      <span>Recovery is possible with support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
