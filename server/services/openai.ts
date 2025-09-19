import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

interface ChatResponse {
  message: string;
  suggestions?: string[];
  resources?: string[];
  escalation?: boolean;
}

export async function generateChatResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[]
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are MindCare AI, a compassionate mental health support assistant for college students. 

Your role:
- Provide empathetic, non-judgmental support
- Offer evidence-based coping strategies and techniques
- Suggest relevant resources when appropriate
- Recognize crisis situations and escalate when necessary
- Use warm, understanding language appropriate for students

Guidelines:
- Never provide medical diagnoses or replace professional therapy
- Always maintain confidentiality and privacy
- If someone mentions self-harm, suicide, or crisis, immediately suggest professional help
- Focus on practical coping strategies students can use immediately
- Be culturally sensitive and inclusive
- Keep responses concise but thorough (150-300 words)

Respond with JSON in this format:
{
  "message": "Your empathetic response with coping strategies",
  "suggestions": ["Follow-up question or action", "Another suggestion"],
  "resources": ["Relevant resource type", "Another resource type"],
  "escalation": false
}

Set "escalation" to true if the user mentions:
- Self-harm or suicide ideation
- Abuse or trauma requiring immediate attention
- Substance abuse crisis
- Severe mental health crisis requiring immediate intervention`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: messages as any,
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "I'm here to support you. Could you tell me more about what you're experiencing?",
      suggestions: result.suggestions || [],
      resources: result.resources || [],
      escalation: result.escalation || false
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm experiencing some technical difficulties right now, but I want you to know that I'm here for you. If you're in crisis, please reach out to a counselor or emergency service immediately.",
      suggestions: ["Book an appointment with a counselor", "Visit our emergency resources"],
      escalation: true
    };
  }
}

export async function generateConversationTitle(messages: string[]): Promise<string> {
  try {
    const lastFewMessages = messages.slice(-3).join(" ");
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Create a brief, 2-4 word title for this mental health conversation. Focus on the main topic or concern. Respond with JSON: {\"title\": \"your title\"}"
        },
        {
          role: "user",
          content: lastFewMessages
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 50,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.title || "Support Chat";
  } catch (error) {
    console.error("Title generation error:", error);
    return "Support Chat";
  }
}

export async function analyzeAssessmentResults(
  assessmentType: string,
  responses: any[],
  totalScore: number
): Promise<{ interpretation: string; recommendations: string[] }> {
  try {
    const prompt = `Analyze these ${assessmentType} assessment results for a college student:
    
Total Score: ${totalScore}
Responses: ${JSON.stringify(responses)}

Provide interpretation and personalized recommendations for a student based on their results. Be encouraging and practical.

Respond with JSON:
{
  "interpretation": "Brief interpretation of the score level",
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      interpretation: result.interpretation || "moderate",
      recommendations: result.recommendations || ["Consider speaking with a counselor", "Practice stress management techniques", "Monitor your symptoms regularly"]
    };
  } catch (error) {
    console.error("Assessment analysis error:", error);
    return {
      interpretation: "moderate",
      recommendations: ["Consider speaking with a counselor", "Practice stress management techniques", "Monitor your symptoms regularly"]
    };
  }
}
