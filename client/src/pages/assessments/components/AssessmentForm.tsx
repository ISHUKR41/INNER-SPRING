import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, CheckCircle, Info } from "lucide-react";
import { assessmentTypes, calculateAssessmentScore } from "@/lib/assessments";
import { cn } from "@/lib/utils";

interface AssessmentFormProps {
  assessmentType: string;
  onComplete: (responses: any[], totalScore: number) => void;
  isSubmitting: boolean;
}

/**
 * Assessment Form Component - Step-by-step questionnaire interface
 * Features progress tracking, validation, and crisis detection
 */
export default function AssessmentForm({
  assessmentType,
  onComplete,
  isSubmitting
}: AssessmentFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const assessment = assessmentTypes[assessmentType];
  
  if (!assessment) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Assessment type not found: {assessmentType}</AlertDescription>
      </Alert>
    );
  }

  const { questions } = assessment;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = responses[currentQuestion.id] !== undefined;

  // Check for crisis indicators (PHQ-9 question 9 about self-harm thoughts)
  const checkForCrisisIndicators = (questionId: string, value: number) => {
    if (assessmentType === "PHQ-9" && questionId === "phq9_9" && value >= 1) {
      setShowCrisisAlert(true);
    }
  };

  const handleAnswerSelect = (value: string) => {
    const numericValue = parseInt(value);
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        value: numericValue,
        text: currentQuestion.options.find(opt => opt.value === numericValue)?.text || ""
      }
    }));

    checkForCrisisIndicators(currentQuestion.id, numericValue);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Complete assessment
      const responseArray = Object.values(responses);
      const totalScore = calculateAssessmentScore(assessmentType, responseArray);
      onComplete(responseArray, totalScore);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const selectedValue = responses[currentQuestion.id]?.value?.toString() || "";

  return (
    <div className="space-y-6">
      {/* Crisis Alert */}
      {showCrisisAlert && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">We noticed you may be experiencing thoughts of self-harm.</p>
            <p className="text-sm">Your safety is our priority. Please consider reaching out for immediate support:</p>
            <div className="flex space-x-2 mt-2">
              <Button size="sm" variant="destructive" asChild data-testid="button-crisis-help-inline">
                <a href="/emergency">Get Emergency Help</a>
              </Button>
              <Button size="sm" variant="outline" asChild data-testid="button-call-hotline">
                <a href="tel:988">Call 988 (Crisis Hotline)</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" data-testid="assessment-progress" />
      </div>

      {/* Question Card */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground leading-relaxed">
                {currentQuestion.question}
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the option that best describes your experience
              </p>
            </div>

            {/* Answer Options */}
            <RadioGroup 
              value={selectedValue} 
              onValueChange={handleAnswerSelect}
              className="space-y-3"
              data-testid={`question-${currentQuestionIndex + 1}-options`}
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-muted/50",
                    selectedValue === option.value.toString()
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}
                  onClick={() => handleAnswerSelect(option.value.toString())}
                >
                  <RadioGroupItem 
                    value={option.value.toString()} 
                    id={`option-${option.value}`}
                    className="mt-0.5"
                  />
                  <Label 
                    htmlFor={`option-${option.value}`}
                    className="text-foreground cursor-pointer leading-relaxed flex-1"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                data-testid="button-previous-question"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className="gradient-primary text-white"
                data-testid="button-next-question"
              >
                {isSubmitting ? (
                  "Analyzing..."
                ) : isLastQuestion ? (
                  <>
                    Complete Assessment
                    <CheckCircle size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {questions.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-200",
              index === currentQuestionIndex
                ? "bg-primary"
                : index < currentQuestionIndex
                ? "bg-green-500"
                : responses[questions[index].id]
                ? "bg-blue-300"
                : "bg-muted"
            )}
            onClick={() => setCurrentQuestionIndex(index)}
            data-testid={`question-dot-${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
