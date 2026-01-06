
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createBookingDeclaration: FunctionDeclaration = {
  name: 'create_booking',
  parameters: {
    type: Type.OBJECT,
    description: 'Set up a new performance booking for DJ Black Beauty.',
    properties: {
      venue: {
        type: Type.STRING,
        description: 'The name of the venue or festival.',
      },
      city: {
        type: Type.STRING,
        description: 'The city where the event is located.',
      },
      date: {
        type: Type.STRING,
        description: 'The date of the event in YYYY-MM-DD format.',
      },
      startTime: {
        type: Type.STRING,
        description: 'Start time of the set (e.g., 22:00).',
      },
      endTime: {
        type: Type.STRING,
        description: 'End time of the set (e.g., 00:00).',
      },
      fee: {
        type: Type.NUMBER,
        description: 'The performance fee amount.',
      },
      currency: {
        type: Type.STRING,
        description: 'The currency code (e.g., LKR, USD, EUR, GBP).',
      },
      notes: {
        type: Type.STRING,
        description: 'Any special requirements, technical notes, or rider details.',
      },
    },
    required: ['venue', 'city', 'date', 'fee', 'currency'],
  },
};

export const geminiService = {
  async generateBio(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, high-energy electronic music DJ bio for DJ Black Beauty based on these details: ${prompt}. Style: Sophisticated yet edgy.`,
    });
    return response.text;
  },

  async chatWithManager(message: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are the Digital Chief of Staff and Booking Agent for DJ Black Beauty. 
        Your primary goal is to assist the manager in organizing tours, handling logistics, and managing bookings.
        Default to Sri Lankan Rupee (LKR) for local bookings unless specified otherwise.
        You have the authority to create new bookings. If a user provides venue, city, date, fee, and timing information, use the 'create_booking' tool.
        Always ask for clarification if critical details like fee or date are missing.
        Be professional, efficient, and deeply knowledgeable about the global and Sri Lankan electronic music scene.`,
        tools: [{ functionDeclarations: [createBookingDeclaration] }],
      },
    });
    return response;
  }
};
