
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, BookOpen, FileText, Film, Lightbulb, Mic, MonitorPlay, PenTool, Brain, Heading1, Trophy, BookMarked } from "lucide-react";
import type { LearningRecommendation } from "@/types";

interface LearningRecommendationsProps {
  studentName: string;
  recommendations: LearningRecommendation[];
  onReset: () => void;
}

export const LearningRecommendations = ({ 
  studentName, 
  recommendations,
  onReset
}: LearningRecommendationsProps) => {
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

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-6 w-6" />
          Learning Recommendations for {studentName}
        </CardTitle>
        <CardDescription>
          Personalized learning strategies based on assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={recommendations[0].subject}>
          <TabsList className="mb-4">
            {recommendations.map((rec) => (
              <TabsTrigger key={rec.subject} value={rec.subject}>
                {rec.subject}
              </TabsTrigger>
            ))}
          </TabsList>

          {recommendations.map((rec) => (
            <TabsContent key={rec.subject} value={rec.subject} className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 text-base">
                  {getLearningStyleIcon(rec.learningStyle)}
                  {rec.learningStyle} Learner
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Recommended Learning Techniques
                  </h3>
                  <Separator className="my-2" />
                  <ul className="list-disc pl-5 space-y-2">
                    {rec.techniques.map((technique, i) => (
                      <li key={i}>{technique}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Book className="h-5 w-5 text-blue-500" />
                    Recommended Resources
                  </h3>
                  <Separator className="my-2" />
                  <ul className="list-disc pl-5 space-y-2">
                    {rec.resources.map((resource, i) => (
                      <li key={i}>{resource}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-500" />
                      Strengths
                    </h3>
                    <Separator className="my-2" />
                    <ul className="list-disc pl-5 space-y-2">
                      {rec.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Heading1 className="h-5 w-5 text-orange-500" />
                      Areas for Improvement
                    </h3>
                    <Separator className="my-2" />
                    <ul className="list-disc pl-5 space-y-2">
                      {rec.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Button onClick={onReset} className="mt-8">Assess Another Student</Button>
      </CardContent>
    </Card>
  );
};

export default LearningRecommendations;
