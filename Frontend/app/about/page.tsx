"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Mail, Linkedin, Twitter } from "lucide-react"

const teamMembers = [
  {
    id: 1,
    name: "Sarah Wanjiku",
    role: "Founder & Executive Director",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Sarah founded Bidii Girls Program in 2021 after witnessing firsthand the challenges girls face due to period poverty. With over 10 years of experience in community development, she leads our mission with passion and dedication.",
    email: "sarah@bidiigirls.org",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 2,
    name: "Grace Muthoni",
    role: "Program Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Grace oversees our educational programs and community outreach initiatives. Her background in social work and her deep understanding of local communities make her invaluable to our mission.",
    email: "grace@bidiigirls.org",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 3,
    name: "David Kimani",
    role: "Operations Director",
    image: "/placeholder.svg?height=300&width=300",
    bio: "David manages our day-to-day operations and ensures efficient distribution of resources. His expertise in logistics and supply chain management helps us reach more girls effectively.",
    email: "david@bidiigirls.org",
    linkedin: "#",
    twitter: "#",
  },
  {
    id: 4,
    name: "Mary Akinyi",
    role: "Community Coordinator",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Mary works directly with schools and communities to implement our programs. Her grassroots approach and cultural sensitivity ensure our initiatives are well-received and effective.",
    email: "mary@bidiigirls.org",
    linkedin: "#",
    twitter: "#",
  },
]

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<(typeof teamMembers)[0] | null>(null)

  // Scroll to top when component mounts
  useState(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Bidii Girls</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering girls through education and breaking the cycle of period poverty in Kenyan slums
          </p>
        </div>
      </section>

      {/* About Us Prose Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto text-gray-700 dark:text-gray-300">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#e51083]">Our Story</h2>

            <p className="text-lg leading-relaxed mb-6">
              In the heart of Kenya's most challenged communities, a silent crisis affects thousands of young girls
              every month. Period poverty—the lack of access to menstrual products, education, and facilities—forces
              girls to miss school, abandon their dreams, and face a future limited by circumstances beyond their
              control.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The Bidii Girls Program was born from a deep understanding of this crisis and an unwavering belief that
              every girl deserves the opportunity to reach her full potential. Founded in 2021, our organization emerged
              from the recognition that menstrual health is not just a health issue—it's a matter of human dignity,
              educational equity, and economic empowerment.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              "Bidii" is a Swahili word meaning determination, effort, and perseverance—qualities that define both the
              girls we serve and our approach to creating lasting change. We believe that when girls are empowered with
              knowledge, resources, and confidence, they become unstoppable forces for positive transformation in their
              communities.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Our work extends far beyond providing menstrual products. We create comprehensive support systems that
              address the root causes of period poverty through education, infrastructure development, and community
              engagement. By working directly with schools, families, and local leaders, we ensure that our impact is
              sustainable and culturally sensitive.
            </p>

            <p className="text-lg leading-relaxed">
              Today, we stand as a beacon of hope for hundreds of girls across Kenya's slums, proving that with the
              right support, determination, and community partnership, we can break the cycle of poverty and create a
              future where every girl can pursue her dreams without barriers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#e51083]">Our Mission</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                To combat period poverty in African slums by providing access to sanitary products, education,
                 and support through community-driven initiatives and sustainable donations, empowering girls to 
                 live healthier and more empowered lives.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We believe every girl deserves the opportunity to pursue her dreams without being held back by her
                biology. Through our comprehensive programs, we address both immediate needs and long-term empowerment.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#e51083]">Our Vision</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                To create a world where every girl in Africa can manage her period with dignity, 
                free from barriers, stigma, and inequality.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We envision thriving communities where girls are leaders, innovators, and change-makers, breaking
                generational cycles of poverty through education and empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e51083] mb-2">5000+</div>
              <div className="text-gray-600 dark:text-gray-400">Girls Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e51083] mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-400">Schools Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e51083] mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Products Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e51083] mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-400">School Attendance Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedMember(member)}
              >
                <CardContent className="p-6 text-center">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {member.role}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Member Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">{selectedMember.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="text-center">
                  <Image
                    src={selectedMember.image || "/placeholder.svg"}
                    alt={selectedMember.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {selectedMember.role}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedMember.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Experience & Background</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      With extensive experience in community development and social work, {selectedMember.name} brings
                      valuable expertise to our mission. Their dedication to empowering girls and fighting period
                      poverty has been instrumental in our success.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact & Social Media</h3>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-[#e51083]" />
                        <span className="text-gray-600 dark:text-gray-400">{selectedMember.email}</span>
                      </div>
                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                          <Twitter className="h-4 w-4" />
                          <span>Twitter</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
