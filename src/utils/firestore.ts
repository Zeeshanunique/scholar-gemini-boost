import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Student, ClassAnalytics, TestResult, TeachingMethod } from "@/types";

// Collection references
const STUDENTS_COLLECTION = "students";
const ANALYTICS_COLLECTION = "analytics";
const ANALYTICS_DOC_ID = "classAnalytics";
const TEACHING_METHODS_COLLECTION = "teachingMethods";
const INTERVENTIONS_COLLECTION = "interventions";

// Load students from Firestore
export const loadStudents = async (): Promise<Student[]> => {
  try {
    const studentsCollection = collection(db, STUDENTS_COLLECTION);
    const querySnapshot = await getDocs(studentsCollection);
    
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Student, 'id'>;
      students.push({
        ...data,
        id: doc.id
      });
    });
    
    return students;
  } catch (error) {
    console.error('Error loading students from Firestore:', error);
    return [];
  }
};

// Remove undefined values from an object before saving to Firestore
const removeUndefined = <T>(obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = { ...obj };
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    // If value is undefined, delete the key
    if (value === undefined) {
      delete result[key];
    } 
    // If value is an array, filter out undefined values
    else if (Array.isArray(value)) {
      result[key] = value
        .filter(item => item !== undefined)
        .map(item => typeof item === 'object' && item !== null ? removeUndefined(item) : item);
    } 
    // If value is an object, recursively clean it
    else if (typeof value === 'object' && value !== null) {
      result[key] = removeUndefined(value);
    }
  });
  return result;
};

// Save a student to Firestore
export const saveStudent = async (student: Omit<Student, 'id'>): Promise<string> => {
  try {
    const studentsCollection = collection(db, STUDENTS_COLLECTION);
    // Clean the data and add timestamp
    const cleanedStudent = removeUndefined(student);
    const studentWithTimestamp = {
      ...cleanedStudent,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(studentsCollection, studentWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error saving student to Firestore:', error);
    throw error;
  }
};

// Update a student in Firestore
export const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<void> => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    // Clean the data and add timestamp
    const cleanedUpdates = removeUndefined(updates);
    const updatesWithTimestamp = {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    };
    await updateDoc(studentRef, updatesWithTimestamp);
  } catch (error) {
    console.error('Error updating student in Firestore:', error);
    throw error;
  }
};

// Delete a student from Firestore
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await deleteDoc(studentRef);
  } catch (error) {
    console.error('Error deleting student from Firestore:', error);
    throw error;
  }
};

// Load class analytics from Firestore
export const loadAnalytics = async (): Promise<ClassAnalytics | null> => {
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    const docSnap = await getDoc(analyticsRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as ClassAnalytics;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading analytics from Firestore:', error);
    return null;
  }
};

