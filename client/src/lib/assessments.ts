// Assessment questionnaire definitions and scoring logic

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  value: number;
  text: string;
}

export interface AssessmentType {
  name: string;
  description: string;
  questions: AssessmentQuestion[];
  maxScore: number;
  interpretations: {
    minimal: { min: number; max: number; title: string; description: string; };
    mild: { min: number; max: number; title: string; description: string; };
    moderate: { min: number; max: number; title: string; description: string; };
    severe: { min: number; max: number; title: string; description: string; };
  };
}

// PHQ-9 Depression Screening
const phq9Questions: AssessmentQuestion[] = [
  {
    id: "phq9_1",
    question: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_2",
    question: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_3",
    question: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_4",
    question: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_5",
    question: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_6",
    question: "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure or have let yourself or your family down?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_7",
    question: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_8",
    question: "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite being so fidgety or restless that you have been moving around a lot more than usual?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "phq9_9",
    question: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  }
];

// GAD-7 Anxiety Assessment
const gad7Questions: AssessmentQuestion[] = [
  {
    id: "gad7_1",
    question: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "gad7_2",
    question: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "gad7_3",
    question: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "gad7_4",
    question: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "gad7_5",
    question: "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "gad7_6",
    question: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  },
  {
    id: "gad7_7",
    question: "Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" }
    ]
  }
];

// GHQ-12 General Health Questionnaire
const ghq12Questions: AssessmentQuestion[] = [
  {
    id: "ghq12_1",
    question: "Have you recently been able to concentrate on whatever you're doing?",
    options: [
      { value: 0, text: "Better than usual" },
      { value: 0, text: "Same as usual" },
      { value: 1, text: "Less than usual" },
      { value: 1, text: "Much less than usual" }
    ]
  },
  {
    id: "ghq12_2",
    question: "Have you recently lost much sleep over worry?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 0, text: "No more than usual" },
      { value: 1, text: "Rather more than usual" },
      { value: 1, text: "Much more than usual" }
    ]
  },
  {
    id: "ghq12_3",
    question: "Have you recently felt that you were playing a useful part in things?",
    options: [
      { value: 0, text: "More so than usual" },
      { value: 0, text: "Same as usual" },
      { value: 1, text: "Less so than usual" },
      { value: 1, text: "Much less than usual" }
    ]
  },
  {
    id: "ghq12_4",
    question: "Have you recently felt capable of making decisions about things?",
    options: [
      { value: 0, text: "More so than usual" },
      { value: 0, text: "Same as usual" },
      { value: 1, text: "Less so than usual" },
      { value: 1, text: "Much less capable" }
    ]
  },
  {
    id: "ghq12_5",
    question: "Have you recently felt constantly under strain?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 0, text: "No more than usual" },
      { value: 1, text: "Rather more than usual" },
      { value: 1, text: "Much more than usual" }
    ]
  },
  {
    id: "ghq12_6",
    question: "Have you recently felt you couldn't overcome your difficulties?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 0, text: "No more than usual" },
      { value: 1, text: "Rather more than usual" },
      { value: 1, text: "Much more than usual" }
    ]
  },
  {
    id: "ghq12_7",
    question: "Have you recently been able to enjoy your normal day-to-day activities?",
    options: [
      { value: 0, text: "More so than usual" },
      { value: 0, text: "Same as usual" },
      { value: 1, text: "Less so than usual" },
      { value: 1, text: "Much less than usual" }
    ]
  },
  {
    id: "ghq12_8",
    question: "Have you recently been able to face up to your problems?",
    options: [
      { value: 0, text: "More so than usual" },
      { value: 0, text: "Same as usual" },
      { value: 1, text: "Less able than usual" },
      { value: 1, text: "Much less able" }
    ]
  },
  {
    id: "ghq12_9",
    question: "Have you recently been feeling unhappy or depressed?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 0, text: "No more than usual" },
      { value: 1, text: "Rather more than usual" },
      { value: 1, text: "Much more than usual" }
    ]
  },
  {
    id: "ghq12_10",
    question: "Have you recently been losing confidence in yourself?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 0, text: "No more than usual" },
      { value: 1, text: "Rather more than usual" },
      { value: 1, text: "Much more than usual" }
    ]
  },
  {
    id: "ghq12_11",
    question: "Have you recently been thinking of yourself as a worthless person?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 0, text: "No more than usual" },
      { value: 1, text: "Rather more than usual" },
      { value: 1, text: "Much more than usual" }
    ]
  },
  {
    id: "ghq12_12",
    question: "Have you recently been feeling reasonably happy, all things considered?",
    options: [
      { value: 0, text: "More so than usual" },
      { value: 0, text: "About the same as usual" },
      { value: 1, text: "Less so than usual" },
      { value: 1, text: "Much less than usual" }
    ]
  }
];

