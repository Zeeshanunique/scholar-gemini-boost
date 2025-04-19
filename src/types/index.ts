
// Student Assessment Types
export interface Subject {
  name: string;
  selected: boolean;
  minScore: number;
  maxScore: number;
  topics?: string[]; // Key topics within the subject
}

export interface TestResult {
  subject: string;
  score: number;
  totalPossible: number;
  attemptDate?: string;
  topicBreakdown?: { [topic: string]: number }; // Scores by specific topics
  timeSpent?: number; // Time spent in minutes
  mistakePatterns?: string[]; // Common mistake patterns
}

export interface Student {
  id: string;
  name: string;
  grade?: string;
  age?: number;
  testResults: TestResult[];
  learningStyle?: string;
  learningHistory?: LearningHistory[];
  behavioralMetrics?: BehavioralMetrics;
  progressMetrics?: ProgressMetrics;
}

export interface LearningRecommendation {
  subject: string;
  learningStyle: string;
  techniques: string[];
  resources: string[];
  strengths: string[];
  weaknesses: string[];
  remedialApproaches?: string[]; // Specific approaches for remedial teaching
  conceptualGaps?: string[]; // Fundamental concepts that need reinforcement
  estimatedTimeToImprove?: number; // Estimated time in weeks
  practiceExercises?: PracticeExercise[];
}

export interface PracticeExercise {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetSkill: string;
  estimatedTime: number; // Time in minutes
}

export interface LearningHistory {
  date: string;
  activity: string;
  duration: number; // Time in minutes
  engagementLevel: number; // Scale 1-10
  completionStatus: 'Completed' | 'Partial' | 'Abandoned';
  notes?: string;
}

export interface BehavioralMetrics {
  classParticipation: number; // Scale 1-10
  homeworkCompletion: number; // Percentage
  attentionSpan: number; // Minutes
  peerCollaboration: number; // Scale 1-10
  frustrationTolerance: number; // Scale 1-10
  motivationLevel: number; // Scale 1-10
  anxietyLevel: number; // Scale 1-10
  notes?: string;
}

export interface ProgressMetrics {
  startDate: string;
  currentDate: string;
  initialScore: number;
  currentScore: number;
  improvementRate: number; // Percentage
  consistencyScore: number; // Scale 1-10
  milestones: Milestone[];
}

export interface Milestone {
  title: string;
  targetDate: string;
  achievedDate?: string;
  description: string;
  isAchieved: boolean;
}

// Learning style quiz types
export interface LearningStyleQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    style: string;
  }[];
}

// Learning styles
export const LEARNING_STYLES = [
  "Visual",
  "Auditory",
  "Reading/Writing",
  "Kinesthetic",
  "Multimodal"
];

// Teaching methods
export interface TeachingMethod {
  id: string;
  name: string;
  description: string;
  steps: string[]; // Implementation steps
  resources: string[];
  benefits: string[]; // Benefits of this teaching method
  effectiveness: number; // Scale 1-10
  timeRequired: number; // Minutes per session
  subject: string; // Subject this method is for
  learningStyle: string; // Learning style this method is designed for
  isGeneral?: boolean; // Whether this is a general method applicable to many subjects
}

// Analytics Types
export interface PerformanceAnalytics {
  overallImprovement: number;
  subjectWiseProgress: { [subject: string]: number };
  learningRateBySubject: { [subject: string]: number };
  timeToMasteryEstimates: { [subject: string]: number }; // Days
  interventionEffectiveness: number; // Scale 1-10
}

// Teacher Dashboard Types
export interface ClassAnalytics {
  totalStudents: number;
  slowLearnerPercentage: number;
  averageImprovement: number;
  mostChallengedSubjects: string[];
  mostEffectiveInterventions: string[];
  recommendedTeachingApproaches: string[];
}
