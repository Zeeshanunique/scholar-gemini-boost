
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export const SecurityNote = () => {
  return (
    <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
      <ShieldAlert className="h-4 w-4 mt-1" />
      <AlertTitle className="text-amber-800">Security Notice</AlertTitle>
      <AlertDescription className="text-amber-700 text-sm">
        <p>
          Your API key is stored locally in your browser and is never sent to our servers.
          For production use, it's recommended to handle API keys securely on the server side.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNote;
