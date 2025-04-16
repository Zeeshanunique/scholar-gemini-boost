
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Subject, TestResult } from "@/types";

interface StudentAssessmentProps {
  onSubmit: (name: string, results: TestResult[]) => void;
  isLoading: boolean;
}

export const StudentAssessment = ({ onSubmit, isLoading }: StudentAssessmentProps) => {
  const [studentName, setStudentName] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([
    // Core Engineering Subjects
    { name: "Calculus & Mathematics", selected: true, minScore: 0, maxScore: 100 },
    { name: "Engineering Physics", selected: true, minScore: 0, maxScore: 100 },
    { name: "Computer Programming", selected: true, minScore: 0, maxScore: 100 },
    { name: "Data Structures & Algorithms", selected: true, minScore: 0, maxScore: 100 },
    { name: "Digital Electronics", selected: true, minScore: 0, maxScore: 100 },
    { name: "Database Management Systems", selected: false, minScore: 0, maxScore: 100 },
    { name: "Computer Networks", selected: false, minScore: 0, maxScore: 100 },
    { name: "Software Engineering", selected: false, minScore: 0, maxScore: 100 },
    { name: "Operating Systems", selected: false, minScore: 0, maxScore: 100 },
    { name: "Computer Architecture", selected: false, minScore: 0, maxScore: 100 },
    // Specialized Engineering Subjects
    { name: "Artificial Intelligence", selected: false, minScore: 0, maxScore: 100 },
    { name: "Machine Learning", selected: false, minScore: 0, maxScore: 100 },
    { name: "Web Development", selected: false, minScore: 0, maxScore: 100 },
    { name: "Mobile App Development", selected: false, minScore: 0, maxScore: 100 },
    { name: "Cloud Computing", selected: false, minScore: 0, maxScore: 100 },
    { name: "Cybersecurity", selected: false, minScore: 0, maxScore: 100 },
  ]);
  const [scores, setScores] = useState<Record<string, number>>({});
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

  const handleSubmit = () => {
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
    
    const testResults: TestResult[] = selectedSubjects.map(subject => ({
      subject: subject.name,
      score: scores[subject.name] || 0,
      totalPossible: subject.maxScore,
    }));
    
    setError("");
    onSubmit(studentName, testResults);
  };

  const displayedSubjects = subjectView === "core" 
    ? subjects.slice(0, 5) 
    : subjects;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Engineering Student Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Enter student name"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Engineering Subjects</Label>
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
                    <div className="flex items-center space-x-2 pt-2">
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
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? "Analyzing..." : "Analyze Learning Needs"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentAssessment;
