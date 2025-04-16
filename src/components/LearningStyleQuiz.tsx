import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { generateLearningStyleQuiz } from "@/utils/gemini";
import { LEARNING_STYLES } from "@/types";
import type { LearningStyleQuestion } from "@/types";
import { BookOpen, Brain, FileText, Film, Mic, PenTool } from "lucide-react";

interface LearningStyleQuizProps {
  onComplete: (learningStyle: string) => void;
}

export const LearningStyleQuiz = ({ onComplete }: LearningStyleQuizProps) => {
  const [questions, setQuestions] = useState<LearningStyleQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Record<string, number>>({});
  const [dominantStyle, setDominantStyle] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const quizQuestions = await generateLearningStyleQuiz();
        setQuestions(quizQuestions);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load the learning style quiz. Please try again.");
        setIsLoading(false);
        console.error("Error fetching learning style quiz:", err);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionSelect = (style: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = style;
    setSelectedOptions(updatedOptions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    // Count frequency of each learning style
    const styleCounts: Record<string, number> = {};
    
    LEARNING_STYLES.forEach(style => {
      styleCounts[style] = 0;
    });

    selectedOptions.forEach(style => {
      if (style) {
        styleCounts[style] = (styleCounts[style] || 0) + 1;
      }
    });

    // Find the dominant learning style
    let maxCount = 0;
    let dominant = "";
    
    Object.entries(styleCounts).forEach(([style, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = style;
      }
    });

    // If two or more styles have the same count and it's the max, label as "Multimodal"
    const maxStyles = Object.entries(styleCounts)
      .filter(([_, count]) => count === maxCount)
      .map(([style]) => style);
    
    if (maxStyles.length > 1) {
      dominant = "Multimodal";
    }

    setResults(styleCounts);
    setDominantStyle(dominant);
    onComplete(dominant);
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case "Visual":
        return <Film className="h-5 w-5" />;
      case "Auditory":
        return <Mic className="h-5 w-5" />;
      case "Reading/Writing":
        return <FileText className="h-5 w-5" />;
      case "Kinesthetic":
        return <PenTool className="h-5 w-5" />;
      case "Multimodal":
        return <Brain className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Learning Style Assessment</CardTitle>
          <CardDescription>
            Loading your personalized learning style assessment...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            We encountered a problem while loading your assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Learning Style Assessment</CardTitle>
          <CardDescription>
            No questions available. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  if (dominantStyle) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStyleIcon(dominantStyle)}
            Your Learning Style: {dominantStyle}
          </CardTitle>
          <CardDescription>
            Based on your responses, we've identified your primary learning style.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {LEARNING_STYLES.map(style => (
              <div key={style} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getStyleIcon(style)}
                    <Label className="font-medium">{style}</Label>
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.round((results[style] || 0) / questions.length * 100)}%
                  </span>
                </div>
                <Progress value={(results[style] || 0) / questions.length * 100} />
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">What this means:</h3>
            {dominantStyle === "Visual" && (
              <p>You learn best through visual elements like images, diagrams, and demonstrations. Use color-coding, mind maps, and videos to enhance your learning.</p>
            )}
            {dominantStyle === "Auditory" && (
              <p>You learn best through listening and speaking. Try recording lectures, participating in discussions, and explaining concepts out loud.</p>
            )}
            {dominantStyle === "Reading/Writing" && (
              <p>You learn best through written words. Take detailed notes, rewrite key concepts, and use written summaries to reinforce your learning.</p>
            )}
            {dominantStyle === "Kinesthetic" && (
              <p>You learn best through hands-on experiences. Engage in practical activities, experiments, and physical movement to enhance your understanding.</p>
            )}
            {dominantStyle === "Multimodal" && (
              <p>You're adaptable and can learn effectively through multiple methods. Use a combination of learning techniques to reinforce your understanding.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Learning Style Assessment</CardTitle>
        <CardDescription>
          Answer these questions to discover your optimal learning style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round((currentQuestionIndex / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentQuestionIndex / questions.length) * 100} />
        </div>

        <div className="py-2">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          <RadioGroup 
            value={selectedOptions[currentQuestionIndex] || ""}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 border p-3 rounded-md ${
                  selectedOptions[currentQuestionIndex] === option.style
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => handleOptionSelect(option.style)}
              >
                <RadioGroupItem
                  value={option.style}
                  id={`option-${index}`}
                  checked={selectedOptions[currentQuestionIndex] === option.style}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedOptions[currentQuestionIndex]}
        >
          {currentQuestionIndex === questions.length - 1 ? "Complete" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningStyleQuiz;
