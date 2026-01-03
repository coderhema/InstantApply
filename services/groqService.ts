
import { UserProfile, FormFieldSuggestion } from "../types";

export class GroqService {
    private apiKey: string;
    private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

    constructor() {
        this.apiKey = import.meta.env.VITE_GROQ_API_KEY ||
            (window as any).process?.env?.VITE_GROQ_API_KEY ||
            '';
    }

    async suggestFormResponses(
        profile: UserProfile,
        formDescription: string
    ): Promise<FormFieldSuggestion[]> {
        if (!this.apiKey) {
            console.error("Groq API key is missing");
            return [];
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: `You are a helpful AI assistant that generates form responses based on a user's profile.
              Output ONLY a valid JSON array of objects.
              Each object must have the following properties:
              - fieldName: The 'name' attribute of the field.
              - label: The human-readable label.
              - suggestedValue: The value to fill in.
              - reasoning: A short explanation.
              
              Do not include any markdown formatting (like \`\`\`json) in your response. Just the raw JSON array.`
                        },
                        {
                            role: "user",
                            content: `
                Profile context:
                - Name: ${profile.fullName}
                - Email: ${profile.email}
                - Experience: ${profile.experience}
                - Bio: ${profile.bio}
                - Desired Writing Style: ${profile.writingStyle}

                Form Fields Schema (Extracted via Parse.bot):
                "${formDescription}"

                Generate human-like responses for these fields. Map answers accurately to 'fieldName' or 'label'.
              `
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Groq API error:", errorData);
                throw new Error(`Groq API failed with status ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || "[]";

            // Clean up potential markdown formatting if the model disregards instructions
            const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(cleanContent);
        } catch (e) {
            console.error("Groq suggestion failed:", e);
            return [];
        }
    }
}

export const groqService = new GroqService();
