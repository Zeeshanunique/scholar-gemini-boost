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
  Search, AlertTriangle, Film, BookOpen, Mic, Clock, Award, Heart, Calendar, Loader2, Database
} from "lucide-react";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { TeachingMethodsView } from "@/components/TeachingMethodsView";
import { EnhancedStudentAssessment } from "@/components/EnhancedStudentAssessment";
import { 
  loadStudents, 
  saveStudent, 
  updateStudent, 
  loadAnalytics, 
  saveAnalytics, 
  updateAnalytics,
  populateSampleData
} from "@/utils/firestore";
import type { Student, ClassAnalytics, TeachingMethod, BehavioralMetrics, ProgressMetrics, Milestone, TestResult } from "@/types";

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics>({
    totalStudents: 0,
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
  });
  
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "teaching-methods">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTeachingMethods, setShowTeachingMethods] = useState(false);
  const [teachingMethodsSubject, setTeachingMethodsSubject] = useState("");
  const [teachingMethodsLearningStyle, setTeachingMethodsLearningStyle] = useState("");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopulateDialog, setShowPopulateDialog] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const { toast } = useToast();

  // Load students and analytics on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load students from Firestore
        const fetchedStudents = await loadStudents();
        setStudents(fetchedStudents);
        
        // Load or calculate analytics
        const fetchedAnalytics = await loadAnalytics();
        if (fetchedAnalytics) {
          setClassAnalytics(fetchedAnalytics);
        } else if (fetchedStudents.length > 0) {
          const newAnalytics = updateAnalytics(fetchedStudents);
          setClassAnalytics(newAnalytics);
          await saveAnalytics(newAnalytics);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data from database",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.grade && student.grade.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewStudentDetails = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
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
  
  const handleStudentSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddStudentComplete = async (name: string, results: TestResult[], behavioralMetrics?: BehavioralMetrics, learningStyle?: string) => {
    setIsAssessing(true);
    
    try {
      // Create a new student object
      const newStudent: Omit<Student, 'id'> = {
        name,
        testResults: results,
        learningStyle: learningStyle || undefined,
      };
      
      if (behavioralMetrics) {
        newStudent.behavioralMetrics = behavioralMetrics;
      }
      
      // Calculate progress metrics based on test results
      if (results.length > 0) {
        const latestScore = results[0].score;
        const totalPossible = results[0].totalPossible;
        
        newStudent.progressMetrics = {
          startDate: new Date().toISOString(),
          currentDate: new Date().toISOString(),
          initialScore: latestScore,
          currentScore: latestScore,
          improvementRate: 0,
          consistencyScore: 5,
          milestones: []
        };
      }
      
      // Add the new student to Firestore
      const studentId = await saveStudent(newStudent);
      
      // Add the new student to the local state
      const studentWithId = { ...newStudent, id: studentId };
      const updatedStudents = [...students, studentWithId];
      setStudents(updatedStudents);
      
      // Update analytics
      const newAnalytics = updateAnalytics(updatedStudents);
      setClassAnalytics(newAnalytics);
      await saveAnalytics(newAnalytics);
      
      // Hide the assessment dialog and show success message
      toast({
        title: "Student Added",
        description: `${name} has been successfully added to your class.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student to database",
        variant: "destructive"
      });
    } finally {
      setIsAssessing(false);
      setShowAddStudentDialog(false);
    }
  };
  
  const handlePopulateData = async () => {
    setIsPopulating(true);
    
    try {
      await populateSampleData(10);
      
      // Reload data after population
      const fetchedStudents = await loadStudents();
      setStudents(fetchedStudents);
      
      const fetchedAnalytics = await loadAnalytics();
      if (fetchedAnalytics) {
        setClassAnalytics(fetchedAnalytics);
      }
      
      toast({
        title: "Sample Data Added",
        description: "10 sample students have been added to the database",
        variant: "default"
      });
    } catch (error) {
      console.error("Error populating data:", error);
      toast({
        title: "Error",
        description: "Failed to populate sample data",
        variant: "destructive"
      });
    } finally {
      setIsPopulating(false);
      setShowPopulateDialog(false);
    }
  };

  const handleSubjectAnalysisUpdate = async () => {
    try {
      // Fetch the latest data to ensure we have current analytics
      const fetchedStudents = await loadStudents();
      const newAnalytics = updateAnalytics(fetchedStudents);
      setClassAnalytics(newAnalytics);
      await saveAnalytics(newAnalytics);
      
      toast({
        title: "Analysis Updated",
        description: "Subject analysis has been updated with the latest data",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating subject analysis:", error);
      toast({
        title: "Error",
        description: "Failed to update subject analysis",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching data from the database...</p>
        </div>
      </div>
    );
  }

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
                onChange={(e) => handleStudentSearch(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAddStudentDialog(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            {students.length === 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowPopulateDialog(true)}
              >
                <Database className="h-4 w-4 mr-2" />
                Populate Data
              </Button>
            )}
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
              analytics={classAnalytics}
              students={students}
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
                        {/* <div className="col-span-1">#</div> */}
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
                            {/* <div className="col-span-1 font-medium">{student.id}</div> */}
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
                          onClick={() => handleStudentSearch("")}
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

        {/* Dialog for Adding Student */}
        <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Student</DialogTitle>
              <DialogDescription>
                Complete the assessment to add a new student to your class
              </DialogDescription>
            </DialogHeader>
            <EnhancedStudentAssessment 
              onComplete={handleAddStudentComplete} 
              onCancel={() => setShowAddStudentDialog(false)}
              isLoading={isAssessing}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog for Populating Sample Data */}
        <Dialog open={showPopulateDialog} onOpenChange={setShowPopulateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Populate Sample Data</DialogTitle>
              <DialogDescription>
                Add 10 sample students to your class for demonstration purposes
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <p className="mb-4 text-sm text-gray-600">
                This will create 10 sample students with randomized data in your database.
                This is useful for testing and demonstration purposes.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPopulateDialog(false)}
                  className="flex-1"
                  disabled={isPopulating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePopulateData}
                  className="flex-1"
                  disabled={isPopulating}
                >
                  {isPopulating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Populating...
                    </>
                  ) : (
                    <>Populate Data</>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog for Updating Subject Analysis */}
        <Dialog open={false} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Subject Analysis</DialogTitle>
              <DialogDescription>
                Update the subject analysis with the latest data
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <p className="mb-4 text-sm text-gray-600">
                This will update the subject analysis with the latest data from the database.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {}}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubjectAnalysisUpdate}
                  className="flex-1"
                >
                  Update Analysis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Smart Learning Pathways &copy; {new Date().getFullYear()} - Identifying slow learners for remedial teaching and capacity building
          </p>
          <div className="flex justify-center mt-2 space-x-4 text-sm text-gray-500">
            <span>Powered by Google Gemini 1.5</span>
            <span>&bull;</span>
            <span>AI-Enhanced Learning Analytics</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
