import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseClient.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  response: string;
  language: string;
  timestamp: any;
  metadata?: {
    processingTime?: number;
    model?: string;
    tokens?: number;
  };
}

// Enhanced Jharkhand-specific travel prompt
const getJharkhandTravelPrompt = (message: string, language: string) => {
  const basePrompt = `
You are JourneySmith AI, a specialized travel assistant for Jharkhand, India.

CONTEXT:
- Jharkhand is known for: Tribal culture, waterfalls (Hundru, Dassam, Jonha), wildlife sanctuaries, hill stations (Netarhat, Deoghar), mining heritage
- Major cities: Ranchi (capital), Jamshedpur, Dhanbad, Bokaro, Hazaribagh
- Famous attractions: Jagannath Temple (Deoghar), Patratu Valley, Betla National Park, Parasnath Hills
- Best time to visit: October to March (winter season)
- Languages: Hindi, Bengali, Santali, and other tribal languages
- Culture: Rich tribal heritage, handloom, handicrafts, folk music and dance

INSTRUCTIONS:
1. Provide helpful, accurate, and engaging travel information about Jharkhand
2. Include practical details: distances, timings, costs (in INR), best seasons
3. Suggest authentic local experiences and hidden gems
4. Mention cultural etiquette and tribal sensitivity when relevant
5. Format response in clear, readable Markdown
6. Respond in ${language} language
7. Be enthusiastic and informative
8. If asked about other places, gently redirect to Jharkhand while being helpful

USER QUESTION: "${message}"

Provide a concise, helpful response about Jharkhand tourism.
`;

  return basePrompt;
};

export class GeminiChatService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  }

  async generateResponse(message: string, language: string, userId: string): Promise<string> {
    try {
      const startTime = Date.now();
      const prompt = getJharkhandTravelPrompt(message, language);
      
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const processingTime = Date.now() - startTime;

      // Store chat in Firebase for analytics and user history
      await this.storeChatMessage({
        userId,
        message,
        response,
        language,
        timestamp: serverTimestamp(),
        metadata: {
          processingTime,
          model: "gemini-1.5-flash",
          tokens: response.length
        }
      });

      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback response in user's language
      const fallbackResponses = {
        English: "I'm having trouble connecting right now. Please try asking about Jharkhand's beautiful waterfalls, tribal culture, or hill stations!",
        Hindi: "मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया झारखंड के सुंदर झरने, आदिवासी संस्कृति या पहाड़ी स्टेशनों के बारे में पूछें!",
        Bengali: "আমার এখন সংযোগে সমস্যা হচ্ছে। দয়া করে ঝাড়খণ্ডের সুন্দর জলপ্রপাত, আদিবাসী সংস্কৃতি বা পাহাড়ি স্টেশন সম্পর্কে জিজ্ঞাসা করুন!"
      };

      return fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.English;
    }
  }

  private async storeChatMessage(chatData: Omit<ChatMessage, 'id'>): Promise<void> {
    try {
      const chatsRef = collection(db, 'chats');
      await addDoc(chatsRef, chatData);
    } catch (error) {
      console.error('Error storing chat message:', error);
      // Non-blocking error - chat still works without storage
    }
  }

  async getChatHistory(userId: string, limitCount: number = 10): Promise<ChatMessage[]> {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage))
        .filter(chat => chat.userId === userId)
        .reverse(); // Show oldest first for chat display
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  // Helper method to clean markdown for TTS
  stripMarkdown(text: string): string {
    return text
      .replace(/([*_`~\[\]()>#+\-=|])/g, "") // remove markdown special chars
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // remove images
      .replace(/\[[^\]]*\]\([^)]*\)/g, "") // remove links
      .replace(/\n+/g, " ") // replace newlines with space
      .replace(/\s+/g, " ") // collapse whitespace
      .trim();
  }
}

export const geminiService = new GeminiChatService();
