
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, Users, BarChart3, BookMarked, Lightbulb, School, Brain, UserPlus, 
  Search, AlertTriangle, Film, BookOpen, Mic, Clock, Award, Heart, Calendar
} from "lucide-react";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { TeachingMethodsView } from "@/components/TeachingMethodsView";
import type { Student, ClassAnalytics, TeachingMethod, BehavioralMetrics, ProgressMetrics, Milestone } from "@/types";

// Enhanced mock data for demonstration purposes
const mockStudents: Student[] = [
  { 
    id: "1", 
    name: "Alice Smith", 
    grade: "10",
    age: 16,
    learningStyle: "Visual",
    testResults: [
      { subject: "Mathematics", score: 58, totalPossible: 100, attemptDate: "2025-03-15T10:00:00", timeSpent: 45, mistakePatterns: ["Calculation errors", "Conceptual misunderstanding"] },
      { subject: "Physics", score: 62, totalPossible: 100, attemptDate: "2025-03-10T14:30:00", timeSpent: 50 },
      { subject: "Mathematics", score: 65, totalPossible: 100, attemptDate: "2025-04-05T09:15:00", timeSpent: 40 },
    ],
    behavioralMetrics: {
      classParticipation: 4,
      homeworkCompletion: 70,
      attentionSpan: 25,
      peerCollaboration: 6,
      frustrationTolerance: 3,
      motivationLevel: 5,
      anxietyLevel: 7,
      notes: "Shows potential but gets frustrated with complex problems"
    },
    progressMetrics: {
      startDate: "2025-03-01T00:00:00",
      currentDate: "2025-04-16T00:00:00",
      initialScore: 55,
      currentScore: 65,
      improvementRate: 10,
      consistencyScore: 6,
      milestones: [
        { title: "Basic Algebra Mastery", targetDate: "2025-04-30T00:00:00", description: "Complete all basic algebra exercises with 80% accuracy", isAchieved: false },
        { title: "Regular Homework Completion", targetDate: "2025-03-31T00:00:00", achievedDate: "2025-04-02T00:00:00", description: "Submit all homework for 4 consecutive weeks", isAchieved: true }
      ]
    },
    learningHistory: [
      { date: "2025-03-05T00:00:00", activity: "Initial assessment", duration: 60, engagementLevel: 5, completionStatus: "Completed" },
      { date: "2025-03-15T00:00:00", activity: "Visual learning workshop", duration: 120, engagementLevel: 8, completionStatus: "Completed" },
      { date: "2025-04-01T00:00:00", activity: "One-on-one tutoring", duration: 90, engagementLevel: 7, completionStatus: "Completed" }
    ]
  },
  { 
    id: "2", 
    name: "Bob Johnson", 
    grade: "10",
    learningStyle: "Kinesthetic",
    testResults: [
      { subject: "Language Arts", score: 78, totalPossible: 100, attemptDate: "2025-03-20T11:30:00", timeSpent: 55 },
      { subject: "History", score: 72, totalPossible: 100, attemptDate: "2025-03-18T13:45:00", timeSpent: 60 },
      { subject: "Language Arts", score: 82, totalPossible: 100, attemptDate: "2025-04-10T10:00:00", timeSpent: 50 }
    ],
    progressMetrics: {
      startDate: "2025-03-01T00:00:00",
      currentDate: "2025-04-16T00:00:00",
      initialScore: 75,
      currentScore: 82,
      improvementRate: 7,
      consistencyScore: 8,
      milestones: [
        { title: "Essay Structure Mastery", targetDate: "2025-04-15T00:00:00", achievedDate: "2025-04-12T00:00:00", description: "Write properly structured essays with clear thesis and supporting arguments", isAchieved: true },
      ]
    }
  },
  { 
    id: "3", 
    name: "Carol Williams", 
    grade: "11",
    age: 17,
    learningStyle: "Auditory",
    testResults: [
      { subject: "Science", score: 65, totalPossible: 100, attemptDate: "2025-03-22T09:00:00", timeSpent: 50, mistakePatterns: ["Lab procedure errors"] },
      { subject: "Social Studies", score: 70, totalPossible: 100, attemptDate: "2025-03-25T14:00:00", timeSpent: 45 },
      { subject: "Science", score: 75, totalPossible: 100, attemptDate: "2025-04-12T09:30:00", timeSpent: 55 }
    ],
    behavioralMetrics: {
      classParticipation: 7,
      homeworkCompletion: 85,
      attentionSpan: 35,
      peerCollaboration: 8,
      frustrationTolerance: 6,
      motivationLevel: 7,
      anxietyLevel: 4,
      notes: "Responds well to verbal instructions and discussions"
    },
    progressMetrics: {
      startDate: "2025-03-01T00:00:00",
      currentDate: "2025-04-16T00:00:00",
      initialScore: 65,
      currentScore: 75,
      improvementRate: 10,
      consistencyScore: 7,
      milestones: []
    }
  },
  { 
    id: "4", 
    name: "David Brown", 
    grade: "9",
    learningStyle: "Reading/Writing",
    testResults: [
      { subject: "Mathematics", score: 52, totalPossible: 100, attemptDate: "2025-03-14T10:30:00", timeSpent: 60, mistakePatterns: ["Algebraic manipulations", "Word problems", "Formula application"] },
      { subject: "Computer Science", score: 68, totalPossible: 100, attemptDate: "2025-03-16T13:00:00", timeSpent: 55 },
      { subject: "Mathematics", score: 59, totalPossible: 100, attemptDate: "2025-04-08T10:00:00", timeSpent: 65 }
    ],
    behavioralMetrics: {
      classParticipation: 3,
      homeworkCompletion: 60,
      attentionSpan: 20,
      peerCollaboration: 4,
      frustrationTolerance: 4,
      motivationLevel: 5,
      anxietyLevel: 8,
      notes: "Struggles with math anxiety, prefers working alone"
    }
  },
  { 
    id: "5", 
    name: "Eva Martinez", 
    grade: "12",
    age: 18,
    learningStyle: "Multimodal",
    testResults: [
      { subject: "Language Arts", score: 88, totalPossible: 100, attemptDate: "2025-03-18T11:00:00", timeSpent: 40 },
      { subject: "Social Studies", score: 92, totalPossible: 100, attemptDate: "2025-03-21T14:30:00", timeSpent: 45 },
      { subject: "Language Arts", score: 91, totalPossible: 100, attemptDate: "2025-04-11T10:30:00", timeSpent: 35 }
    ],
    progressMetrics: {
      startDate: "2025-03-01T00:00:00",
      currentDate: "2025-04-16T00:00:00",
      initialScore: 85,
      currentScore: 91,
      improvementRate: 6,
      consistencyScore: 9,
      milestones: [
        { title: "Advanced Literature Analysis", targetDate: "2025-04-10T00:00:00", achievedDate: "2025-04-08T00:00:00", description: "Complete literary analysis with sophisticated thematic understanding", isAchieved: true },
        { title: "Research Paper Excellence", targetDate: "2025-05-15T00:00:00", description: "Complete research paper with proper citations and structured argument", isAchieved: false }
      ]
    }
  },
];

