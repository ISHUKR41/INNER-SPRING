import ProfessionalNavbar from "@/components/layout/ProfessionalNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, AlertTriangle, Shield } from "lucide-react";

/**
 * Emergency Help Page - Crisis support and emergency resources
 * Features immediate contact options, crisis hotlines, and emergency support
 */
export default function Emergency() {
  // Crisis hotlines data
  const crisisHotlines = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7, free and confidential support for people in distress",
      available: "24/7",
    },
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to 741741 for free crisis counseling",
      available: "24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalNavbar />

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Emergency Alert Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Emergency Mental Health Support
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              If you're experiencing a mental health emergency, you're not
              alone. Help is available 24/7.
            </p>

            <Alert variant="destructive" className="max-w-4xl mx-auto mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-left">
                <span className="font-medium">
                  If you are in immediate danger:
                </span>
                <br />
                • Call 911 (Emergency Services)
                <br />
                • Go to your nearest emergency room
                <br />
                • Call 988 (Suicide & Crisis Lifeline)
                <br />• Don't leave yourself alone - reach out to someone you
                trust
              </AlertDescription>
            </Alert>
          </div>

          {/* Crisis Hotlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Phone className="mr-2" size={24} />
                Crisis Hotlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {crisisHotlines.map((hotline, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {hotline.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hotline.description}
                      </p>
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
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Available: {hotline.available}</span>
                      </div>
                    </div>

                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => window.open(`tel:${hotline.number}`)}
                      data-testid={`button-call-${index}`}
                    >
                      <Phone size={16} className="mr-1" />
                      Call Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Shield className="mr-2" size={24} />
                Your Privacy & Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    Confidential:
                  </span>{" "}
                  All crisis calls and texts are confidential and anonymous.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    No judgment:
                  </span>{" "}
                  Crisis counselors are trained to listen without judgment.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Your choice:
                  </span>{" "}
                  You decide what to share and what steps to take.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
