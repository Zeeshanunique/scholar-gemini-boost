import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TestResult, LearningRecommendation, LearningStyleQuestion, TeachingMethod, PerformanceAnalytics, Student, BehavioralMetrics } from "@/types";

// Use API key from environment variables or allow user input as fallback
let apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem("gemini_api_key", key);
};

export const getApiKey = () => apiKey;

export const hasApiKey = () => !!apiKey;

// Generate learning recommendations based on student performance
export const generateLearningRecommendations = async (
  studentName: string,
  testResults: TestResult[],
  behavioralMetrics?: BehavioralMetrics,
  learningStyle?: string
): Promise<LearningRecommendation[]> => {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  try {
    // Create detailed sections of the prompt
    const testResultsText = testResults.map(result => 
      `Subject: ${result.subject}
       Score: ${result.score}/${result.totalPossible}
       Percentage: ${Math.round((result.score / result.totalPossible) * 100)}%
       ${result.timeSpent ? `Time Spent: ${result.timeSpent} minutes` : ''}
       ${result.mistakePatterns?.length ? `Common Mistakes: ${result.mistakePatterns.join(', ')}` : ''}`
    ).join('\n\n');
    
    const behavioralText = behavioralMetrics ? `
    Behavioral Metrics:
    - Class Participation: ${behavioralMetrics.classParticipation}/10
    - Homework Completion: ${behavioralMetrics.homeworkCompletion}%
    - Attention Span: ${behavioralMetrics.attentionSpan} minutes
    - Peer Collaboration: ${behavioralMetrics.peerCollaboration}/10
    - Frustration Tolerance: ${behavioralMetrics.frustrationTolerance}/10
    - Motivation Level: ${behavioralMetrics.motivationLevel}/10
    - Anxiety Level: ${behavioralMetrics.anxietyLevel}/10
    ${behavioralMetrics.notes ? `- Notes: ${behavioralMetrics.notes}` : ''}
    ` : '';
    
    const learningStyleText = learningStyle ? `The student's identified learning style is: ${learningStyle}` : '';

    const prompt = `
    As an advanced educational AI assistant specializing in identifying slow learners and designing remedial teaching strategies, conduct a detailed analysis for student ${studentName}.
    
    TEST RESULTS:
    ${testResultsText}
    
    ${behavioralText}
    
    ${learningStyleText}
    
    For each subject where the student scored below 75% (with special focus on those below 60% as critical intervention cases), provide:
    
    1. The most suitable learning style (Visual, Auditory, Reading/Writing, Kinesthetic, or Multimodal) with a justification
    2. Five specific remedial teaching techniques tailored to their performance and learning style
    3. Three recommended resources or tools (digital and non-digital)
    4. Specific conceptual gaps that need addressing
    5. Areas of strength within the subject to build upon
    6. Areas that need urgent improvement
    7. Three specific practice exercises with clear instructions, difficulty level, and estimated time
    8. Estimated time (in weeks) to achieve meaningful improvement
    
    Consider the behavioral metrics when available to customize your recommendations. Focus on building student confidence, reducing anxiety, and fostering engagement.
    
    Format your response as JSON with the following structure for each subject:
    {
      "recommendations": [
        {
          "subject": "subject name",
          "learningStyle": "recommended learning style",
          "techniques": ["technique1", "technique2", "technique3", "technique4", "technique5"],
          "resources": ["resource1", "resource2", "resource3"],
          "conceptualGaps": ["gap1", "gap2", "gap3"],
          "strengths": ["strength1", "strength2"],
          "weaknesses": ["weakness1", "weakness2"],
          "remedialApproaches": ["approach1", "approach2", "approach3"],
          "estimatedTimeToImprove": number_of_weeks,
          "practiceExercises": [
            {
              "title": "exercise name",
              "description": "detailed instructions",
              "difficulty": "Easy/Medium/Hard",
              "targetSkill": "specific skill to improve",
              "estimatedTime": minutes_to_complete
            }
          ]
        }
      ]
    }
    
    Only include subjects where improvement is needed (below 75%). Ensure the response is valid JSON without any comments or additional text.`;

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the Gemini API directly
    const result = await model.generateContent(prompt);
    
    const response = await result.response;
    const text = await response.text();
    
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

// Generate a learning style assessment quiz
export const generateLearningStyleQuiz = async (): Promise<LearningStyleQuestion[]> => {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  try {
    const prompt = `
    Create a learning style assessment quiz with 10 questions. Each question should have 5 options, each corresponding to a different learning style: Visual, Auditory, Reading/Writing, Kinesthetic, and Multimodal.
    
    Format your response as a valid JSON array with the following structure:
    [
      {
        "id": 1,
        "question": "How do you prefer to learn a new skill?",
        "options": [
          { "text": "By watching demonstrations", "style": "Visual" },
          { "text": "By listening to instructions", "style": "Auditory" },
          { "text": "By reading manuals or guides", "style": "Reading/Writing" },
          { "text": "By trying it hands-on", "style": "Kinesthetic" },
          { "text": "By combining multiple approaches", "style": "Multimodal" }
        ]
      }
    ]
    
    Make the questions diverse, covering different learning scenarios, and ensure they're appropriate for students of all ages. Keep the language simple and clear. Ensure the response is valid JSON.`;

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the Gemini API directly
    const result = await model.generateContent(prompt);
    
    const response = await result.response;
    const text = await response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON response from AI model");
    }
  } catch (error) {
    console.error("Error generating learning style quiz:", error);
    throw error;
  }
};

// Generate innovative teaching methods
export const generateTeachingMethods = async (
  learningStyle: string,
  subject: string
): Promise<TeachingMethod[]> => {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  try {
    const prompt = `
    As an educational expert, generate 5 innovative teaching methods specifically designed for ${learningStyle} learners studying ${subject}.
    
    For each method, provide:
    1. A unique name for the method
    2. A detailed description of how it works
    3. Step-by-step implementation guidelines for teachers
    4. Required resources or materials
    5. An effectiveness rating (1-10) based on research evidence
    6. Estimated time required per session
    
    Format your response as JSON with the following structure:
    [
      {
        "id": "1",
        "name": "Method Name",
        "description": "Detailed description",
        "suitableFor": ["Learning Style", "Another Learning Style"],
        "implementationSteps": ["Step 1", "Step 2", "Step 3"],
        "resources": ["Resource 1", "Resource 2"],
        "effectiveness": 8,
        "timeRequired": 30
      }
    ]
    
    Ensure these methods are evidence-based, practical to implement in a classroom setting, and specifically address the needs of slower learners who may benefit from remedial approaches. These methods should build confidence, reduce learning anxiety, and create engaging learning experiences.`;

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the Gemini API directly
    const result = await model.generateContent(prompt);
    
    const response = await result.response;
    const text = await response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON response from AI model");
    }
  } catch (error) {
    console.error("Error generating teaching methods:", error);
    throw error;
  }
};

