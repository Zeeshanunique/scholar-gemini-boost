
// Student Assessment Types
export interface Subject {
  name: string;
  selected: boolean;
  minScore: number;
  maxScore: number;
}

export interface TestResult {
  subject: string;
  score: number;
  totalPossible: number;
}

export interface Student {
  id: string;
  name: string;
  testResults: TestResult[];
}

export interface LearningRecommendation {
  subject: string;
  learningStyle: string;
  techniques: string[];
  resources: string[];
  strengths: string[];
  weaknesses: string[];
}

// Learning styles
export const LEARNING_STYLES = [
  "Visual",
  "Auditory",
  "Reading/Writing",
  "Kinesthetic",
  "Multimodal"
];
