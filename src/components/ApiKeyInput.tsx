
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityNote } from "@/components/SecurityNote";
import { setApiKey, getApiKey, hasApiKey, testApiConnection } from "@/utils/gemini";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ApiKeyInputProps {
  onKeySet: () => void;
}

export const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists in environment variables or localStorage
    const checkApiKey = async () => {
      if (hasApiKey()) {
        setIsChecking(true);
        try {
          const isValid = await testApiConnection();
          if (isValid) {
            toast({
              title: "API Key Detected",
              description: "Using API key from environment variables",
              variant: "default"
            });
            onKeySet();
          } else {
            toast({
              title: "API Key Invalid",
              description: "The provided API key is invalid or expired. Please enter a valid key.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error checking API key:", error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    checkApiKey();
  }, [onKeySet, toast]);

  const handleSubmit = async () => {
    if (!key.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setApiKey(key.trim());
      
      // Test the API connection
      const isValid = await testApiConnection();
      if (isValid) {
        toast({
          title: "API Key Verified",
          description: "Your API key has been set successfully",
          variant: "default"
        });
        onKeySet();
      } else {
        setError("The API key appears to be invalid. Please check and try again.");
        toast({
          title: "Invalid API Key",
          description: "The API key you entered could not be verified",
          variant: "destructive"
        });
      }
    } catch (error) {
      setError("Failed to verify API key. Please check your internet connection and try again.");
      toast({
        title: "Verification Failed",
        description: "Could not verify the API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center pt-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-center text-gray-600">Checking for API key...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Google Gemini API Key</CardTitle>
        <CardDescription>
          Enter your Google Gemini API key to use the AI features. You can get an API key from{" "}
          <a 
            href="https://ai.google.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Google AI Studio
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <SecurityNote variant="warning" />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Save API Key"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
