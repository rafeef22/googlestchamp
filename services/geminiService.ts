
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  // In a real app, you would have a more robust way to handle this,
  // but for this example, we'll just log an error.
  // The environment variable is expected to be set in the execution environment.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateDescription = async (brand: string, name: string): Promise<string> => {
  if (!process.env.API_KEY) {
     return "API Key not configured. Please contact support.";
  }

  const prompt = `Generate a compelling and luxurious-sounding product description for a pair of ${brand} ${name} shoes. Highlight its craftsmanship, style, and exclusivity. Keep it under 150 words. Focus on evocative language suitable for a high-end resale market.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Failed to generate description. Please write one manually.";
  }
};
