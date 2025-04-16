
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Subject, TestResult } from "@/types";

interface StudentAssessmentProps {
  onSubmit: (name: string, results: TestResult[]) => void;
  isLoading: boolean;
}

export const StudentAssessment = ({ onSubmit, isLoading }: StudentAssessmentProps) => {
  const [studentName, setStudentName] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "Mathematics", selected: true, minScore: 0, maxScore: 100 },
    { name: "Science", selected: true, minScore: 0, maxScore: 100 },
    { name: "Language Arts", selected: true, minScore: 0, maxScore: 100 },
    { name: "Social Studies", selected: true, minScore: 0, maxScore: 100 },
  ]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Student Assessment</CardTitle>
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
          
          <div className="space-y-4">
            <Label>Subjects</Label>
            {subjects.map((subject, index) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`subject-${index}`}
                    checked={subject.selected}
                    onCheckedChange={() => handleSubjectToggle(index)}
                  />
                  <Label htmlFor={`subject-${index}`}>{subject.name}</Label>
                </div>
                
                {subject.selected && (
                  <div className="pl-6 flex items-center space-x-2">
                    <Input
                      type="number"
                      min={subject.minScore}
                      max={subject.maxScore}
                      value={scores[subject.name] || ""}
                      onChange={e => handleScoreChange(subject.name, e.target.value)}
                      placeholder="Score"
                      className="w-20"
                    />
                    <span>out of</span>
                    <Input
                      type="number"
                      value={subject.maxScore}
                      readOnly
                      className="w-20 bg-gray-100"
                    />
                  </div>
                )}
              </div>
            ))}
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