const mockClassAnalytics: ClassAnalytics = {
  totalStudents: 42,
  slowLearnerPercentage: 28,
  averageImprovement: 8.5,
  mostChallengedSubjects: ["Mathematics", "Physics", "Chemistry"],
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "teaching-methods">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTeachingMethods, setShowTeachingMethods] = useState(false);
  const [teachingMethodsSubject, setTeachingMethodsSubject] = useState("");
  const [teachingMethodsLearningStyle, setTeachingMethodsLearningStyle] = useState("");
  const { toast } = useToast();

  // Filter students based on search query
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.grade && student.grade.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewStudentDetails = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    } else {
      toast({
        title: "Student Not Found",
        description: "Could not find details for the selected student.",
        variant: "destructive"
      });
    }
  };

  const handleShowTeachingMethods = (subject: string, learningStyle: string) => {
    setTeachingMethodsSubject(subject);
    setTeachingMethodsLearningStyle(learningStyle);
    setShowTeachingMethods(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Learning Pathways</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Educator Dashboard</h2>
            <p className="text-gray-600">
              Identify slow learners and implement personalized remedial teaching strategies
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedStudent(null); 
                toast({
                  title: "Coming Soon",
                  description: "Student registration feature will be available soon."
                });
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics Overview
            </TabsTrigger>
            <TabsTrigger value="students">
              <Users className="h-4 w-4 mr-2" />
              Student Management
            </TabsTrigger>
            <TabsTrigger value="teaching-methods">
              <Brain className="h-4 w-4 mr-2" />
              Teaching Methods
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Teacher Dashboard */}
            <TeacherDashboard 
              analytics={mockClassAnalytics}
              students={mockStudents}
              onViewStudentDetails={handleViewStudentDetails}
            />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {selectedStudent ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Student Profile: {selectedStudent.name}
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedStudent(null)}
                  >
                    Back to List
                  </Button>
                </div>

                <div className="mb-6">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedStudent.name}</p>
                        </div>
                        {selectedStudent.grade && (
                          <div>
                            <p className="text-sm text-gray-500">Grade/Class</p>
                            <p className="font-medium">{selectedStudent.grade}</p>
                          </div>
                        )}
                        {selectedStudent.age && (
                          <div>
                            <p className="text-sm text-gray-500">Age</p>
                            <p className="font-medium">{selectedStudent.age}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Learning Style</p>
                          <p className="font-medium">{selectedStudent.learningStyle || "Not assessed"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Latest Performance</p>
                          <p className="font-medium">
                            {selectedStudent.testResults.length > 0 
                              ? `${Math.round((selectedStudent.testResults[0].score / selectedStudent.testResults[0].totalPossible) * 100)}% in ${selectedStudent.testResults[0].subject}`
                              : "No data"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Assessment Count</p>
                          <p className="font-medium">{selectedStudent.testResults.length} assessments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Tracking Component */}
                  <ProgressTracker student={selectedStudent} />
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> Student Management
                  </CardTitle>
                  <CardDescription>
                    View and track individual student progress and learning needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredStudents.length > 0 ? (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 p-4 bg-gray-100 text-sm font-medium">
                        <div className="col-span-1">#</div>
                        <div className="col-span-3">Name</div>
                        <div className="col-span-2">Grade</div>
                        <div className="col-span-2">Learning Style</div>
                        <div className="col-span-2">Latest Score</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      {filteredStudents.map((student, index) => {
                        const latestTest = student.testResults[0];
                        const latestScore = latestTest ? Math.round((latestTest.score / latestTest.totalPossible) * 100) : null;
                        
                        return (
                          <div 
                            key={student.id} 
                            className={`grid grid-cols-12 p-4 text-sm ${
                              index !== filteredStudents.length - 1 ? "border-b" : ""
                            }`}
                          >
                            <div className="col-span-1 font-medium">{student.id}</div>
                            <div className="col-span-3">{student.name}</div>
                            <div className="col-span-2">{student.grade || "-"}</div>
                            <div className="col-span-2">
                              {student.learningStyle ? (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {student.learningStyle}
                                </span>
                              ) : "Not assessed"}
                            </div>
                            <div className="col-span-2">
                              {latestScore !== null ? (
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  latestScore >= 80 
                                    ? "bg-green-100 text-green-800" 
                                    : latestScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {latestScore}% in {latestTest.subject}
                                </div>
                              ) : "No data"}
                            </div>
                            <div className="col-span-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewStudentDetails(student.id)}
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Students Found</h3>
                      <p className="text-gray-500 mt-2">No students match your search criteria.</p>
                      {searchQuery && (
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="teaching-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" /> Innovative Teaching Methods
                </CardTitle>
                <CardDescription>
                  Research-based approaches for different learning styles and subject areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Film className="h-5 w-5 text-purple-500" />
                          Visual Learners
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Use mind maps, diagrams, and flowcharts to represent concepts</li>
                          <li>Incorporate color-coding for key information and relationships</li>
                          <li>Demonstrate concepts with videos and visual simulations</li>
                        </ul>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => handleShowTeachingMethods("Mathematics", "Visual")}
                        >
                          View Methods
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          Reading/Writing Learners
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Provide written instructions and step-by-step guides</li>
                          <li>Encourage note-taking and written summaries</li>
                          <li>Use flashcards and written practice problems</li>
                        </ul>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => handleShowTeachingMethods("Language Arts", "Reading/Writing")}
                        >
                          View Methods
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Mic className="h-5 w-5 text-green-500" />
                          Auditory Learners
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Use verbal explanations and discussions</li>
                          <li>Create mnemonics and rhythmic patterns for concepts</li>
                          <li>Encourage students to explain concepts aloud</li>
                        </ul>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => handleShowTeachingMethods("Science", "Auditory")}
                        >
                          View Methods
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="h-5 w-5 text-orange-500" />
                          Kinesthetic Learners
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Incorporate hands-on experiments and activities</li>
                          <li>Use manipulatives and physical models</li>
                          <li>Implement role-playing and movement-based learning</li>
                        </ul>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => handleShowTeachingMethods("Physics", "Kinesthetic")}
                        >
                          View Methods
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                        Recommended Approaches for Slow Learners
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p>Based on analysis of student performance data in our system, these approaches have shown the greatest impact:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li><strong>Break complex problems</strong> into smaller, manageable steps</li>
                          <li><strong>Use multisensory approaches</strong> that combine visual, auditory, and kinesthetic elements</li>
                          <li><strong>Provide immediate feedback</strong> on practice problems to reinforce learning</li>
                          <li><strong>Implement spaced repetition</strong> of difficult concepts over time</li>
                          <li><strong>Create supportive environments</strong> that reduce anxiety and build confidence</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog for Teaching Methods */}
        <TeachingMethodsView 
          subject={teachingMethodsSubject}
          learningStyle={teachingMethodsLearningStyle}
          isOpen={showTeachingMethods}
          onClose={() => setShowTeachingMethods(false)}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Smart Learning Pathways © {new Date().getFullYear()} - Identifying slow learners for remedial teaching and capacity building
          </p>
          <div className="flex justify-center mt-2 space-x-4 text-sm text-gray-500">
            <span>Powered by Google Gemini 1.5</span>
            <span>•</span>
            <span>AI-Enhanced Learning Analytics</span>
          </div>
        </div>
      </footer>

      {/* Student Details Dialog - Future Enhancement */}
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Learning Profile</DialogTitle>
            <DialogDescription>
              Detailed assessment and personalized learning plan
            </DialogDescription>
          </DialogHeader>
          <div>
            {/* This will be implemented in future updates */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
