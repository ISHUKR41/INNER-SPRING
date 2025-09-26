import ProfessionalNavbar from "@/components/layout/ProfessionalNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  BookOpen,
  Users,
  Brain,
  Heart,
  ArrowRight,
} from "lucide-react";

/**
 * Student Dashboard - Personalized overview of mental health progress
 * Features assessment tracking, appointments, resources, and peer support activity
 */
export default function Dashboard() {
  // Mock dashboard stats
  const dashboardStats = {
    totalAssessments: 12,
    currentStreak: 7,
    resourcesViewed: 24,
    forumPosts: 3,
  };

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalNavbar />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Your Wellness Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your mental health journey and celebrate your progress
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Assessments
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {dashboardStats.totalAssessments}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="text-blue-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Check-in Streak
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {dashboardStats.currentStreak}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="text-green-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Resources Used
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {dashboardStats.resourcesViewed}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Community Posts
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {dashboardStats.forumPosts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="text-orange-600" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-between"
                variant="outline"
                asChild
                data-testid="button-new-assessment"
              >
                <a href="/assessment">
                  Take Assessment
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button
                className="w-full justify-between"
                variant="outline"
                asChild
                data-testid="button-ai-chat"
              >
                <a href="/chatbot">
                  Chat with AI
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button
                className="w-full justify-between"
                variant="outline"
                asChild
                data-testid="button-browse-resources"
              >
                <a href="/resources">
                  Browse Resources
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button
                className="w-full justify-between"
                variant="outline"
                asChild
                data-testid="button-join-community"
              >
                <a href="/peer-support">
                  Join Community
                  <ArrowRight size={16} />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
