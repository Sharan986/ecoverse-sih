import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 98765 43210", "+91 87654 32109"],
      subtext: "Available 9 AM - 8 PM"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@jharkhandexplorer.com", "support@jharkhandexplorer.com"],
      subtext: "We reply within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["Ranchi Tourism Hub", "Main Road, Ranchi - 834001"],
      subtext: "Jharkhand, India"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Sat: 9 AM - 8 PM", "Sun: 10 AM - 6 PM"],
      subtext: "Always here to help"
    }
  ];

  const offices = [
    {
      city: "Ranchi",
      address: "Tourism Complex, Main Road",
      phone: "+91 98765 43210",
      type: "Head Office"
    },
    {
      city: "Deoghar",
      address: "Near Baba Baidyanath Temple",
      phone: "+91 87654 32109",
      type: "Regional Office"
    },
    {
      city: "Netarhat",
      address: "Hill Station Tourism Center",
      phone: "+91 76543 21098",
      type: "Adventure Base"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary-light/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Ready to explore Jharkhand? We're here to help plan your perfect journey. 
            Reach out to our friendly team for personalized assistance.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quick Response
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Expert Guidance
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Planning a trip to Jharkhand" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your travel plans, interests, and any specific requirements..."
                      rows={5}
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-primary">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Let's Start Your <span className="text-primary">Journey</span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Whether you're planning a weekend getaway or an extended cultural immersion, 
                  our team of local experts is ready to create the perfect Jharkhand experience for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                          <p className="text-xs text-muted-foreground mt-1">
                            {info.subtext}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">Offices</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{office.city}</CardTitle>
                  <CardDescription className="text-primary font-semibold">
                    {office.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {office.address}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {office.phone}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How far in advance should I book my trip?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We recommend booking at least 2-3 weeks in advance, especially during peak seasons 
                  (October-March) and festival times. This ensures better availability and pricing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you provide customized itineraries?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! We specialize in creating personalized experiences based on your interests, 
                  budget, and time constraints. Our AI-powered planner and local experts work together 
                  to craft your perfect journey.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What safety measures do you have in place?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Safety is our top priority. All our guides are certified, we provide emergency support, 
                  and our blockchain-secured booking system ensures transparency and protection for all transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Explore Jharkhand?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Don't wait! Start planning your unforgettable Jharkhand adventure today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Plan My Trip
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Chat with Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;