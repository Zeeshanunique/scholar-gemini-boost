
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityNote } from "@/components/SecurityNote";
import { setApiKey, getApiKey } from "@/utils/gemini";

interface ApiKeyInputProps {
  onKeySet: () => void;
}

export const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!key.trim()) {
      setError("Please enter a valid API key");
      return;
    }

    try {
      setApiKey(key.trim());
      setError("");
      onKeySet();
    } catch (error) {
      setError("Failed to set API key");
    }
  };

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
          <SecurityNote />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
