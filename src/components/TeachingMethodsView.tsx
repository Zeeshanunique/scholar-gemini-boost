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
import { generateTeachingMethods } from "@/utils/gemini";
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
        const teachingMethods = await generateTeachingMethods(learningStyle, subject);
        setMethods(teachingMethods);
      } catch (err) {
        console.error("Error fetching teaching methods:", err);
        setError("Failed to generate teaching methods. Please try again.");
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

                  <div className="text-sm space-y-1 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h3 className="font-medium">Suitable for:</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {method.suitableFor.map((style, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-100">
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="description">
                      <AccordionTrigger className="font-medium flex items-center gap-2">
                        <Scroll className="h-4 w-4 text-blue-500" />
                        Method Description
                      </AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>{method.description}</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="implementation">
                      <AccordionTrigger className="font-medium flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-500" />
                        Implementation Steps
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal pl-5 space-y-2 text-sm">
                          {method.implementationSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="resources">
                      <AccordionTrigger className="font-medium flex items-center gap-2">
                        <List className="h-4 w-4 text-purple-500" />
                        Required Resources
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {method.resources.map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.print()}>
            Print Methods
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeachingMethodsView;
