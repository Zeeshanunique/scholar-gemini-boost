
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, BarChart3, BookMarked, Lightbulb, School } from "lucide-react";

// Mock data for demonstration purposes
const mockStudents = [
  { id: "1", name: "Alice Smith", subjects: ["Mathematics", "Science"], improvementScore: 68 },
  { id: "2", name: "Bob Johnson", subjects: ["Language Arts"], improvementScore: 82 },
  { id: "3", name: "Carol Williams", subjects: ["Science", "Social Studies"], improvementScore: 75 },
  { id: "4", name: "David Brown", subjects: ["Mathematics"], improvementScore: 59 },
  { id: "5", name: "Eva Martinez", subjects: ["Language Arts", "Social Studies"], improvementScore: 91 },
];

const mockStats = {
  totalStudents: 42,
  assessmentsCompleted: 186,
  averageImprovement: 73,
  subjectsDistribution: {
    Mathematics: 32,
    Science: 28,
    "Language Arts": 23,
    "Social Studies": 17
  }
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">
            Monitor student progress and learning outcomes
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">{mockStats.totalStudents}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Assessments Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BookMarked className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">{mockStats.assessmentsCompleted}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Average Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-orange-500 mr-2" />
                    <span className="text-2xl font-bold">{mockStats.averageImprovement}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold">42</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockStats.subjectsDistribution).map(([subject, count]) => (
                    <div key={subject}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{subject}</span>
                        <span className="text-sm text-gray-500">{count} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / mockStats.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> Recent Student Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 bg-gray-100 text-sm font-medium">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-4">Focus Areas</div>
                    <div className="col-span-2">Improvement</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {mockStudents.map((student, index) => (
                    <div 
                      key={student.id} 
                      className={`grid grid-cols-12 p-4 text-sm ${
                        index !== mockStudents.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="col-span-1 font-medium">{student.id}</div>
                      <div className="col-span-3">{student.name}</div>
                      <div className="col-span-4">
                        <div className="flex flex-wrap gap-1">
                          {student.subjects.map(subject => (
                            <span 
                              key={subject}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          student.improvementScore >= 80 
                            ? "bg-green-100 text-green-800" 
                            : student.improvementScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {student.improvementScore}%
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" /> Subject Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Future feature: Detailed analysis of performance trends by subject, identifying common struggle areas
                  and recommended teaching approaches.
                </p>
                <div className="flex justify-center">
                  <Link to="/">
                    <Button>
                      Assess New Student
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

export default Dashboard;