// Generate performance analytics 
export const generatePerformanceAnalytics = async (
  student: Student
): Promise<PerformanceAnalytics> => {
  if (!apiKey) {
    throw new Error("API key not set");
  }

  if (!student.learningHistory || student.learningHistory.length === 0) {
    throw new Error("Student learning history is required for analytics");
  }

  try {
    // Prepare student data for the prompt
    const testResultsText = student.testResults.map(result => 
      `Subject: ${result.subject}, Score: ${result.score}/${result.totalPossible}, Percentage: ${Math.round((result.score / result.totalPossible) * 100)}%`
    ).join('\n');

    const learningHistoryText = student.learningHistory.map(entry => 
      `Date: ${entry.date}, Activity: ${entry.activity}, Duration: ${entry.duration} min, Engagement: ${entry.engagementLevel}/10, Status: ${entry.completionStatus}`
    ).join('\n');

    const prompt = `
    As an educational analytics expert, analyze the following student data and generate comprehensive performance analytics:

    STUDENT INFORMATION:
    Name: ${student.name}
    ${student.grade ? `Grade: ${student.grade}` : ''}
    ${student.age ? `Age: ${student.age}` : ''}
    Learning Style: ${student.learningStyle || 'Unknown'}

    TEST RESULTS:
    ${testResultsText}

    LEARNING HISTORY:
    ${learningHistoryText}

    ${student.behavioralMetrics ? `
    BEHAVIORAL METRICS:
    Class Participation: ${student.behavioralMetrics.classParticipation}/10
    Homework Completion: ${student.behavioralMetrics.homeworkCompletion}%
    Attention Span: ${student.behavioralMetrics.attentionSpan} minutes
    Peer Collaboration: ${student.behavioralMetrics.peerCollaboration}/10
    Frustration Tolerance: ${student.behavioralMetrics.frustrationTolerance}/10
    Motivation Level: ${student.behavioralMetrics.motivationLevel}/10
    Anxiety Level: ${student.behavioralMetrics.anxietyLevel}/10
    ` : ''}

    Based on this data, generate detailed performance analytics with the following metrics:
    1. Overall improvement percentage
    2. Subject-wise progress percentages
    3. Learning rate for each subject (how quickly the student is improving)
    4. Estimated time to mastery for each subject in days
    5. Intervention effectiveness rating (1-10)

    Format your response as a valid JSON object with the following structure:
    {
      "overallImprovement": percentage,
      "subjectWiseProgress": {
        "subject1": percentage,
        "subject2": percentage
      },
      "learningRateBySubject": {
        "subject1": rate,
        "subject2": rate
      },
      "timeToMasteryEstimates": {
        "subject1": days,
        "subject2": days
      },
      "interventionEffectiveness": rating
    }

    Ensure all numerical values are realistic and based on the provided data. If there's insufficient data for any metric, provide a reasonable estimate based on similar student profiles.`;

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the Gemini API directly
    const result = await model.generateContent(prompt);
    
    const response = await result.response;
    const text = await response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw new Error("Invalid JSON response from AI model");
    }
  } catch (error) {
    console.error("Error generating performance analytics:", error);
    throw error;
  }
};

// Add a new function to test the API key validity
export const testApiConnection = async (): Promise<{ success: boolean; message?: string }> => {
  if (!apiKey) {
    return { success: false, message: "API key is not set" };
  }
  
  try {
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate a simple test content
    const result = await model.generateContent("Test connection");
    
    // If we get here without an error, the connection is successful
    return { success: true };
  } catch (error) {
    console.error("API connection test failed:", error);
    return { 
      success: false, 
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
