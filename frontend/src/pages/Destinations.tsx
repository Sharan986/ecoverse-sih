import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Camera } from "lucide-react";

const Destinations = () => {
  const destinations = [
    {
      id: 1,
      name: "Netarhat Hill Station",
      category: "Nature",
      description: "Queen of Chotanagpur, famous for sunrise and sunset views",
      image: "/api/placeholder/400/300",
      rating: 4.8,
      duration: "2-3 days",
      highlights: ["Sunrise Point", "Sunset Point", "Forest Trek", "Cool Climate"]
    },
    {
      id: 2,
      name: "Hundru Falls",
      category: "Waterfall",
      description: "74-meter high waterfall on Subarnarekha River",
      image: "/api/placeholder/400/300",
      rating: 4.6,
      duration: "Half day",
      highlights: ["Photography", "Natural Pool", "Monsoon Beauty", "Adventure"]
    },
    {
      id: 3,
      name: "Ranchi Rock Garden",
      category: "Culture",
      description: "Beautiful rock garden with artistic stone sculptures",
      image: "/api/placeholder/400/300",
      rating: 4.4,
      duration: "2-3 hours",
      highlights: ["Rock Sculptures", "Gardens", "Boating", "Family Friendly"]
    },
    {
      id: 4,
      name: "Palamau Tiger Reserve",
      category: "Wildlife",
      description: "First tiger reserve of India with rich biodiversity",
      image: "/api/placeholder/400/300",
      rating: 4.7,
      duration: "2-3 days",
      highlights: ["Tiger Safari", "Elephant Safari", "Bird Watching", "Wildlife Photography"]
    },
    {
      id: 5,
      name: "Deoghar Temple Complex",
      category: "Religious",
      description: "Sacred Jyotirlinga temple of Lord Shiva",
      image: "/api/placeholder/400/300",
      rating: 4.9,
      duration: "1-2 days",
      highlights: ["Baba Baidyanath Temple", "Spiritual Experience", "Festivals", "Sacred Rituals"]
    },
    {
      id: 6,
      name: "Betla National Park",
      category: "Wildlife",
      description: "Part of Palamau Tiger Reserve with diverse flora and fauna",
      image: "/api/placeholder/400/300",
      rating: 4.5,
      duration: "1-2 days",
      highlights: ["Jeep Safari", "Elephant Rides", "Camping", "Nature Trails"]
    }
  ];

  const categories = ["All", "Nature", "Waterfall", "Culture", "Wildlife", "Religious"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary-light/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Discover <span className="text-primary">Jharkhand</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            From misty hills to thundering waterfalls, from ancient temples to wildlife sanctuaries - 
            explore the hidden gems of India's mineral-rich heartland.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <Button key={category} variant="outline" className="rounded-full">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Card key={destination.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{destination.category}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{destination.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {destination.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {destination.duration}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Camera className="w-4 h-4" />
                      Photo Spots
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {destination.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{destination.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      <MapPin className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="icon">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            Plan your perfect journey through the Land of Forests with our AI-powered itinerary planner.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Start Planning Your Trip
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Destinations;