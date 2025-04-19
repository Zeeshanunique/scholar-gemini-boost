import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Users, 
  BookMarked, 
  TrendingUp, 
  Lightbulb, 
  Brain, 
  AlertTriangle, 
  Calendar,
  Heart,
  Award,
  BookOpen
} from "lucide-react";
import type { ClassAnalytics, Student } from "@/types";

interface TeacherDashboardProps {
  analytics: ClassAnalytics;
  students: Student[];
  onViewStudentDetails: (studentId: string) => void;
}

export const TeacherDashboard = ({ analytics, students, onViewStudentDetails }: TeacherDashboardProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "improvement" | "risk">("risk");

  const getImprovementColor = (improvementRate: number) => {
    if (improvementRate >= 15) return "text-green-600";
    if (improvementRate >= 5) return "text-blue-600";
    if (improvementRate >= 0) return "text-yellow-600";
    return "text-red-600";
  };

  const getImprovementBadgeColor = (improvementRate: number) => {
    if (improvementRate >= 15) return "bg-green-100 text-green-800 border-green-200";
    if (improvementRate >= 5) return "bg-blue-100 text-blue-800 border-blue-200";
    if (improvementRate >= 0) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getRiskLevel = (student: Student): "high" | "medium" | "low" => {
    // No progress metrics means we don't have enough data
    if (!student.progressMetrics) return "medium";

    // Low improvement rate is high risk
    if (student.progressMetrics.improvementRate < 5) return "high";
    
    // Low behavioral metrics are high risk
    if (student.behavioralMetrics) {
      const { motivationLevel, anxietyLevel, homeworkCompletion } = student.behavioralMetrics;
      if (motivationLevel < 4 || anxietyLevel > 7 || homeworkCompletion < 40) return "high";
    }
    
    // Check test scores
    const lowScores = student.testResults.filter(
      test => (test.score / test.totalPossible) * 100 < 60
    );
    
    if (lowScores.length > 2) return "high";
    if (lowScores.length > 0) return "medium";
    
    return "low";
  };

  const getRiskBadge = (risk: "high" | "medium" | "low") => {
    switch (risk) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
    }
  };

  // Sort and filter students based on current selections
  const filteredStudents = students
    .filter(student => {
      if (selectedSubject === "all") return true;
      return student.testResults.some(test => test.subject === selectedSubject);
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "improvement") {
        const aImprovement = a.progressMetrics?.improvementRate || 0;
        const bImprovement = b.progressMetrics?.improvementRate || 0;
        return bImprovement - aImprovement;
      } else { // sort by risk
        const aRisk = getRiskLevel(a);
        const bRisk = getRiskLevel(b);
        // Convert risk levels to numeric values for sorting
        const riskValues = { high: 3, medium: 2, low: 1 };
        return riskValues[aRisk] - riskValues[bRisk];
      }
    });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{analytics.totalStudents}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Slow Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{Math.round(analytics.totalStudents * analytics.slowLearnerPercentage / 100)}</span>
                <span className="text-sm text-gray-500 ml-2">({analytics.slowLearnerPercentage}%)</span>
              </div>
              <Progress value={analytics.slowLearnerPercentage} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{analytics.averageImprovement}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Effective Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">{analytics.mostEffectiveInterventions.length}</span>
              <span className="text-sm text-gray-500 ml-2">methods</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="h-4 w-4 mr-2" />
            Subject Analysis
          </TabsTrigger>
          <TabsTrigger value="interventions">
            <Brain className="h-4 w-4 mr-2" />
            Interventions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {Array.from(
                    new Set(
                      students.flatMap(student => 
                        student.testResults.map(test => test.subject)
                      )
                    )
                  ).map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Risk Level</SelectItem>
                  <SelectItem value="improvement">Improvement</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Low Risk</span>
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[40px] w-[40px] text-center">#</TableHead>
                  <TableHead className="min-w-[140px] w-[180px]">Name</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Learning Style</TableHead>
                  <TableHead>Improvement</TableHead>
                  <TableHead>Latest Scores</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, i) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center font-semibold">{i + 1}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">{student.name}</TableCell>
                    <TableCell>{getRiskBadge(getRiskLevel(student))}</TableCell>
                    <TableCell>
                      {student.learningStyle ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          {student.learningStyle}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">Not assessed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.progressMetrics ? (
                        <div className="flex items-center gap-1">
                          <span className={getImprovementColor(student.progressMetrics.improvementRate)}>
                            {student.progressMetrics.improvementRate > 0 && '+'}
                            {student.progressMetrics.improvementRate}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No data</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.testResults.slice(0, 2).map((test, index) => {
                          const percentage = Math.round((test.score / test.totalPossible) * 100);
                          return (
                            <Badge 
                              key={index} 
                              variant="outline"
                              className={`text-xs ${
                                percentage >= 70 
                                  ? "bg-green-100 text-green-800" 
                                  : percentage >= 50 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {test.subject.split(' ')[0]}: {percentage}%
                            </Badge>
                          );
                        })}
                        {student.testResults.length > 2 && (
                          <Badge variant="outline">+{student.testResults.length - 2} more</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => onViewStudentDetails(student.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No students found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Challenged Subject Areas</CardTitle>
              <CardDescription>
                Subjects where students are most frequently struggling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.mostChallengedSubjects.map((subject, index) => {
                  // Calculate how many students are struggling with this subject
                  const studentsStruggling = students.filter(student =>
                    student.testResults.some(
                      test => test.subject === subject && (test.score / test.totalPossible) * 100 < 60
                    )
                  ).length;
                  
                  const percentage = (studentsStruggling / analytics.totalStudents) * 100;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{subject}</span>
                        <span className="text-sm text-gray-500">
                          {studentsStruggling} students struggling ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                <h3 className="font-medium flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recommended Focus Areas
                </h3>
                <ul className="list-disc ml-5 space-y-1 text-yellow-800">
                  {analytics.mostChallengedSubjects.slice(0, 2).map((subject, index) => (
                    <li key={index}>
                      Prioritize remedial sessions for {subject}
                    </li>
                  ))}
                  <li>
                    Consider curriculum adjustments for core concepts in these subjects
                  </li>
                  <li>
                    Integrate more {(() => {
                      const learningStyleCounts = students.filter(s => s.learningStyle).reduce((acc, student) => {
                        if (!acc[student.learningStyle!]) acc[student.learningStyle!] = 0;
                        acc[student.learningStyle!]++;
                        return acc;
                      }, {} as Record<string, number>);
                      // Get the most common learning style
                      const sortedStyles = Object.entries(learningStyleCounts).sort((a, b) => b[1] - a[1]);
                      return sortedStyles[0]?.[0] || "multimodal";
                    })()} learning activities
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Effective Interventions</CardTitle>
              <CardDescription>
                Teaching approaches that have shown the best results for slow learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analytics.mostEffectiveInterventions.map((intervention, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                        {intervention}
                      </h3>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        High Impact
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-md">
                        <Brain className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-sm font-medium">Cognitive Gain</span>
                        <span className="text-lg font-bold">+18%</span>
                      </div>
                      
                      <div className="flex flex-col items-center p-3 bg-green-50 rounded-md">
                        <Calendar className="h-5 w-5 text-green-500 mb-1" />
                        <span className="text-sm font-medium">Consistency</span>
                        <span className="text-lg font-bold">+22%</span>
                      </div>
                      
                      <div className="flex flex-col items-center p-3 bg-purple-50 rounded-md">
                        <Heart className="h-5 w-5 text-purple-500 mb-1" />
                        <span className="text-sm font-medium">Engagement</span>
                        <span className="text-lg font-bold">+15%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Recommended Teaching Approaches</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analytics.recommendedTeachingApproaches.map((approach, index) => (
                    <li key={index}>{approach}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
