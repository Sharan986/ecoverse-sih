import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, Leaf, Award, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Authentic Experiences",
      description: "We believe in showcasing the real Jharkhand - its people, culture, and natural beauty in the most authentic way possible."
    },
    {
      icon: Shield,
      title: "Responsible Tourism",
      description: "Every experience is designed to benefit local communities while preserving the environment and cultural heritage."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We work directly with local communities, ensuring tourism benefits reach the grassroots level."
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "Our commitment to eco-friendly tourism helps protect Jharkhand's pristine natural environment."
    }
  ];

  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & Cultural Guide",
      image: "/api/placeholder/300/300",
      bio: "Born and raised in Ranchi, Priya has spent over 15 years promoting authentic Jharkhand tourism."
    },
    {
      name: "Ravi Kumar",
      role: "Adventure Specialist",
      image: "/api/placeholder/300/300",
      bio: "Expert trekker and wildlife enthusiast with deep knowledge of Jharkhand's natural reserves."
    },
    {
      name: "Dr. Anjali Oraon",
      role: "Cultural Heritage Advisor",
      image: "/api/placeholder/300/300",
      bio: "Anthropologist and tribal culture expert, ensuring authentic cultural representation."
    },
    {
      name: "Suresh Munda",
      role: "Community Liaison",
      image: "/api/placeholder/300/300",
      bio: "Bridge between tourism and local communities, ensuring mutual benefit and respect."
    }
  ];

  const achievements = [
    { number: "500+", label: "Happy Travelers" },
    { number: "50+", label: "Local Partners" },
    { number: "25+", label: "Destinations Covered" },
    { number: "5", label: "Years of Excellence" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary-light/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">Jharkhand Explorer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We are passionate storytellers and cultural ambassadors dedicated to sharing the authentic beauty, 
            rich heritage, and vibrant traditions of Jharkhand with the world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Award-Winning Tourism
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Sustainable Travel
            </Badge>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <span className="text-primary">Story</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Born from a deep love for Jharkhand's untold stories, we started this journey in 2019 
                with a simple mission: to showcase the authentic beauty of our homeland while ensuring 
                that tourism benefits reach every corner of our communities.
              </p>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                From the misty hills of Netarhat to the sacred temples of Deoghar, from the thundering 
                waterfalls to the vibrant tribal villages - we believe every story deserves to be told, 
                every culture deserves to be celebrated, and every traveler deserves an authentic experience.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, we're proud to be Jharkhand's leading sustainable tourism platform, connecting 
                conscious travelers with meaningful experiences while supporting local communities and 
                preserving our precious heritage.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/api/placeholder/500/400" 
                alt="Jharkhand landscape" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Meet Our <span className="text-primary">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-12">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {achievement.number}
                </div>
                <div className="text-primary-foreground/90 text-lg">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              "To create a sustainable tourism ecosystem that celebrates Jharkhand's natural beauty 
              and cultural richness while empowering local communities and preserving our heritage 
              for future generations."
            </p>
            <Button size="lg" className="bg-gradient-primary">
              Join Our Mission
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;