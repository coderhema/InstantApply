
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
              The input 'Form Fields Schema' will be a list of field objects, each containing metadata like Label, Placeholder, Name, ID, and Type.
              
              Output ONLY a valid JSON array of objects.
              Each object must have the following properties:
              - fieldName: The 'Name' or 'ID' of the field (whichever is available).
              - label: The 'Label' or 'Placeholder'.
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
                
                --- CUSTOM KNOWLEDGE (High Priority) ---
                ${profile.customFields ? profile.customFields.map(f => `- ${f.label}: ${f.value}`).join('\n                ') : '(No custom fields provided)'}
                ----------------------------------------

                Form Fields Schema (Detailed Metadata):
                "${formDescription}"

                Generate human-like responses for these fields. 
                
                DECISION LOGIC:
                1. CHECK CUSTOM KNOWLEDGE FIRST: If a field asks for data that exists in 'CUSTOM KNOWLEDGE' (e.g. "Portfolio", "LinkedIn", "Salary", "Yrs Experience"), USE THAT EXACT VALUE.
                2. Check Standard Profile (Name, Email, Bio).
                3. Infer from Context (for generic questions).

                Use the Metadata provided (Label, Placeholder, Name) to infer the field's purpose. Prioritize 'Label', then 'Placeholder', then 'Name'.

                CRITICAL INSTRUCTION FOR OPTIONS:
                For fields requiring a selection (radio, checkbox, dropdown), you must select from the provided 'Options' list if available.
                - EXACT MATCH: Look for an option that matches the user's data textually.
                - NUMERICAL/RANGE MAPPING: If the options are ranges (e.g. "0-1 years", "1-3 years") and the user has a number (e.g. "2 years"), select the range that mathematically contains the value.
                - PARTIAL MATCH: If no exact match, select the option that is semantically closest.
                
                ALWAYS return the EXCEPT value strings from the options list.
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
