
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI using the environment variable API_KEY directly as required.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (days: number, interests: string[]) => {
  const ai = getAI();
  const prompt = `Create a detailed ${days}-day trip itinerary for Modena, Italy. 
  Focus on: ${interests.join(', ')}. 
  Include specific times, restaurant suggestions (like Osteria Francescana or local trattorias), and historical context.
  Output the result in a structured JSON format.`;

  // Use gemini-3-pro-preview for tasks requiring structured output and detailed reasoning.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                title: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING }
                    },
                    required: ["time", "description", "location"]
                  }
                }
              },
              required: ["day", "title", "activities"]
            }
          }
        },
        required: ["days"]
      }
    }
  });

  // Access the generated text content via the .text property.
  return JSON.parse(response.text);
};

export const generateExperienceImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality, professional travel photography of ${prompt} in Modena, Italy. Cinematic lighting, authentic atmosphere.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    // Iterate through candidates and parts to find the image part specifically.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const searchModenaInfo = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    // Extract grounding chunks to provide source links for search results.
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