// Save or update class analytics in Firestore
export const saveAnalytics = async (analytics: ClassAnalytics): Promise<void> => {
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    // Clean the data
    const cleanedAnalytics = removeUndefined(analytics);
    await setDoc(analyticsRef, {
      ...cleanedAnalytics,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving analytics to Firestore:', error);
    throw error;
  }
};

// Generate a sample student for initial data population
export const generateSampleStudent = (index: number): Omit<Student, 'id'> => {
  const learningStyles = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing", "Multimodal"];
  const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Engineering", "Language Arts", "History", "Social Studies"];
  const grades = ["9", "10", "11", "12"];
  
  // Select random values
  const learningStyle = learningStyles[Math.floor(Math.random() * learningStyles.length)];
  const grade = grades[Math.floor(Math.random() * grades.length)];
  const age = Math.floor(Math.random() * (22 - 15)) + 15; // Random age between 15-22
  
  // Create test results - between 1 and 3 subjects
  const numSubjects = Math.floor(Math.random() * 3) + 1;
  const testResults: TestResult[] = [];
  
  const usedSubjects = new Set<string>();
  for (let i = 0; i < numSubjects; i++) {
    let subject;
    do {
      subject = subjects[Math.floor(Math.random() * subjects.length)];
    } while (usedSubjects.has(subject));
    
    usedSubjects.add(subject);
    const score = Math.floor(Math.random() * 41) + 60; // 60-100 score range
    const timeSpent = Math.floor(Math.random() * 31) + 30; // 30-60 minutes
    
    // Sometimes add mistake patterns
    const hasMistakes = Math.random() > 0.6;
    const mistakePatterns = hasMistakes ? ["Calculation errors", "Concept confusion"] : undefined;
    
    // Add the test result
    testResults.push({
      subject,
      score,
      totalPossible: 100,
      attemptDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
      timeSpent,
      mistakePatterns
    });
  }
  
  // Sometimes add behavioral metrics
  const hasBehavioralMetrics = Math.random() > 0.3;
  const behavioralMetrics = hasBehavioralMetrics ? {
    classParticipation: Math.floor(Math.random() * 6) + 3, // 3-8
    homeworkCompletion: Math.floor(Math.random() * 41) + 60, // 60-100%
    attentionSpan: Math.floor(Math.random() * 21) + 20, // 20-40 minutes
    peerCollaboration: Math.floor(Math.random() * 6) + 3, // 3-8
    frustrationTolerance: Math.floor(Math.random() * 6) + 3, // 3-8
    motivationLevel: Math.floor(Math.random() * 6) + 3, // 3-8
    anxietyLevel: Math.floor(Math.random() * 8) + 1, // 1-8
    notes: "Generated sample student"
  } : undefined;
  
  // Sometimes add progress metrics
  const hasProgressMetrics = Math.random() > 0.4;
  const improvementRate = Math.floor(Math.random() * 16); // 0-15%
  const progressMetrics = hasProgressMetrics ? {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    currentDate: new Date().toISOString(),
    initialScore: Math.floor(Math.random() * 31) + 50, // 50-80
    currentScore: Math.floor(Math.random() * 21) + 70, // 70-90
    improvementRate,
    consistencyScore: Math.floor(Math.random() * 6) + 3, // 3-8
    milestones: [
      {
        title: "Basic Concepts Mastery",
        targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days in future
        description: "Complete all basic exercises with 80% accuracy",
        isAchieved: false
      }
    ]
  } : undefined;
  
  return {
    name: `Student ${index + 1}`,
    grade,
    age,
    learningStyle,
    testResults,
    behavioralMetrics,
    progressMetrics
  };
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
    return lowScores.length > 0; // At least one low score indicates a slow learner
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

// Populate Firestore with sample data
export const populateSampleData = async (count: number = 10): Promise<void> => {
  try {
    // Generate and save sample students
    const sampleStudents: Student[] = [];
    
    for (let i = 0; i < count; i++) {
      const sampleStudent = generateSampleStudent(i);
      const id = await saveStudent(sampleStudent);
      sampleStudents.push({ ...sampleStudent, id });
    }
    
    // Calculate and save analytics
    const analytics = updateAnalytics(sampleStudents);
    await saveAnalytics(analytics);
    
    console.log(`Successfully populated ${count} sample students and analytics`);
  } catch (error) {
    console.error('Error populating sample data:', error);
    throw error;
  }
};

// Get teaching methods from Firestore
export const getTeachingMethods = async (subject: string, learningStyle: string): Promise<TeachingMethod[]> => {
  try {
    // First try to find methods for the specific subject and learning style
    const teachingMethodsCollection = collection(db, TEACHING_METHODS_COLLECTION);
    const q = query(
      teachingMethodsCollection,
      where("subject", "==", subject),
      where("learningStyle", "==", learningStyle)
    );
    
    let querySnapshot = await getDocs(q);
    
    // If no specific methods found, try to find general methods for the learning style
    if (querySnapshot.empty) {
      const generalQuery = query(
        teachingMethodsCollection,
        where("learningStyle", "==", learningStyle),
        where("isGeneral", "==", true)
      );
      querySnapshot = await getDocs(generalQuery);
    }
    
    const methods: TeachingMethod[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as TeachingMethod;
      methods.push({
        ...data,
        id: doc.id
      });
    });
    
    // If still no methods found, generate and save some
    if (methods.length === 0) {
      // Generate sample teaching methods
      const sampleMethods = generateSampleTeachingMethods(subject, learningStyle);
      
      // Save each method to Firestore
      for (const method of sampleMethods) {
        const docRef = await addDoc(teachingMethodsCollection, {
          ...removeUndefined(method),
          subject,
          learningStyle,
          createdAt: serverTimestamp()
        });
        
        // Add the ID to the method
        methods.push({
          ...method,
          id: docRef.id
        });
      }
    }
    
    return methods;
  } catch (error) {
    console.error('Error getting teaching methods from Firestore:', error);
    throw error;
  }
};

// Get interventions from Firestore
export const getInterventions = async (): Promise<string[]> => {
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    const docSnap = await getDoc(analyticsRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as ClassAnalytics;
      return data.mostEffectiveInterventions || [];
    }
    
    // If no interventions found, return default ones
    return [
      "Concept Mapping for Visual Learners",
      "Spaced Repetition Practice",
      "Peer-Led Tutorial Groups",
      "Multimedia Learning Resources"
    ];
  } catch (error) {
    console.error('Error getting interventions from Firestore:', error);
    return [
      "Concept Mapping for Visual Learners",
      "Spaced Repetition Practice",
      "Peer-Led Tutorial Groups",
      "Multimedia Learning Resources"
    ];
  }
};

