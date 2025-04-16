
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Book, BookOpen, FileText, Film, Lightbulb, Mic, MonitorPlay, PenTool, Brain, Heading1, Trophy, BookMarked, Clock, AlertTriangle, GanttChart, Sparkles, Dumbbell, ArrowRight } from "lucide-react";
import type { LearningRecommendation, PracticeExercise } from "@/types";

interface LearningRecommendationsProps {
  studentName: string;
  recommendations: LearningRecommendation[];
  onReset: () => void;
  onViewTeachingMethods?: (subject: string, learningStyle: string) => void;
}

export const LearningRecommendations = ({ 
  studentName, 
  recommendations,
  onReset,
  onViewTeachingMethods
}: LearningRecommendationsProps) => {
  const [activeTab, setActiveTab] = useState(recommendations.length > 0 ? recommendations[0].subject : "");
  
  if (!recommendations.length) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>No Recommendations Needed</CardTitle>
          <CardDescription>
            {studentName} is performing well in all subjects. No specific recommendations needed at this time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onReset} className="mt-4">Assess Another Student</Button>
        </CardContent>
      </Card>
    );
  }

  const getLearningStyleIcon = (style: string) => {
    switch (style.toLowerCase()) {
      case "visual":
        return <Film className="h-5 w-5" />;
      case "auditory":
        return <Mic className="h-5 w-5" />;
      case "reading/writing":
        return <FileText className="h-5 w-5" />;
      case "kinesthetic":
        return <PenTool className="h-5 w-5" />;
      case "multimodal":
        return <Brain className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInterventionUrgencyLevel = (rec: LearningRecommendation) => {
    // If no weaknesses or conceptual gaps, low urgency
    if ((!rec.weaknesses || rec.weaknesses.length === 0) && 
        (!rec.conceptualGaps || rec.conceptualGaps.length === 0)) {
      return { level: "low", text: "Low Priority", color: "bg-green-100 text-green-800" };
    }
    
    // If estimated time to improve is provided and is greater than 8 weeks, high urgency
    if (rec.estimatedTimeToImprove && rec.estimatedTimeToImprove > 8) {
      return { level: "high", text: "High Priority", color: "bg-red-100 text-red-800" };
    }
    
    // If has conceptual gaps, medium urgency
    if (rec.conceptualGaps && rec.conceptualGaps.length > 0) {
      return { level: "medium", text: "Medium Priority", color: "bg-yellow-100 text-yellow-800" };
    }
    
    // Default to medium
    return { level: "medium", text: "Medium Priority", color: "bg-yellow-100 text-yellow-800" };
  };

  const renderPracticeExercise = (exercise: PracticeExercise, index: number) => {
    return (
      <div key={index} className={`border rounded-md p-4 mb-4 ${getDifficultyColor(exercise.difficulty)}`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-md">{exercise.title}</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {exercise.estimatedTime} min
            </Badge>
          </div>
        </div>
        <p className="text-sm mb-2">{exercise.description}</p>
        <div className="text-xs flex items-center gap-1 mt-2">
          <span className="font-semibold">Target Skill:</span> {exercise.targetSkill}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-6 w-6" />
          Personalized Learning Plan for {studentName}
        </CardTitle>
        <CardDescription>
          Tailored remedial strategies and interventions based on comprehensive assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={recommendations[0].subject} 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 flex flex-wrap">
            {recommendations.map((rec) => {
              const urgency = getInterventionUrgencyLevel(rec);
              return (
                <TabsTrigger key={rec.subject} value={rec.subject} className="relative">
                  {rec.subject}
                  {urgency.level !== "low" && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${urgency.level === "high" ? "bg-red-500" : "bg-yellow-500"}`}></span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {recommendations.map((rec) => {
            const urgency = getInterventionUrgencyLevel(rec);
            
            return (
              <TabsContent key={rec.subject} value={rec.subject} className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base">
                      {getLearningStyleIcon(rec.learningStyle)}
                      {rec.learningStyle} Learner
                    </Badge>
                    
                    <Badge variant="outline" className={`flex items-center gap-1 ${urgency.color}`}>
                      <AlertTriangle className={`h-4 w-4 ${urgency.level === "high" ? "text-red-500" : urgency.level === "medium" ? "text-yellow-500" : "text-green-500"}`} />
                      {urgency.text}
                    </Badge>
                    
                    {rec.estimatedTimeToImprove && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <GanttChart className="h-4 w-4" /> 
                        Est. {rec.estimatedTimeToImprove} {rec.estimatedTimeToImprove === 1 ? "week" : "weeks"} to improve
                      </Badge>
                    )}
                  </div>
                  
                  {onViewTeachingMethods && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewTeachingMethods(rec.subject, rec.learningStyle)}
                      className="whitespace-nowrap"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Teaching Methods
                    </Button>
                  )}
                </div>

                {rec.conceptualGaps && rec.conceptualGaps.length > 0 && (
                  <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Critical Conceptual Gaps</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        {rec.conceptualGaps.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="remedial-techniques">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Remedial Teaching Techniques
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {rec.techniques.map((technique, i) => (
                          <li key={i}>{technique}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {rec.remedialApproaches && rec.remedialApproaches.length > 0 && (
                    <AccordionItem value="remedial-approaches">
                      <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-purple-500" />
                          Specialized Remedial Approaches
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          {rec.remedialApproaches.map((approach, i) => (
                            <li key={i}>{approach}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  <AccordionItem value="resources">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Book className="h-5 w-5 text-blue-500" />
                        Recommended Resources
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {rec.resources.map((resource, i) => (
                          <li key={i}>{resource}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {rec.practiceExercises && rec.practiceExercises.length > 0 && (
                    <AccordionItem value="practice-exercises">
                      <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-5 w-5 text-indigo-500" />
                          Practice Exercises
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {rec.practiceExercises.map((exercise, i) => 
                            renderPracticeExercise(exercise, i)
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  <AccordionItem value="strengths-weaknesses">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-green-500" />
                        Strengths & Areas for Improvement
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-green-500" />
                            Strengths to Build On
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {rec.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Heading1 className="h-4 w-4 text-orange-500" />
                            Areas Needing Improvement
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {rec.weaknesses.map((weakness, i) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex justify-between items-center mt-8">
          <Button onClick={onReset} variant="outline">
            Assess Another Student
          </Button>
          
          <Button onClick={() => window.print()}>
            Print Learning Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningRecommendations;
