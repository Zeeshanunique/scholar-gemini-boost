
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TestResult, LearningRecommendation } from "@/types";

// Use API key from environment variables or allow user input as fallback
let apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const setApiKey = (key: string) => {
  apiKey = key;
};

export const getApiKey = () => apiKey;

export const hasApiKey = () => !!apiKey;

export const generateLearningRecommendations = async (
  studentName: string,
  testResults: TestResult[],
): Promise<LearningRecommendation[]> => {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the gemini-1.5-flash model as specified
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    As an educational AI assistant, analyze the following test results for student ${studentName}:
    
    ${testResults.map(result => 
      `Subject: ${result.subject}
       Score: ${result.score}/${result.totalPossible}
       Percentage: ${Math.round((result.score / result.totalPossible) * 100)}%`
    ).join('\n\n')}
    
    For each subject where the student scored below 70%, provide:
    1. The most suitable learning style (Visual, Auditory, Reading/Writing, Kinesthetic, or Multimodal)
    2. Three specific learning techniques tailored to their performance
    3. Two recommended resources or tools
    4. Areas of strength within the subject
    5. Areas that need improvement
    
    Format your response as JSON with the following structure for each subject:
    {
      "recommendations": [
        {
          "subject": "subject name",
          "learningStyle": "recommended learning style",
          "techniques": ["technique1", "technique2", "technique3"],
          "resources": ["resource1", "resource2"],
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"]
        }
      ]
    }
    
    Only include subjects where improvement is needed (below 70%). Ensure the response is valid JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    try {
      const parsedJson = JSON.parse(jsonMatch[0]);
      return parsedJson.recommendations || [];
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON response from AI model");
    }
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

// Add a new function to test the API key validity
export const testApiConnection = async (): Promise<boolean> => {
  if (!apiKey) return false;
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Test connection");
    return result.response !== undefined;
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};
