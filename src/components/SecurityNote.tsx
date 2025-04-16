
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export const SecurityNote = ({ variant = "warning" }: { variant?: "warning" | "info" | "danger" }) => {
  const styles = {
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "text-amber-800",
      description: "text-amber-700"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-800",
      description: "text-blue-700"
    },
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-800",
      description: "text-red-700"
    }
  };

  const style = styles[variant];

  return (
    <Alert className={`mt-4 ${style.bg} ${style.title} ${style.border}`}>
      <ShieldAlert className="h-4 w-4 mt-1" />
      <AlertTitle className={style.title}>Security Notice</AlertTitle>
      <AlertDescription className={`${style.description} text-sm`}>
        <p>
          Your API key is stored locally in your browser and is never sent to our servers.
          For production use, it's recommended to handle API keys securely on the server side.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityNote;
