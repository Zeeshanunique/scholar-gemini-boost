import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BehavioralMetrics } from "@/types";
import { Brain, BookOpen, Users, Clock, UserPlus, ThumbsUp, Zap, AlertCircle } from "lucide-react";

interface BehavioralMetricsInputProps {
  onSubmit: (metrics: BehavioralMetrics) => void;
  initialMetrics?: BehavioralMetrics;
}

export const BehavioralMetricsInput = ({ onSubmit, initialMetrics }: BehavioralMetricsInputProps) => {
  const [metrics, setMetrics] = useState<BehavioralMetrics>(
    initialMetrics || {
      classParticipation: 5,
      homeworkCompletion: 50,
      attentionSpan: 15,
      peerCollaboration: 5,
      frustrationTolerance: 5,
      motivationLevel: 5,
      anxietyLevel: 5,
      notes: ""
    }
  );

  const handleSubmit = () => {
    onSubmit(metrics);
  };

  const updateMetric = (name: keyof BehavioralMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Behavioral Assessment
        </CardTitle>
        <CardDescription>
          Provide information about the student's behavioral patterns to help customize learning recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                <h3 className="font-medium">Class Participation</h3>
              </div>
              <span className="text-sm font-medium">{metrics.classParticipation}/10</span>
            </div>
            <Slider
              value={[metrics.classParticipation]}
              min={1}
              max={10}
              step={1}
              onValueChange={([value]) => updateMetric("classParticipation", value)}
            />
            <p className="text-sm text-gray-500">How actively does the student participate in classroom activities and discussions?</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                <h3 className="font-medium">Homework Completion</h3>
              </div>
              <span className="text-sm font-medium">{metrics.homeworkCompletion}%</span>
            </div>
            <Slider
              value={[metrics.homeworkCompletion]}
              min={0}
              max={100}
              step={5}
              onValueChange={([value]) => updateMetric("homeworkCompletion", value)}
            />
            <p className="text-sm text-gray-500">What percentage of assigned homework does the student typically complete?</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium">Attention Span</h3>
              </div>
              <span className="text-sm font-medium">{metrics.attentionSpan} minutes</span>
            </div>
            <Slider
              value={[metrics.attentionSpan]}
              min={5}
              max={60}
              step={5}
              onValueChange={([value]) => updateMetric("attentionSpan", value)}
            />
            <p className="text-sm text-gray-500">How long can the student typically maintain focus on a task?</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-600" />
                <h3 className="font-medium">Peer Collaboration</h3>
              </div>
              <span className="text-sm font-medium">{metrics.peerCollaboration}/10</span>
            </div>
            <Slider
              value={[metrics.peerCollaboration]}
              min={1}
              max={10}
              step={1}
              onValueChange={([value]) => updateMetric("peerCollaboration", value)}
            />
            <p className="text-sm text-gray-500">How effectively does the student work with peers on group activities?</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-yellow-600" />
                <h3 className="font-medium">Frustration Tolerance</h3>
              </div>
              <span className="text-sm font-medium">{metrics.frustrationTolerance}/10</span>
            </div>
            <Slider
              value={[metrics.frustrationTolerance]}
              min={1}
              max={10}
              step={1}
              onValueChange={([value]) => updateMetric("frustrationTolerance", value)}
            />
            <p className="text-sm text-gray-500">How well does the student handle challenging tasks without becoming frustrated?</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <h3 className="font-medium">Motivation Level</h3>
              </div>
              <span className="text-sm font-medium">{metrics.motivationLevel}/10</span>
            </div>
            <Slider
              value={[metrics.motivationLevel]}
              min={1}
              max={10}
              step={1}
              onValueChange={([value]) => updateMetric("motivationLevel", value)}
            />
            <p className="text-sm text-gray-500">How motivated is the student to learn and improve?</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <h3 className="font-medium">Anxiety Level</h3>
              </div>
              <span className="text-sm font-medium">{metrics.anxietyLevel}/10</span>
            </div>
            <Slider
              value={[metrics.anxietyLevel]}
              min={1}
              max={10}
              step={1}
              onValueChange={([value]) => updateMetric("anxietyLevel", value)}
            />
            <p className="text-sm text-gray-500">How anxious does the student appear during learning activities or assessments?</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Additional Notes</h3>
            <Textarea 
              placeholder="Any other observations about the student's behavior or learning patterns..."
              value={metrics.notes}
              onChange={(e) => updateMetric("notes", e.target.value as any)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Submit Behavioral Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BehavioralMetricsInput;