// Save intervention to Firestore
export const saveIntervention = async (intervention: string): Promise<void> => {
  try {
    const analyticsRef = doc(db, ANALYTICS_COLLECTION, ANALYTICS_DOC_ID);
    const docSnap = await getDoc(analyticsRef);
    
    let currentInterventions: string[] = [];
    
    if (docSnap.exists()) {
      const data = docSnap.data() as ClassAnalytics;
      currentInterventions = data.mostEffectiveInterventions || [];
    }
    
    // Add the new intervention if it doesn't already exist
    if (!currentInterventions.includes(intervention)) {
      currentInterventions.push(intervention);
      
      // Update the analytics document
      await updateDoc(analyticsRef, {
        mostEffectiveInterventions: currentInterventions,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving intervention to Firestore:', error);
    throw error;
  }
};

// Generate sample teaching methods
const generateSampleTeachingMethods = (subject: string, learningStyle: string): Omit<TeachingMethod, 'id'>[] => {
  const methods: Omit<TeachingMethod, 'id'>[] = [];
  
  // Method 1: Interactive activities
  methods.push({
    name: "Interactive Learning Activities",
    description: `Interactive ${subject} activities designed specifically for ${learningStyle} learners to reinforce key concepts through hands-on engagement.`,
    steps: [
      "Identify the specific concepts the student is struggling with",
      "Create tailored interactive activities that match their learning style",
      "Guide the student through the activity with clear instructions",
      "Ask reflective questions to reinforce understanding",
      "Have the student demonstrate mastery independently"
    ],
    effectiveness: 8,
    timeRequired: 30,
    resources: ["Interactive digital tools", "Physical manipulatives", "Guided worksheets"],
    benefits: [
      "Increases engagement and motivation",
      "Builds confidence through guided practice",
      "Creates memory anchors for abstract concepts",
      "Allows immediate feedback and correction"
    ],
    subject,
    learningStyle,
    isGeneral: false
  });
  
  // Method 2: Concept mapping
  methods.push({
    name: "Visual Concept Mapping",
    description: `Strategic concept mapping approach for ${subject} that helps ${learningStyle} learners visualize relationships between key ideas and supporting details.`,
    steps: [
      "Identify the central concept or problem area",
      "Break down the concept into component parts",
      "Create a visual map showing relationships",
      "Have student explain the map in their own words",
      "Gradually add complexity as understanding improves"
    ],
    effectiveness: 9,
    timeRequired: 45,
    resources: ["Mapping software or large paper", "Colored markers", "Reference materials"],
    benefits: [
      "Creates visual memory aids",
      "Demonstrates relationships between concepts",
      "Helps identify knowledge gaps",
      "Provides a structured framework for complex topics"
    ],
    subject,
    learningStyle,
    isGeneral: false
  });
  
  // Method 3: Scaffolded Practice
  methods.push({
    name: "Scaffolded Practice Sessions",
    description: `Progressive approach to ${subject} learning that gradually reduces support as the ${learningStyle} student builds confidence and skills.`,
    steps: [
      "Begin with fully guided examples",
      "Move to partially completed problems",
      "Provide hints for independent work",
      "Allow completely independent problem-solving",
      "Review and reflect on the learning process"
    ],
    effectiveness: 7,
    timeRequired: 60,
    resources: ["Structured worksheets", "Progress tracking sheets", "Reference guides"],
    benefits: [
      "Reduces anxiety about difficult concepts",
      "Builds confidence through incremental success",
      "Creates a clear pathway to mastery",
      "Allows personalized pacing"
    ],
    subject,
    learningStyle,
    isGeneral: true
  });
  
  return methods;
};
