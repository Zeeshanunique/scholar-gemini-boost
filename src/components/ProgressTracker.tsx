import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, LineChart, Target, TrendingUp, AlertTriangle, BarChart2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Student, TestResult, ProgressMetrics, Milestone } from "@/types";

interface ProgressTrackerProps {
  student: Student;
}

export const ProgressTracker = ({ student }: ProgressTrackerProps) => {
  const [view, setView] = useState<"overview" | "milestones" | "tests">("overview");

  // Group test results by subject
  const testsBySubject: Record<string, TestResult[]> = {};
  
  // Sort test results by date if available
  const sortedTests = [...student.testResults].sort((a, b) => {
    if (a.attemptDate && b.attemptDate) {
      return new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime();
    }
    return 0;
  });
  
  // Group tests by subject
  sortedTests.forEach((test) => {
    if (!testsBySubject[test.subject]) {
      testsBySubject[test.subject] = [];
    }
    testsBySubject[test.subject].push(test);
  });

  // Calculate improvement for each subject
  const subjectImprovements: Record<string, number> = {};
  Object.entries(testsBySubject).forEach(([subject, tests]) => {
    if (tests.length > 1) {
      const oldestScore = (tests[tests.length - 1].score / tests[tests.length - 1].totalPossible) * 100;
      const newestScore = (tests[0].score / tests[0].totalPossible) * 100;
      subjectImprovements[subject] = newestScore - oldestScore;
    } else {
      subjectImprovements[subject] = 0;
    }
  });

  const renderMilestones = () => {
    if (!student.progressMetrics?.milestones || student.progressMetrics.milestones.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
          <p>No milestones have been set yet for this student.</p>
        </div>
      );
    }

    const upcomingMilestones = student.progressMetrics.milestones.filter(
      (milestone) => !milestone.isAchieved
    );
    
    const achievedMilestones = student.progressMetrics.milestones.filter(
      (milestone) => milestone.isAchieved
    );

    return (
      <div className="space-y-6">
        {upcomingMilestones.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" /> Upcoming Milestones
            </h3>
            <div className="space-y-3">
              {upcomingMilestones.map((milestone, index) => renderMilestone(milestone, index))}
            </div>
          </div>
        )}

        {achievedMilestones.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" /> Achieved Milestones
            </h3>
            <div className="space-y-3">
              {achievedMilestones.map((milestone, index) => renderMilestone(milestone, index))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMilestone = (milestone: Milestone, index: number) => {
    const targetDate = new Date(milestone.targetDate);
    const achievedDate = milestone.achievedDate ? new Date(milestone.achievedDate) : null;
    const isOverdue = !milestone.isAchieved && targetDate < new Date();
    
    return (
      <div 
        key={index} 
        className={`border rounded-md p-4 ${
          milestone.isAchieved 
            ? "border-green-200 bg-green-50" 
            : isOverdue 
              ? "border-red-200 bg-red-50"
              : "border-blue-200 bg-blue-50"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{milestone.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`${
              milestone.isAchieved 
                ? "bg-green-100 text-green-800 border-green-200" 
                : isOverdue 
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
            }`}
          >
            {milestone.isAchieved 
              ? "Completed" 
              : isOverdue 
                ? "Overdue" 
                : "Upcoming"}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Target: {targetDate.toLocaleDateString()}
            </span>
          </div>
          
          {milestone.isAchieved && achievedDate && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>
                Achieved: {achievedDate.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTestHistory = () => {
    if (sortedTests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
          <p>No test history available for this student.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(testsBySubject).map(([subject, tests]) => (
          <div key={subject} className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{subject}</h3>
              {tests.length > 1 && (
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${
                    subjectImprovements[subject] > 0 
                      ? "bg-green-100 text-green-800" 
                      : subjectImprovements[subject] < 0 
                        ? "bg-red-100 text-red-800" 
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {subjectImprovements[subject] > 0 && <TrendingUp className="h-3.5 w-3.5 mr-1" />}
                  {subjectImprovements[subject] === 0 && <BarChart2 className="h-3.5 w-3.5 mr-1" />}
                  {subjectImprovements[subject] < 0 && <LineChart className="h-3.5 w-3.5 mr-1" />}
                  {subjectImprovements[subject] > 0 && "+"}
                  {subjectImprovements[subject].toFixed(1)}%
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              {tests.map((test, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      Score: {test.score}/{test.totalPossible} 
                      <span className="text-gray-500 ml-1">
                        ({Math.round((test.score / test.totalPossible) * 100)}%)
                      </span>
                    </div>
                    {test.attemptDate && (
                      <div className="text-xs text-gray-500">
                        {new Date(test.attemptDate).toLocaleDateString()} 
                        <span className="ml-1">
                          ({formatDistanceToNow(new Date(test.attemptDate), { addSuffix: true })})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Progress 
                    value={(test.score / test.totalPossible) * 100}
                    className="h-2"
                  />
                  
                  {test.timeSpent && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Time spent: {test.timeSpent} minutes
                    </div>
                  )}
                  
                  {test.mistakePatterns && test.mistakePatterns.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-600">Common mistakes:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {test.mistakePatterns.map((mistake, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {mistake}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-blue-600" />
          Progress Tracking for {student.name}
        </CardTitle>
        <CardDescription>
          Monitor learning progress over time and upcoming milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        {student.progressMetrics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-sm font-medium text-gray-500">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-5 pb-5">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">
                      {student.progressMetrics.improvementRate}%
                    </span>
                    <span className="text-sm text-gray-500">improvement</span>
                  </div>
                  <Progress 
                    value={student.progressMetrics.improvementRate} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-sm font-medium text-gray-500">Time Tracking</CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-5 pb-5">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">
                      {Math.floor((new Date().getTime() - new Date(student.progressMetrics.startDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                    <span className="text-sm text-gray-500">days in program</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-sm font-medium text-gray-500">Consistency Score</CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-5 pb-5">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">
                      {student.progressMetrics.consistencyScore}/10
                    </span>
                  </div>
                  <Progress 
                    value={(student.progressMetrics.consistencyScore / 10) * 100} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4 px-5">
                  <CardTitle className="text-sm font-medium text-gray-500">Milestones</CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-5 pb-5">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">
                      {student.progressMetrics.milestones.filter(m => m.isAchieved).length}/
                      {student.progressMetrics.milestones.length}
                    </span>
                    <span className="text-sm text-gray-500">completed</span>
                  </div>
                  <Progress 
                    value={(student.progressMetrics.milestones.filter(m => m.isAchieved).length / student.progressMetrics.milestones.length) * 100} 
                    className="h-2 mt-2" 
                  />
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="tests">Test History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" /> Subject Progress
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(testsBySubject).map(([subject, tests]) => {
                      if (tests.length < 2) return null;
                      
                      const oldestScore = (tests[tests.length - 1].score / tests[tests.length - 1].totalPossible) * 100;
                      const newestScore = (tests[0].score / tests[0].totalPossible) * 100;
                      const improvement = newestScore - oldestScore;
                      
                      return (
                        <div key={subject}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{subject}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {oldestScore.toFixed(1)}% → {newestScore.toFixed(1)}%
                              </span>
                              <Badge 
                                variant="outline" 
                                className={`flex items-center text-xs gap-0.5 px-1.5 py-0 ${
                                  improvement > 0 
                                    ? "bg-green-100 text-green-800" 
                                    : improvement < 0 
                                      ? "bg-red-100 text-red-800" 
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {improvement > 0 && "+"}
                                {improvement.toFixed(1)}%
                              </Badge>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                            <div 
                              className={`h-2 rounded-full ${
                                improvement > 0 ? "bg-green-500" : "bg-orange-500"
                              }`}
                              style={{ width: `${Math.max(0, Math.min(100, newestScore))}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {student.progressMetrics.milestones.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" /> Upcoming Milestones
                      </h3>
                      <Button variant="link" size="sm" onClick={() => setView("milestones")}>
                        View all
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {student.progressMetrics.milestones
                        .filter(m => !m.isAchieved)
                        .slice(0, 2)
                        .map((milestone, index) => renderMilestone(milestone, index))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="milestones">
                {renderMilestones()}
              </TabsContent>
              
              <TabsContent value="tests">
                {renderTestHistory()}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Progress Data Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There is no progress tracking data available for this student yet. Complete at least two assessments to begin tracking progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
