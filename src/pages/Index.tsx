
import { useState } from "react";
import { Link } from "react-router-dom";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { StudentAssessment } from "@/components/StudentAssessment";
import { LearningRecommendations } from "@/components/LearningRecommendations";
import { getApiKey, generateLearningRecommendations } from "@/utils/gemini";
import type { TestResult, LearningRecommendation } from "@/types";
import { BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [apiKeySet, setApiKeySet] = useState(!!getApiKey());
  const [currentStep, setCurrentStep] = useState<'apiKey' | 'assessment' | 'recommendations'>(
    getApiKey() ? 'assessment' : 'apiKey'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [error, setError] = useState("");

  const handleApiKeySet = () => {
    setApiKeySet(true);
    setCurrentStep('assessment');
  };

  const handleAssessmentSubmit = async (name: string, results: TestResult[]) => {
    setStudentName(name);
    setIsLoading(true);
    setError("");
    
    try {
      const recommendations = await generateLearningRecommendations(name, results);
      setRecommendations(recommendations);
      setCurrentStep('recommendations');
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError(err instanceof Error ? err.message : "Failed to generate recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAssessment = () => {
    setStudentName("");
    setRecommendations([]);
    setCurrentStep('assessment');
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
              <div className="text-sm text-gray-500">Powered by Google Gemini</div>
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {currentStep === 'apiKey' && (
            <ApiKeyInput onKeySet={handleApiKeySet} />
          )}

          {currentStep === 'assessment' && (
            <>
              <div className="text-center max-w-2xl mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Student Assessment
                </h2>
                <p className="text-gray-600">
                  Enter the student's name and assessment scores to receive personalized learning recommendations
                  powered by AI analysis.
                </p>
              </div>
              
              <StudentAssessment onSubmit={handleAssessmentSubmit} isLoading={isLoading} />
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
                  {error}
                </div>
              )}
            </>
          )}

          {currentStep === 'recommendations' && (
            <LearningRecommendations
              studentName={studentName}
              recommendations={recommendations}
              onReset={resetAssessment}
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Smart Learning Pathways © {new Date().getFullYear()} - Identifying learning needs and providing personalized recommendations
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
