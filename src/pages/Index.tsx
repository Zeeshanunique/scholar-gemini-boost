
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { EnhancedStudentAssessment } from "@/components/EnhancedStudentAssessment";
import { LearningRecommendations } from "@/components/LearningRecommendations";
import { TeachingMethodsView } from "@/components/TeachingMethodsView";
import { getApiKey, generateLearningRecommendations, hasApiKey } from "@/utils/gemini";
import type { TestResult, LearningRecommendation, BehavioralMetrics } from "@/types";
import { BookOpen, GraduationCap, Settings, Brain, Sparkles, FileText, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [apiKeySet, setApiKeySet] = useState(hasApiKey());
  const [currentStep, setCurrentStep] = useState<'apiKey' | 'assessment' | 'recommendations' | 'teaching-methods'>(
    hasApiKey() ? 'assessment' : 'apiKey'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [error, setError] = useState("");
  const [showTeachingMethods, setShowTeachingMethods] = useState(false);
  const [teachingMethodsSubject, setTeachingMethodsSubject] = useState("");
  const [teachingMethodsLearningStyle, setTeachingMethodsLearningStyle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is set in localStorage from a previous session
    const storedAPIKey = localStorage.getItem("gemini_api_key");
    if (storedAPIKey && !hasApiKey()) {
      try {
        toast({
          title: "API Key Restored",
          description: "Using previously saved API key",
          variant: "default"
        });
      } catch (error) {
        console.error("Error restoring API key:", error);
      }
    }
  }, [toast]);

  const handleApiKeySet = () => {
    setApiKeySet(true);
    setCurrentStep('assessment');
    toast({
      title: "Ready to Assess",
      description: "You can now start a comprehensive student assessment",
    });
  };

  const handleAssessmentSubmit = async (
    name: string, 
    results: TestResult[], 
    behavioralMetrics?: BehavioralMetrics, 
    learningStyle?: string
  ) => {
    setStudentName(name);
    setIsLoading(true);
    setError("");
    
    toast({
      title: "Processing Assessment",
      description: "Analyzing data and generating personalized remedial strategies...",
    });
    
    try {
      // Using the enhanced Gemini API with behavioral metrics and learning style
      const recommendations = await generateLearningRecommendations(name, results, behavioralMetrics, learningStyle);
      setRecommendations(recommendations);
      setCurrentStep('recommendations');
      
      toast({
        title: "Analysis Complete",
        description: "Personalized remedial teaching plan has been generated successfully",
        variant: "default"
      });
    } catch (err) {
      console.error("Error generating recommendations:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate recommendations";
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAssessment = () => {
    setStudentName("");
    setRecommendations([]);
    setCurrentStep('assessment');
    
    toast({
      title: "Assessment Reset",
      description: "Start a new student assessment",
    });
  };

  const resetApiKey = () => {
    setApiKeySet(false);
    setCurrentStep('apiKey');
  };

  const handleViewTeachingMethods = (subject: string, learningStyle: string) => {
    setTeachingMethodsSubject(subject);
    setTeachingMethodsLearningStyle(learningStyle);
    setShowTeachingMethods(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Learning Pathways</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Powered by Google Gemini 1.5</div>
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
              {/* {apiKeySet && (
                <Button variant="outline" size="sm" onClick={resetApiKey}>
                  <Settings className="h-4 w-4 mr-2" />
                  API Settings
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {currentStep === 'apiKey' ? (
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center max-w-2xl mb-4">
              <h2 className="text-2xl font-bold mb-4">AI-Powered Learning Assessment</h2>
              <p className="text-gray-600">
                Identify slow learners and provide personalized remedial teaching strategies using advanced AI analysis.
              </p>
            </div>
            
            <ApiKeyInput onKeySet={handleApiKeySet} />
            
            <div className="w-full max-w-3xl mt-8">
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      Learning Styles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Identifies each student's optimal learning style to tailor teaching methods accordingly.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      Detailed Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Collects comprehensive academic and behavioral data to build a complete student profile.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Remedial Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Generates personalized learning plans with innovative teaching methods for slow learners.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : currentStep === 'assessment' ? (
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center max-w-2xl mb-4">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Comprehensive Learning Assessment
              </h2>
              <p className="text-gray-600">
                Enter student information and assessment data to identify learning needs and generate personalized remedial strategies.
              </p>
            </div>
            
            <EnhancedStudentAssessment onSubmit={handleAssessmentSubmit} isLoading={isLoading} />
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error Processing Assessment</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : currentStep === 'recommendations' ? (
          <div className="flex flex-col items-center space-y-8">
            <LearningRecommendations
              studentName={studentName}
              recommendations={recommendations}
              onReset={resetAssessment}
              onViewTeachingMethods={handleViewTeachingMethods}
            />
            
            <div className="flex justify-center w-full">
              <Card className="w-full max-w-3xl bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">To get the most out of this personalized learning plan:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>Implement recommended strategies</strong> in sequence, starting with the highest priority areas
                    </li>
                    <li>
                      <strong>Track progress</strong> regularly using the provided practice exercises
                    </li>
                    <li>
                      <strong>Adapt teaching methods</strong> based on student response and engagement
                    </li>
                    <li>
                      <strong>Reassess</strong> after 4-6 weeks to measure improvement and adjust strategies
                    </li>
                  </ol>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full">
                      View Teacher Dashboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Smart Learning Pathways © {new Date().getFullYear()} - Identifying slow learners for remedial teaching and capacity building
          </p>
          <div className="flex justify-center mt-2 space-x-4 text-sm text-gray-500">
            <span>Powered by Google Gemini 1.5</span>
            <span>•</span>
            <span>AI-Enhanced Learning Analytics</span>
          </div>
        </div>
      </footer>

      {/* Teaching Methods Dialog */}
      <TeachingMethodsView 
        subject={teachingMethodsSubject}
        learningStyle={teachingMethodsLearningStyle}
        isOpen={showTeachingMethods}
        onClose={() => setShowTeachingMethods(false)}
      />
    </div>
  );
};

export default Index;
