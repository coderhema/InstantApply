
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FormFieldSuggestion } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Check both VITE prefixed and process.env defined variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
      (window as any).process?.env?.GEMINI_API_KEY ||
      '';
    // Explicitly set apiVersion to 'v1beta' to ensure structured output (JSON schema) support
    this.ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
  }

  async suggestFormResponses(
    profile: UserProfile,
    formDescription: string
  ): Promise<FormFieldSuggestion[]> {
    try {
      const result = await this.ai.models.generateContent({
        model: "gemini-2.0-flash-lite-001", // Using the specific preview version for 2.0 Flash Lite
        contents: [{
          role: 'user', parts: [{
            text: `
          Profile context:
          - Name: ${profile.fullName}
          - Email: ${profile.email}
          - Experience: ${profile.experience}
          - Bio: ${profile.bio}
          - Desired Writing Style: ${profile.writingStyle}

          Form Fields Schema (Extracted via Parse.bot):
          "${formDescription}"

          Please generate human-like responses for these specific fields.
          Ensure the writing feels natural, personal, and aligns perfectly with the user's profile and style.
          IMPORTANT: Your high-level output should be an array of suggestions for the UI, but ensure you are accurately mapping your answers to the field 'name' or 'label' provided.
        `}]
        }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fieldName: { type: Type.STRING, description: "The actual 'name' attribute of the field (used for automation)." },
                label: { type: Type.STRING, description: "The human-readable label or question." },
                suggestedValue: { type: Type.STRING, description: "The human-like written answer." },
                reasoning: { type: Type.STRING, description: "Why this answer was chosen." }
              },
              required: ["fieldName", "label", "suggestedValue", "reasoning"]
            }
          }
        }
      });

      // More robust text extraction for the new @google/genai SDK
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text ||
        (result as any).text ||
        "[]";

      return JSON.parse(text);
    } catch (e: any) {
      console.error("Gemini suggestion failed:", e);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
