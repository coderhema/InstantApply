
import { GoogleGenAI, Type } from "@google/genai";

export async function generateDraft(jobDescription: string, userResume: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Job Description: ${jobDescription}
      User's Experience: ${userResume}
      
      Task: Create a highly tailored 1-paragraph cover letter snippet and 3 optimized bullet points for a resume that specifically match the job requirements above.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coverLetter: { type: Type.STRING },
          optimizedBullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          matchScore: { type: Type.NUMBER, description: "Match percentage out of 100" }
        },
        required: ["coverLetter", "optimizedBullets", "matchScore"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
