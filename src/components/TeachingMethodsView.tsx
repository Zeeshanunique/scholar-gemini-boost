import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Clock, Star, List, Scroll, CheckSquare, AlertCircle } from "lucide-react";
import { getTeachingMethods } from "@/utils/firestore";
import type { TeachingMethod } from "@/types";

interface TeachingMethodsViewProps {
  subject: string;
  learningStyle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TeachingMethodsView = ({ subject, learningStyle, isOpen, onClose }: TeachingMethodsViewProps) => {
  const [methods, setMethods] = useState<TeachingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMethods = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        setError("");
        
        // Fetch teaching methods from Firestore
        const teachingMethods = await getTeachingMethods(subject, learningStyle);
        setMethods(teachingMethods);
      } catch (err) {
        console.error("Error fetching teaching methods:", err);
        setError("Failed to load teaching methods. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [subject, learningStyle, isOpen]);

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 8) return "text-green-500";
    if (effectiveness >= 6) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Innovative Teaching Methods for {subject}
          </DialogTitle>
          <DialogDescription>
            Specialized approaches for {learningStyle} learners that address remedial learning needs
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div className="py-4">
            <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Error loading teaching methods</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <Tabs defaultValue={methods[0]?.id || "1"} className="w-full">
              <TabsList className="mb-4 w-full flex flex-wrap justify-start gap-2">
                {methods.map((method) => (
                  <TabsTrigger key={method.id} value={method.id} className="flex-grow">
                    {method.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {methods.map((method) => (
                <TabsContent key={method.id} value={method.id} className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {method.timeRequired} min session
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className={`h-3.5 w-3.5 ${getEffectivenessColor(method.effectiveness)}`} /> 
                      Effectiveness: {method.effectiveness}/10
                    </Badge>
                  </div>
                
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <List className="h-4 w-4 text-blue-500" /> Implementation Steps
                        </h4>
                        <ol className="space-y-1 ml-5 list-decimal">
                          {method.steps.map((step, i) => (
                            <li key={i} className="text-sm">{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Scroll className="h-4 w-4 text-blue-500" /> Required Resources
                        </h4>
                        <ul className="space-y-1 ml-5 list-disc">
                          {method.resources.map((resource, i) => (
                            <li key={i} className="text-sm">{resource}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <CheckSquare className="h-4 w-4 text-blue-500" /> Benefits
                        </h4>
                        <ul className="space-y-1 ml-5 list-disc">
                          {method.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TeachingMethodsView;
