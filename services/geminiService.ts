
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FormFieldSuggestion } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Standard initialization using process.env.API_KEY as per GenAI guidelines
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.ai = new GoogleGenAI({ apiKey });
  }

  async suggestFormResponses(
    profile: UserProfile,
    formDescription: string
  ): Promise<FormFieldSuggestion[]> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `
        Profile context:
        - Name: ${profile.fullName}
        - Email: ${profile.email}
        - Experience: ${profile.experience}
        - Bio: ${profile.bio}
        - Desired Writing Style: ${profile.writingStyle}

        Form Details provided by user:
        "${formDescription}"

        Please generate human-like responses for the likely fields in this form.
        Ensure the writing feels natural, personal, and aligns perfectly with the user's profile and style.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "The form field name or question." },
              suggestedValue: { type: Type.STRING, description: "The human-like written answer." },
              reasoning: { type: Type.STRING, description: "Why this answer was chosen." }
            },
            required: ["label", "suggestedValue", "reasoning"]
          }
        }
      }
    });

    try {
      // Direct access to text property from GenerateContentResponse
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
