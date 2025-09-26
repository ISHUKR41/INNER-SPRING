import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfessionalNavbar from "@/components/layout/ProfessionalNavbar";
import AssessmentForm from "./components/AssessmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Brain,
  Heart,
  Shield,
  TrendingUp,
  Calendar,
  MessageCircle,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { assessmentTypes, interpretAssessmentScore } from "@/lib/assessments";
import type { Assessment } from "@/types";

/**
 * Self-Assessment Page - Mental health questionnaires with results tracking
 * Features PHQ-9, GAD-7, GHQ-12, and PSS-10 assessments with AI analysis
 */
export default function SelfAssessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>("PHQ-9");
  const [activeTab, setActiveTab] = useState("take");
  const [showResults, setShowResults] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(
    null
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock user ID - in production would come from auth context
  const userId = "mock-user-id";

  // Fetch user's assessment history with proper typing and default empty array
  const { data: assessmentHistory = [], isLoading: historyLoading } = useQuery<
    Assessment[]
  >({
    queryKey: [`/api/assessments/user/${userId}`],
    enabled: !!userId,
  });

  // Fetch latest assessment for selected type with proper typing and default null
  const { data: latestAssessment = null } = useQuery<Assessment | null>({
    queryKey: [`/api/assessments/latest/${userId}/${selectedAssessment}`],
    enabled: !!userId && !!selectedAssessment,
  });

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: {
      assessmentType: string;
      responses: any[];
      totalScore: number;
    }) => {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...assessmentData,
        }),
      });
      return await response.json();
    },
    onSuccess: (newAssessment) => {
      queryClient.invalidateQueries({
        queryKey: [`/api/assessments/user/${userId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/assessments/latest/${userId}/${selectedAssessment}`],
      });
      setCurrentAssessment(newAssessment);
      setShowResults(true);
      setActiveTab("results");
      toast({
        title: "Assessment Completed",
        description:
          "Your assessment has been analyzed and saved to your dashboard.",
      });
    },
    onError: () => {
      toast({
        title: "Assessment Failed",
        description: "Unable to save your assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAssessmentComplete = (responses: any[], totalScore: number) => {
    submitAssessmentMutation.mutate({
      assessmentType: selectedAssessment,
      responses,
      totalScore,
    });
  };

  // Get assessment progress data for charts with proper array handling
  const getProgressData = () => {
    if (!assessmentHistory || !Array.isArray(assessmentHistory)) return [];

    return assessmentHistory
      .filter(
        (assessment: Assessment) =>
          assessment.assessmentType === selectedAssessment
      )
      .slice(-6) // Last 6 assessments
      .map((assessment: Assessment) => ({
        date: new Date(assessment.completedAt).toLocaleDateString(),
        score: assessment.totalScore,
        interpretation: assessment.interpretation,
      }));
  };

  // Assessment type cards
  const assessmentCards = [
    {
      type: "PHQ-9",
      title: "Depression Screening",
      description:
        "9-question assessment to identify symptoms of depression over the past 2 weeks",
      duration: "3-5 minutes",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      borderColor: "border-blue-200",
    },
    {
      type: "GAD-7",
      title: "Anxiety Assessment",
      description:
        "7-question evaluation for generalized anxiety disorder symptoms",
      duration: "2-4 minutes",
      icon: Heart,
      color: "from-green-500 to-teal-600",
      borderColor: "border-green-200",
    },
    {
      type: "GHQ-12",
      title: "General Health",
      description: "12-question assessment of general psychological wellbeing",
      duration: "4-6 minutes",
      icon: Shield,
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-200",
    },
    {
      type: "PSS-10",
      title: "Stress Evaluation",
      description:
        "10-question perceived stress scale for stress level assessment",
      duration: "3-5 minutes",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
      borderColor: "border-orange-200",
    },
  ];

  const progressData = getProgressData();
  const currentAssessmentData = currentAssessment || latestAssessment;

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalNavbar />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-heading">
              Mental Health Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Evidence-based screening tools to understand your wellbeing and
              receive personalized recommendations
            </p>
            <Alert className="max-w-2xl mx-auto mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your responses are completely confidential and stored securely.
                Results provide guidance, not diagnosis.
              </AlertDescription>
            </Alert>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="take" data-testid="tab-take-assessment">
                Take Assessment
              </TabsTrigger>
              <TabsTrigger value="results" data-testid="tab-view-results">
                Results
              </TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-assessment-history">
                History
              </TabsTrigger>
            </TabsList>

            {/* Take Assessment Tab */}
            <TabsContent value="take" className="space-y-8">
              {/* Assessment Type Selection */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-foreground font-heading">
                  Choose Your Assessment
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {assessmentCards.map((assessment) => {
                    const IconComponent = assessment.icon;
                    const isSelected = selectedAssessment === assessment.type;

                    return (
                      <Card
                        key={assessment.type}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          isSelected
                            ? `border-primary bg-primary/5 ${assessment.borderColor}`
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedAssessment(assessment.type)}
                        data-testid={`assessment-card-${assessment.type}`}
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${assessment.color} flex items-center justify-center`}
                              >
                                <IconComponent
                                  className="text-white"
                                  size={24}
                                />
                              </div>
                              <div>
                                <h3 className="font-bold text-foreground font-heading">
                                  {assessment.type}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {assessment.duration}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                {assessment.title}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {assessment.description}
                              </p>
                            </div>

                            {isSelected && (
                              <div className="pt-2 border-t border-border">
                                <div className="flex items-center space-x-2 text-sm text-primary">
                                  <CheckCircle size={16} />
                                  <span>Selected</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Assessment Preparation */}
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center font-heading">
                    <Brain className="mr-2" size={24} />
                    {assessmentTypes[
                      selectedAssessment as keyof typeof assessmentTypes
                    ]?.name || selectedAssessment}{" "}
                    Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Before You Begin
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm">
                            Find a quiet, private space
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm">
                            Answer honestly based on recent experiences
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-sm">
                            No right or wrong answers
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-blue-500" />
                          <span className="text-sm">
                            Estimated time:{" "}
                            {
                              assessmentCards.find(
                                (a) => a.type === selectedAssessment
                              )?.duration
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield size={16} className="text-green-500" />
                          <span className="text-sm">
                            Results are for guidance, not diagnosis
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Form */}
                  <AssessmentForm
                    assessmentType={selectedAssessment}
                    onComplete={handleAssessmentComplete}
                    isSubmitting={submitAssessmentMutation.isPending}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              {currentAssessmentData ? (
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Score Display */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center font-heading">
                        Your Assessment Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                      {/* Score Circle */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-40 h-40 rounded-full border-8 border-muted flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-foreground">
                                {currentAssessmentData.totalScore}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                out of{" "}
                                {assessmentTypes[
                                  currentAssessmentData.assessmentType as keyof typeof assessmentTypes
                                ]?.maxScore || 27}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`absolute -top-2 -right-2 w-16 h-16 rounded-full flex items-center justify-center ${
                              currentAssessmentData.interpretation === "minimal"
                                ? "bg-green-100"
                                : currentAssessmentData.interpretation ===
                                  "mild"
                                ? "bg-yellow-100"
                                : currentAssessmentData.interpretation ===
                                  "moderate"
                                ? "bg-orange-100"
                                : "bg-red-100"
                            }`}
                          >
                            <Badge
                              className={
                                currentAssessmentData.interpretation ===
                                "minimal"
                                  ? "bg-green-500"
                                  : currentAssessmentData.interpretation ===
                                    "mild"
                                  ? "bg-yellow-500"
                                  : currentAssessmentData.interpretation ===
                                    "moderate"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }
                            >
                              {currentAssessmentData.interpretation}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Interpretation */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          {
                            interpretAssessmentScore(
                              currentAssessmentData.assessmentType,
                              currentAssessmentData.totalScore
                            ).title
                          }
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                          {
                            interpretAssessmentScore(
                              currentAssessmentData.assessmentType,
                              currentAssessmentData.totalScore
                            ).description
                          }
                        </p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Completed on{" "}
                        {new Date(
                          currentAssessmentData.completedAt
                        ).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-heading">
                        Personalized Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentAssessmentData.recommendations.map(
                        (recommendation, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg"
                          >
                            <CheckCircle
                              className="text-green-500 mt-0.5"
                              size={20}
                            />
                            <p className="text-foreground">{recommendation}</p>
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      className="gradient-primary text-white"
                      asChild
                      data-testid="button-book-appointment"
                    >
                      <a href="/appointments">
                        <Calendar className="mr-2" size={18} />
                        Book Counseling Appointment
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      data-testid="button-explore-resources"
                    >
                      <a href="/resources">
                        <BookOpen className="mr-2" size={18} />
                        Explore Resources
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      data-testid="button-chat-ai"
                    >
                      <a href="/chatbot">
                        <MessageCircle className="mr-2" size={18} />
                        Chat with AI
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain
                    className="mx-auto text-muted-foreground mb-4"
                    size={64}
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Results Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Take an assessment to see your results and recommendations
                  </p>
                  <Button
                    onClick={() => setActiveTab("take")}
                    data-testid="button-take-first-assessment"
                  >
                    Take Your First Assessment
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">
                    Assessment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {historyLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-muted h-20 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : assessmentHistory && assessmentHistory.length > 0 ? (
                    <div className="space-y-6">
                      {/* Progress Chart */}
                      {progressData.length > 1 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            Progress Over Time - {selectedAssessment}
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                  type="monotone"
                                  dataKey="score"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={2}
                                  dot={{ fill: "hsl(var(--primary))" }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Assessment List */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          All Assessments
                        </h3>
                        {assessmentHistory.map((assessment: Assessment) => (
                          <Card key={assessment.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">
                                      {assessment.assessmentType}
                                    </Badge>
                                    <Badge
                                      className={
                                        assessment.interpretation === "minimal"
                                          ? "bg-green-500"
                                          : assessment.interpretation === "mild"
                                          ? "bg-yellow-500"
                                          : assessment.interpretation ===
                                            "moderate"
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                      }
                                    >
                                      {assessment.interpretation}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <BarChart3 size={14} />
                                      <span>
                                        Score: {assessment.totalScore}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock size={14} />
                                      <span>
                                        {new Date(
                                          assessment.completedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCurrentAssessment(assessment);
                                    setActiveTab("results");
                                  }}
                                  data-testid={`button-view-result-${assessment.id}`}
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3
                        className="mx-auto text-muted-foreground mb-4"
                        size={48}
                      />
                      <p className="text-muted-foreground">
                        No assessment history yet
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setActiveTab("take")}
                        data-testid="button-start-assessment-history"
                      >
                        Take Your First Assessment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
