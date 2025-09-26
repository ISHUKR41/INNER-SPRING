import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEYS = [
  "AIzaSyCW5CNu8FdJ0vSDmTYljypel5F3P7McM3s",
  "AIzaSyD3MSLQz7xGQFb7gMMv5Dcb4lYF7gQco50",
  "AIzaSyDaDdOV5HXg1kg68ZdRdf7htJOy-PhG-9E",
];

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private currentKeyIndex: number = 0;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEYS[0]);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log(
      "🤖 Gemini Service initialized with API key:",
      GEMINI_API_KEYS[0].substring(0, 20) + "..."
    );
  }

  private switchApiKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % GEMINI_API_KEYS.length;
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEYS[this.currentKeyIndex]);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log(
      "🔄 Switched to API key:",
      GEMINI_API_KEYS[this.currentKeyIndex].substring(0, 20) + "..."
    );
  }

  async generateResponse(message: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = GEMINI_API_KEYS.length;

    console.log("🔥 Starting Gemini API call...");
    console.log("📝 Message:", message);
    console.log(
      "🗝️ Using API key:",
      GEMINI_API_KEYS[this.currentKeyIndex].substring(0, 20) + "..."
    );

    while (attempts < maxAttempts) {
      try {
        console.log(
          `🤖 Sending message to Gemini (attempt ${attempts + 1}):`,
          message.substring(0, 50) + "..."
        );

        // Send message directly to Gemini - just like the real Gemini experience
        const result = await this.model.generateContent(message);
        console.log("📡 Raw result received:", result);

        const response = await result.response;
        console.log("📋 Response object:", response);

        const text = response.text();
        console.log("📝 Final text extracted:", text.substring(0, 100) + "...");

        console.log(
          "✅ Gemini response received:",
          text.substring(0, 100) + "..."
        );
        return text;
      } catch (error: any) {
        attempts++;
        console.error(`❌ Gemini API error (attempt ${attempts}):`, error);
        console.error("Full error object:", JSON.stringify(error, null, 2));

        if (attempts < maxAttempts) {
          console.log("🔄 Trying with next API key...");
          this.switchApiKey();
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }

    // If all API keys failed
    console.log("💥 All API keys failed, returning fallback message");
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.";
  }

  async generateStreamResponse(
    message: string
  ): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      console.log("🤖 Starting stream response for:", message);

      // Stream response directly from Gemini - no restrictions
      const result = await this.model.generateContentStream(message);

      const streamGenerator = async function* () {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          yield chunkText;
        }
      };

      return streamGenerator();
    } catch (error) {
      console.error("❌ Gemini stream error:", error);

      const errorGenerator = async function* () {
        yield "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      };

      return errorGenerator();
    }
  }
}

export const geminiService = new GeminiService();
