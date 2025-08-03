import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, AlertCircle } from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import { getAllProjects } from "@/lib/services";
import { Project } from "@/lib/types";

// Transform database project to component format
function transformProject(project: Project) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.featured_image || "/placeholder.svg?height=300&width=400",
    status: project.status.charAt(0).toUpperCase() + project.status.slice(1),
    location: project.location || "Location TBD",
    beneficiaries: project.beneficiaries || 0,
    startDate: project.start_date
      ? new Date(project.start_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "TBD",
    progress: project.progress,
    budget: project.budget,
    raised: project.raised,
    blogId: project.id, // Using project ID as blog ID for now
  };
}

// Error fallback component
function DatabaseError({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Database Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">{message}</p>
          <div className="space-y-4">
            <p className="text-sm text-red-500 dark:text-red-400">
              Please ensure:
            </p>
            <ul className="text-sm text-red-500 dark:text-red-400 space-y-2 text-left max-w-md mx-auto">
              <li>• XAMPP MySQL service is running</li>
              <li>• Database 'bidii_girls_program' exists</li>
              <li>• Environment variables are correctly set</li>
              <li>• Database tables have been created</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProjectsPage() {
  let projects: ReturnType<typeof transformProject>[] = [];
  let errorMessage = "";

  try {
    const dbProjects = await getAllProjects();
    projects = dbProjects.map(transformProject);

    // If no projects found in database
    if (projects.length === 0) {
      errorMessage =
        "No projects found in the database. Please add some projects or check if the seed data was imported correctly.";
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    errorMessage =
      "Failed to connect to the database. Please check your XAMPP MySQL connection and database configuration.";

    // Return error component instead of dummy data
    return (
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Projects
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Transforming lives through targeted initiatives that address
              period poverty and empower girls
            </p>
          </div>
        </section>
        <DatabaseError message={errorMessage} />
      </div>
    );
  }
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Transforming lives through targeted initiatives that address period
            poverty and empower girls
          </p>
          {errorMessage && (
            <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg text-yellow-100">
              ⚠️ {errorMessage}
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid - Only show if we have projects */}
      {projects.length > 0 ? (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Showing {projects.length} project
                {projects.length !== 1 ? "s" : ""} from our database
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-4 right-4 ${
                        project.status === "Active"
                          ? "bg-green-500"
                          : project.status === "Planning"
                          ? "bg-yellow-500"
                          : project.status === "Completed"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#e51083]" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-[#e51083]" />
                        <span>{project.beneficiaries} girls</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                        <Calendar className="h-4 w-4 text-[#e51083]" />
                        <span>Started: {project.startDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
                      <Link href={`/blog/${project.blogId}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-[#e51083]/20"
                        >
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No projects are currently available. Please check back later or
                contact the administrator.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Help Us Make a Difference</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your support can help us expand our reach and impact more lives.
            Every donation brings us closer to our goal of eradicating period
            poverty.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
            <Link href="/contact" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-[#e51083]/20"
              >
                Volunteer with Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
