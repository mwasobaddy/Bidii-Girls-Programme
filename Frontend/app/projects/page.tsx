import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { DonateButton } from "@/components/donate-button"

const projects = [
  {
    id: 1,
    title: "Menstrual Hygiene Education Program",
    description:
      "Comprehensive education program teaching girls about menstrual health, hygiene practices, and body positivity in 10 schools across Kibera slum.",
    image: "/placeholder.svg?height=300&width=400",
    status: "Active",
    location: "Kibera, Nairobi",
    beneficiaries: 250,
    startDate: "January 2024",
    blogId: 1,
  },
  {
    id: 2,
    title: "Sanitary Pad Distribution Initiative",
    description:
      "Monthly distribution of reusable sanitary pads and hygiene kits to girls in Mathare slum, ensuring they don't miss school during their periods.",
    image: "/placeholder.svg?height=300&width=400",
    status: "Active",
    location: "Mathare, Nairobi",
    beneficiaries: 180,
    startDate: "March 2024",
    blogId: 2,
  },
  {
    id: 3,
    title: "Girls Empowerment Workshops",
    description:
      "Weekly workshops focusing on leadership skills, self-confidence, and career guidance for teenage girls in Mukuru slum.",
    image: "/placeholder.svg?height=300&width=400",
    status: "Planning",
    location: "Mukuru, Nairobi",
    beneficiaries: 120,
    startDate: "June 2024",
    blogId: 3,
  },
  {
    id: 4,
    title: "School Infrastructure Improvement",
    description:
      "Building and renovating toilet facilities in schools to provide private, clean spaces for girls to manage their periods with dignity.",
    image: "/placeholder.svg?height=300&width=400",
    status: "Completed",
    location: "Kawangware, Nairobi",
    beneficiaries: 300,
    startDate: "September 2023",
    blogId: 4,
  },
]

export default function ProjectsPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Transforming lives through targeted initiatives that address period poverty and empower girls
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
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
                          : "bg-blue-500"
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{project.description}</p>

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

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <DonateButton />
                    <Link href={`/blog/${project.blogId}`}>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
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

      {/* Call to Action */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Help Us Make a Difference</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your support can help us expand our reach and impact more lives. Every donation brings us closer to our goal
            of eradicating period poverty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DonateButton />
            <Button
              variant="outline"
              className="border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
            >
              Become a Volunteer
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
