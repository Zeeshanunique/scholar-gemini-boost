import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, BookOpen, CalendarClock, Brain, ClipboardCheck } from "lucide-react";
import { LearningStyleQuiz } from "@/components/LearningStyleQuiz";
import { BehavioralMetricsInput } from "@/components/BehavioralMetricsInput";
import type { Subject, TestResult, BehavioralMetrics } from "@/types";

interface EnhancedStudentAssessmentProps {
  onSubmit?: (name: string, results: TestResult[], behavioralMetrics?: BehavioralMetrics, learningStyle?: string) => void;
  onComplete?: (name: string, results: TestResult[], behavioralMetrics?: BehavioralMetrics, learningStyle?: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const EnhancedStudentAssessment = ({ 
  onSubmit, 
  onComplete,
  onCancel,
  isLoading = false 
}: EnhancedStudentAssessmentProps) => {
  const [currentStep, setCurrentStep] = useState<"basic" | "learning-style" | "behavioral">("basic");
  const [studentName, setStudentName] = useState("");
  const [studentGrade, setStudentGrade] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [behavioralMetrics, setBehavioralMetrics] = useState<BehavioralMetrics | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([
    // Core Engineering Subjects
    { name: "Calculus & Mathematics", selected: true, minScore: 0, maxScore: 100, 
      topics: ["Limits", "Derivatives", "Integrals", "Differential Equations"] },
    { name: "Engineering Physics", selected: true, minScore: 0, maxScore: 100,
      topics: ["Mechanics", "Electricity", "Magnetism", "Optics"] },
    { name: "Computer Programming", selected: true, minScore: 0, maxScore: 100,
      topics: ["Variables", "Control Structures", "Functions", "Object-Oriented Programming"] },
    { name: "Data Structures & Algorithms", selected: true, minScore: 0, maxScore: 100,
      topics: ["Arrays", "Linked Lists", "Trees", "Graph Algorithms"] },
    { name: "Digital Electronics", selected: true, minScore: 0, maxScore: 100,
      topics: ["Logic Gates", "Boolean Algebra", "Flip Flops", "Counters"] },
    { name: "Database Management Systems", selected: false, minScore: 0, maxScore: 100,
      topics: ["ER Model", "Normalization", "SQL", "Transactions"] },
    { name: "Computer Networks", selected: false, minScore: 0, maxScore: 100,
      topics: ["OSI Model", "TCP/IP", "Routing", "Network Security"] },
    { name: "Software Engineering", selected: false, minScore: 0, maxScore: 100,
      topics: ["SDLC", "Agile", "Testing", "DevOps"] },
    { name: "Operating Systems", selected: false, minScore: 0, maxScore: 100,
      topics: ["Process Management", "Memory Management", "File Systems", "Concurrency"] },
    { name: "Computer Architecture", selected: false, minScore: 0, maxScore: 100,
      topics: ["CPU Design", "Memory Hierarchy", "I/O Systems", "Pipelining"] },
    // Specialized Engineering Subjects
    { name: "Artificial Intelligence", selected: false, minScore: 0, maxScore: 100,
      topics: ["Search Algorithms", "Knowledge Representation", "Machine Learning", "Neural Networks"] },
    { name: "Machine Learning", selected: false, minScore: 0, maxScore: 100,
      topics: ["Supervised Learning", "Unsupervised Learning", "Deep Learning", "Reinforcement Learning"] },
    { name: "Web Development", selected: false, minScore: 0, maxScore: 100,
      topics: ["HTML/CSS", "JavaScript", "Frameworks", "Backend Development"] },
    { name: "Mobile App Development", selected: false, minScore: 0, maxScore: 100,
      topics: ["UI Design", "Native Development", "Cross-Platform", "App Publishing"] },
    { name: "Cloud Computing", selected: false, minScore: 0, maxScore: 100,
      topics: ["Virtualization", "Containers", "Serverless", "Cloud Services"] },
    { name: "Cybersecurity", selected: false, minScore: 0, maxScore: 100,
      topics: ["Cryptography", "Network Security", "Ethical Hacking", "Security Policies"] },
  ]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({});
  const [mistakePatterns, setMistakePatterns] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const [subjectView, setSubjectView] = useState<"core" | "all">("core");

  const handleSubjectToggle = (index: number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].selected = !updatedSubjects[index].selected;
    setSubjects(updatedSubjects);
  };

  const handleScoreChange = (subjectName: string, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    const subject = subjects.find(s => s.name === subjectName);
    
    if (!subject) return;
    
    const maxScore = subject.maxScore;
    const validValue = Math.min(Math.max(numValue, 0), maxScore);
    
    setScores({ ...scores, [subjectName]: validValue });
  };

  const handleTimeSpentChange = (subjectName: string, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setTimeSpent({ ...timeSpent, [subjectName]: numValue });
  };

  const handleTopicSelect = (subjectName: string, topic: string) => {
    const current = selectedTopics[subjectName] || [];
    const updated = current.includes(topic)
      ? current.filter(t => t !== topic)
      : [...current, topic];
    
    setSelectedTopics({ ...selectedTopics, [subjectName]: updated });
  };

  const handleMistakePatternChange = (subjectName: string, value: string) => {
    // No need to split by commas as we want to preserve spaces and commas
    setMistakePatterns({ ...mistakePatterns, [subjectName]: [value] });
  };

  const handleBasicInfoSubmit = () => {
    if (!studentName.trim()) {
      setError("Please enter a student name");
      return;
    }
    
    const selectedSubjects = subjects.filter(subject => subject.selected);
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }
    
    const missingScores = selectedSubjects.filter(
      subject => scores[subject.name] === undefined
    );
    
    if (missingScores.length > 0) {
      setError(`Please enter scores for: ${missingScores.map(s => s.name).join(", ")}`);
      return;
    }

    setError("");
    setCurrentStep("learning-style");
  };

  const handleLearningStyleComplete = (style: string) => {
    setLearningStyle(style);
    setCurrentStep("behavioral");
  };

  const handleBehavioralMetricsSubmit = (metrics: BehavioralMetrics) => {
    setBehavioralMetrics(metrics);
    completeAssessment();
  };

  const completeAssessment = () => {
    const selectedSubjects = subjects.filter(subject => subject.selected);
    
    const testResults: TestResult[] = selectedSubjects.map(subject => {
      const result: TestResult = {
        subject: subject.name,
        score: scores[subject.name] || 0,
        totalPossible: subject.maxScore,
        attemptDate: new Date().toISOString(),
      };

      if (timeSpent[subject.name]) {
        result.timeSpent = timeSpent[subject.name];
      }

      if (mistakePatterns[subject.name] && mistakePatterns[subject.name].length > 0) {
        result.mistakePatterns = mistakePatterns[subject.name];
      }

      if (selectedTopics[subject.name] && selectedTopics[subject.name].length > 0) {
        result.topicBreakdown = {};
        const topicScore = (scores[subject.name] || 0) / (selectedTopics[subject.name].length || 1);
        
        selectedTopics[subject.name].forEach(topic => {
          if (result.topicBreakdown) {
            result.topicBreakdown[topic] = topicScore;
          }
        });
      }

      return result;
    });

    if (onComplete) {
      onComplete(studentName, testResults, behavioralMetrics || undefined, learningStyle);
    } else if (onSubmit) {
      onSubmit(studentName, testResults, behavioralMetrics || undefined, learningStyle);
    }
  };

  const displayedSubjects = subjectView === "core" 
    ? subjects.slice(0, 5) 
    : subjects;

  if (currentStep === "learning-style") {
    return <LearningStyleQuiz onComplete={handleLearningStyleComplete} />;
  }

  if (currentStep === "behavioral") {
    return <BehavioralMetricsInput onSubmit={handleBehavioralMetricsSubmit} />;
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-blue-600" />
          Comprehensive Student Assessment
        </CardTitle>
        <CardDescription>
          Provide detailed information about the student's performance and learning patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="info">
              <BookOpen className="h-4 w-4 mr-2" />
              Student Info
            </TabsTrigger>
            <TabsTrigger value="academic">
              <Brain className="h-4 w-4 mr-2" />
              Academic Assessment
            </TabsTrigger>
            <TabsTrigger value="details">
              <CalendarClock className="h-4 w-4 mr-2" />
              Assessment Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name <span className="text-red-500">*</span></Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentGrade">Grade/Class Level</Label>
                <Input
                  id="studentGrade"
                  value={studentGrade}
                  onChange={e => setStudentGrade(e.target.value)}
                  placeholder="e.g., 10th, Sophomore"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentAge">Age (15-40)</Label>
              <Input
                id="studentAge"
                type="number"
                min="15"
                max="40"
                value={studentAge}
                onChange={e => setStudentAge(e.target.value)}
                placeholder="Student's age (15-40)"
              />
              {studentAge && (parseInt(studentAge) < 15 || parseInt(studentAge) > 40) && (
                <p className="text-xs text-red-500 mt-1">Age must be between 15 and 40</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Academic Subjects</Label>
              <Select 
                value={subjectView} 
                onValueChange={(value) => setSubjectView(value as "core" | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core Subjects</SelectItem>
                  <SelectItem value="all">All Subjects</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {displayedSubjects.map((subject, index) => (
                <div key={subject.name} className="space-y-2 border p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`subject-${index}`}
                      checked={subject.selected}
                      onCheckedChange={() => handleSubjectToggle(index)}
                    />
                    <Label htmlFor={`subject-${index}`} className="text-sm font-medium">
                      {subject.name}
                    </Label>
                  </div>
                  
                  {subject.selected && (
                    <div className="pl-6 pt-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={subject.minScore}
                          max={subject.maxScore}
                          value={scores[subject.name] || ""}
                          onChange={e => handleScoreChange(subject.name, e.target.value)}
                          placeholder="Score"
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">/ {subject.maxScore}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              {subjects.filter(subject => subject.selected).map((subject, index) => (
                <div key={subject.name} className="border p-4 rounded-md">
                  <h3 className="font-medium mb-3">{subject.name}</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Time Spent (minutes)</Label>
                      <Input
                        type="number"
                        value={timeSpent[subject.name] || ""}
                        onChange={e => handleTimeSpentChange(subject.name, e.target.value)}
                        placeholder="Time spent in minutes"
                      />
                    </div>
                    
                    {subject.topics && (
                      <div className="space-y-2">
                        <Label>Challenging Topics</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {subject.topics.map(topic => (
                            <div key={topic} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`${subject.name}-${topic}`}
                                checked={(selectedTopics[subject.name] || []).includes(topic)}
                                onCheckedChange={() => handleTopicSelect(subject.name, topic)}
                              />
                              <Label htmlFor={`${subject.name}-${topic}`} className="text-sm">
                                {topic}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Common Mistake Patterns</Label>
                      <Input
                        value={mistakePatterns[subject.name]?.join(', ') || ""}
                        onChange={e => handleMistakePatternChange(subject.name, e.target.value)}
                        placeholder="e.g., calculation errors, concept confusion"
                      />
                      <p className="text-xs text-gray-500">Separate multiple patterns with commas</p>
                    </div>
                  </div>
                </div>
              ))}

              {subjects.filter(subject => subject.selected).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                  <p>Please select at least one subject in the Academic Assessment tab.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button onClick={handleBasicInfoSubmit} disabled={isLoading} className="flex-1">
            {isLoading ? "Processing..." : "Continue to Learning Style Assessment"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnhancedStudentAssessment;