// PSS-10 Perceived Stress Scale
const pss10Questions: AssessmentQuestion[] = [
  {
    id: "pss10_1",
    question: "In the last month, how often have you been upset because of something that happened unexpectedly?",
    options: [
      { value: 0, text: "Never" },
      { value: 1, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Fairly often" },
      { value: 4, text: "Very often" }
    ]
  },
  {
    id: "pss10_2",
    question: "In the last month, how often have you felt that you were unable to control the important things in your life?",
    options: [
      { value: 0, text: "Never" },
      { value: 1, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Fairly often" },
      { value: 4, text: "Very often" }
    ]
  },
  {
    id: "pss10_3",
    question: "In the last month, how often have you felt nervous and stressed?",
    options: [
      { value: 0, text: "Never" },
      { value: 1, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Fairly often" },
      { value: 4, text: "Very often" }
    ]
  },
  {
    id: "pss10_4",
    question: "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    options: [
      { value: 4, text: "Never" },
      { value: 3, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 1, text: "Fairly often" },
      { value: 0, text: "Very often" }
    ]
  },
  {
    id: "pss10_5",
    question: "In the last month, how often have you felt that things were going your way?",
    options: [
      { value: 4, text: "Never" },
      { value: 3, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 1, text: "Fairly often" },
      { value: 0, text: "Very often" }
    ]
  },
  {
    id: "pss10_6",
    question: "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    options: [
      { value: 0, text: "Never" },
      { value: 1, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Fairly often" },
      { value: 4, text: "Very often" }
    ]
  },
  {
    id: "pss10_7",
    question: "In the last month, how often have you been able to control irritations in your life?",
    options: [
      { value: 4, text: "Never" },
      { value: 3, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 1, text: "Fairly often" },
      { value: 0, text: "Very often" }
    ]
  },
  {
    id: "pss10_8",
    question: "In the last month, how often have you felt that you were on top of things?",
    options: [
      { value: 4, text: "Never" },
      { value: 3, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 1, text: "Fairly often" },
      { value: 0, text: "Very often" }
    ]
  },
  {
    id: "pss10_9",
    question: "In the last month, how often have you been angered because of things that were outside of your control?",
    options: [
      { value: 0, text: "Never" },
      { value: 1, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Fairly often" },
      { value: 4, text: "Very often" }
    ]
  },
  {
    id: "pss10_10",
    question: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
    options: [
      { value: 0, text: "Never" },
      { value: 1, text: "Almost never" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Fairly often" },
      { value: 4, text: "Very often" }
    ]
  }
];

export const assessmentTypes: Record<string, AssessmentType> = {
  "PHQ-9": {
    name: "PHQ-9 Depression Screen",
    description: "Patient Health Questionnaire-9 for depression screening",
    questions: phq9Questions,
    maxScore: 27,
    interpretations: {
      minimal: { 
        min: 0, max: 4, 
        title: "Minimal Depression", 
        description: "Your responses suggest minimal depressive symptoms. Continue to monitor your mental health and maintain healthy coping strategies." 
      },
      mild: { 
        min: 5, max: 9, 
        title: "Mild Depression", 
        description: "Your responses indicate mild depressive symptoms. Consider speaking with a counselor and implementing stress management techniques." 
      },
      moderate: { 
        min: 10, max: 14, 
        title: "Moderate Depression", 
        description: "Your responses suggest moderate depressive symptoms that may be impacting your daily life. Professional support is recommended." 
      },
      severe: { 
        min: 15, max: 27, 
        title: "Severe Depression", 
        description: "Your responses indicate severe depressive symptoms. Please consider seeking immediate professional help and support." 
      }
    }
  },
  "GAD-7": {
    name: "GAD-7 Anxiety Assessment",
    description: "Generalized Anxiety Disorder 7-item scale",
    questions: gad7Questions,
    maxScore: 21,
    interpretations: {
      minimal: { 
        min: 0, max: 4, 
        title: "Minimal Anxiety", 
        description: "Your responses suggest minimal anxiety symptoms. Continue practicing stress management and self-care." 
      },
      mild: { 
        min: 5, max: 9, 
        title: "Mild Anxiety", 
        description: "Your responses indicate mild anxiety symptoms. Consider relaxation techniques and speaking with a counselor if symptoms persist." 
      },
      moderate: { 
        min: 10, max: 14, 
        title: "Moderate Anxiety", 
        description: "Your responses suggest moderate anxiety that may be affecting your daily activities. Professional guidance is recommended." 
      },
      severe: { 
        min: 15, max: 21, 
        title: "Severe Anxiety", 
        description: "Your responses indicate severe anxiety symptoms. Please consider seeking professional help immediately." 
      }
    }
  },
  "GHQ-12": {
    name: "GHQ-12 General Health",
    description: "General Health Questionnaire 12-item version",
    questions: ghq12Questions,
    maxScore: 12,
    interpretations: {
      minimal: { 
        min: 0, max: 2, 
        title: "Good Mental Health", 
        description: "Your responses suggest good overall mental health. Continue maintaining your current wellbeing practices." 
      },
      mild: { 
        min: 3, max: 4, 
        title: "Mild Distress", 
        description: "Your responses indicate some psychological distress. Consider implementing stress management strategies." 
      },
      moderate: { 
        min: 5, max: 7, 
        title: "Moderate Distress", 
        description: "Your responses suggest moderate psychological distress that may benefit from professional support." 
      },
      severe: { 
        min: 8, max: 12, 
        title: "Severe Distress", 
        description: "Your responses indicate significant psychological distress. Professional help is strongly recommended." 
      }
    }
  },
  "PSS-10": {
    name: "PSS-10 Stress Scale",
    description: "Perceived Stress Scale 10-item version",
    questions: pss10Questions,
    maxScore: 40,
    interpretations: {
      minimal: { 
        min: 0, max: 13, 
        title: "Low Stress", 
        description: "Your responses suggest low levels of perceived stress. You appear to be managing stress effectively." 
      },
      mild: { 
        min: 14, max: 26, 
        title: "Moderate Stress", 
        description: "Your responses indicate moderate stress levels. Consider stress reduction techniques and maintaining work-life balance." 
      },
      moderate: { 
        min: 27, max: 33, 
        title: "High Stress", 
        description: "Your responses suggest high stress levels that may be impacting your wellbeing. Professional support may be beneficial." 
      },
      severe: { 
        min: 34, max: 40, 
        title: "Very High Stress", 
        description: "Your responses indicate very high stress levels. Please consider seeking professional help to develop effective coping strategies." 
      }
    }
  }
};

export function calculateAssessmentScore(assessmentType: string, responses: any[]): number {
  return responses.reduce((total, response) => total + (response.value || 0), 0);
}

export function interpretAssessmentScore(assessmentType: string, score: number) {
  const assessment = assessmentTypes[assessmentType];
  if (!assessment) {
    return { title: "Unknown Assessment", description: "Assessment type not found." };
  }

  const { interpretations } = assessment;
  
  if (score >= interpretations.severe.min) return interpretations.severe;
  if (score >= interpretations.moderate.min) return interpretations.moderate;
  if (score >= interpretations.mild.min) return interpretations.mild;
  return interpretations.minimal;
}
