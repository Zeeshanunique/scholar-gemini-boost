
import { BookOpen, GraduationCap, Brain, Lightbulb, BarChart4, LineChart, BookMarked, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Learning Pathways</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost">About</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            About Smart Learning Pathways
          </h2>
          <p className="text-lg text-gray-600">
            Our AI-powered platform identifies learning challenges and recommends personalized 
            strategies to help students excel in their educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                At Smart Learning Pathways, we believe every student has unique learning needs. 
                Our mission is to leverage artificial intelligence to identify slow learners early, 
                provide tailored learning strategies, and help educators implement innovative teaching methods 
                that address individual student needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-6 w-6 text-green-500" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our system analyzes student assessment data across multiple subjects, identifies 
                patterns and learning challenges, and generates personalized recommendations using 
                Google's Gemini AI model. These recommendations include learning styles, specific 
                techniques, and resources tailored to each student's unique needs.
              </p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-2xl font-bold mb-6 text-center">Key Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart4 className="h-6 w-6 text-blue-500" />
                Academic Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Higher test scores and better concept understanding</li>
                <li>Reduced errors in assessments</li>
                <li>Improved long-term knowledge retention</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-500" />
                Student Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Increased classroom participation</li>
                <li>Higher homework completion rates</li>
                <li>Boosted confidence and proactive learning</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-6 w-6 text-orange-500" />
                Long-Term Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Lower dropout rates</li>
                <li>Scalable learning models for institutions</li>
                <li>Data-driven tracking of student progress</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Smart Learning Pathways © {new Date().getFullYear()} - Identifying learning needs and providing personalized recommendations
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
