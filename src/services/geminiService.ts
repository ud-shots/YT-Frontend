import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SeoMetadata } from "../../types";

// NOTE: In a real production app, this API key should be handled securely on the backend.
// For this frontend-only demo, we expect it in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const seoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "SEO optimized title, maximum 60 characters.",
    },
    description: {
      type: Type.STRING,
      description: "SEO optimized description, between 100 and 150 words.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of relevant tags.",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of focus keywords.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of relevant hashtags including #.",
    },
  },
  required: ["title", "description", "tags", "keywords", "hashtags"],
};

export const generateVideoSEO = async (context: string): Promise<SeoMetadata> => {
  try {
    const prompt = `
      You are a YouTube SEO Expert. 
      Analyze the following video context/topic and generate high-performing metadata.
      
      Video Context: "${context}"
      
      Requirements:
      1. Title must be click-worthy but honest, under 60 chars.
      2. Description must be engaging, 100-150 words.
      3. Tags should cover broad and specific topics.
      4. Keywords should be high-volume search terms.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: seoSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as SeoMetadata;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails or key is missing
    return {
      title: "Error Generating Title",
      description: "Could not generate description. Please check API Key.",
      tags: ["error"],
      keywords: ["error"],
      hashtags: ["#error"],
    };
  }
};