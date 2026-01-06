import { api } from './api';

export const geminiService = {
  async generateBio(prompt: string) {
    const fullPrompt = `Generate a professional, high-energy electronic music DJ bio for DJ Black Beauty based on these details: ${prompt}. Style: Sophisticated yet edgy.`;
    return await api.generateBio(fullPrompt);
  },

  async chatWithManager(message: string) {
    return await api.chat(message);
  }
};
