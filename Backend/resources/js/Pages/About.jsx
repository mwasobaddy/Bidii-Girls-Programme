import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Twitter, AlertCircle } from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";

const API_BASE_URL = window.location.origin + '/api';

// Helper function to construct proper image URLs
function getImageUrl(imagePath) {
  if (!imagePath) return "/placeholder.svg";
  
  // If it's already a full URL or base64, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const BACKEND_URL = API_BASE_URL.replace('/api', '');
  return `${BACKEND_URL}${imagePath}`;
}

// Error fallback component
function DatabaseError({ message }) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Database Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">
            {message}
          </p>
          <div className="space-y-4">
            <p className="text-sm text-red-500 dark:text-red-400">
              Please ensure your database connection is working properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About({ auth, teamMembers: initialTeamMembers = [] }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      if (initialTeamMembers.length > 0) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/team-members`);
        if (response.ok) {
          const members = await response.json();
          setTeamMembers(members);
        } else {
          console.error('Failed to fetch team members');
          setError('Failed to connect to the database. Please check your database configuration.');
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to connect to the database. Please check your database configuration.');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <GuestLayout>
      <Head title="About Us" />
      
      <div>
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
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
                <p className="ml-4 text-gray-600 dark:text-gray-400">Loading team members...</p>
              </div>
            ) : error ? (
              <DatabaseError message={error} />
            ) : teamMembers.length > 0 ? (
              <>
                <div className="mb-8 text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Meet our {teamMembers.length} dedicated team member{teamMembers.length !== 1 ? 's' : ''} from our database
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member) => (
                    <Card
                      key={member.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 hover:scale-105"
                      onClick={() => setSelectedMember(member)}
                    >
                      <CardContent className="p-6 text-center">
                        <img
                          src={getImageUrl(member.image)}
                          alt={member.name}
                          width={200}
                          height={200}
                          className="rounded-full mx-auto mb-4 border-4 border-gray-100 dark:border-gray-700 w-32 h-32 object-cover"
                        />
                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                        <div className="flex flex-col items-center">
                            <Badge variant="secondary" className="mb-4">
                            {member.role}
                            </Badge>
                            <Button variant="outline" size="sm" className="hover:bg-[#e51083] hover:text-white transition-colors">
                            View Profile
                            </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Team Members Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No team members are currently available. Please check back later or contact the administrator.
                </p>
              </div>
            )}
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
                    <img
                      src={getImageUrl(selectedMember.image)}
                      alt={selectedMember.name}
                      width={200}
                      height={200}
                      className="rounded-full mx-auto mb-4 border-4 border-gray-100 dark:border-gray-700 w-48 h-48 object-cover"
                    />
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {selectedMember.role}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {selectedMember.bio || "Biography information not available for this team member."}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-2">Database Information</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Team Member ID: {selectedMember.id}</Badge>
                        <Badge variant="outline">Role: {selectedMember.role}</Badge>
                        {selectedMember.order_index && (
                          <Badge variant="outline">Order: {selectedMember.order_index}</Badge>
                        )}
                      </div>
                    </div>

                    {selectedMember.email && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-[#e51083]" />
                          <span className="text-gray-600 dark:text-gray-400">{selectedMember.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GuestLayout>
  );
}
