import type { Student, ClassAnalytics } from "@/types";

// Load students from localStorage
export const loadStudents = (): Student[] => {
  try {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};

// Save students to localStorage
export const saveStudents = (students: Student[]): void => {
  try {
    localStorage.setItem('students', JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students:', error);
  }
};

// Generate a unique ID for new students
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Load class analytics from localStorage
export const loadAnalytics = (): ClassAnalytics | null => {
  try {
    const savedAnalytics = localStorage.getItem('classAnalytics');
    return savedAnalytics ? JSON.parse(savedAnalytics) : null;
  } catch (error) {
    console.error('Error loading analytics:', error);
    return null;
  }
};

// Save class analytics to localStorage
export const saveAnalytics = (analytics: ClassAnalytics): void => {
  try {
    localStorage.setItem('classAnalytics', JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
};

// Calculate and update class analytics based on student data
export const updateAnalytics = (students: Student[]): ClassAnalytics => {
  // Default analytics structure
  const defaultAnalytics: ClassAnalytics = {
    totalStudents: students.length,
    slowLearnerPercentage: 0,
    averageImprovement: 0,
    mostChallengedSubjects: [],
    mostEffectiveInterventions: [
      "Concept Mapping for Visual Learners",
      "Spaced Repetition Practice",
      "Peer-Led Tutorial Groups",
      "Multimedia Learning Resources"
    ],
    recommendedTeachingApproaches: [
      "Implement visual aids and diagrams for mathematical concepts",
      "Break complex problems into smaller, manageable steps",
      "Provide immediate feedback on practice problems",
      "Use real-world applications to demonstrate abstract concepts",
      "Create supportive learning environments that reduce math anxiety"
    ]
  };

  if (students.length === 0) {
    return defaultAnalytics;
  }

  // Calculate slow learner percentage
  const slowLearners = students.filter(student => {
    const lowScores = student.testResults.filter(
      test => (test.score / test.totalPossible) * 100 < 60
    );
    return lowScores.length > 1; // More than one low score indicates a slow learner
  });

  defaultAnalytics.slowLearnerPercentage = Math.round((slowLearners.length / students.length) * 100);

  // Calculate average improvement
  const studentsWithProgress = students.filter(s => s.progressMetrics?.improvementRate !== undefined);
  if (studentsWithProgress.length > 0) {
    const totalImprovement = studentsWithProgress.reduce((sum, s) => sum + (s.progressMetrics?.improvementRate || 0), 0);
    defaultAnalytics.averageImprovement = parseFloat((totalImprovement / studentsWithProgress.length).toFixed(1));
  }

  // Find most challenged subjects
  const subjectScores: Record<string, { total: number, count: number }> = {};
  students.forEach(student => {
    student.testResults.forEach(test => {
      if (!subjectScores[test.subject]) {
        subjectScores[test.subject] = { total: 0, count: 0 };
      }
      subjectScores[test.subject].total += (test.score / test.totalPossible) * 100;
      subjectScores[test.subject].count += 1;
    });
  });

  const subjectAverages = Object.entries(subjectScores)
    .filter(([_, data]) => data.count >= 2) // Only consider subjects with at least 2 scores
    .map(([subject, data]) => ({
      subject,
      average: data.total / data.count
    }))
    .sort((a, b) => a.average - b.average); // Sort by lowest average score first

  defaultAnalytics.mostChallengedSubjects = subjectAverages
    .slice(0, 3)
    .map(item => item.subject);

  return defaultAnalytics;
};
