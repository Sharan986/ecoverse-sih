import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const festivals = [
  {
    id: 1,
    name: "Sarhul Festival",
    season: "Spring",
    month: "April - May",
    description: "A spring festival celebrating the blossoming of Sal trees with traditional dance and music.",
    image: "https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2022/04/07080859/Sarhul-Festival-04-1.jpg",
    status: "upcoming",
    location: "Across Jharkhand"
  },
  {
    id: 2,
    name: "Karam Festival",
    season: "Monsoon",
    month: "August - September",
    description: "An agricultural festival honoring the Karam tree with elaborate music and celebrations.",
    image: "https://utsav.gov.in/public/uploads/event_cover_image/event_683/166115539381102155.jpg",
    status: "active",
    location: "Tribal Villages"
  },
  {
    id: 3,
    name: "Tusu Festival",
    season: "Winter",
    month: "January",
    description: "A harvest festival dedicated to goddess Tusu with colorful processions and traditional folk songs.",
    image: "https://utsav.gov.in/public/uploads/event_picture_image/event_686/16607352252119234166.jpg",
    status: "upcoming",
    location: "Rural Areas"
  },
  {
    id: 4,
    name: "Sohrai Festival",
    season: "Winter",
    month: "October - November",
    description: "A cattle festival featuring wall paintings and traditional celebrations.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaikdpLqqIMSarqJOJ8ZoqzepDIRwTfEahIA&s",
    status: "active",
    location: "Hazaribagh"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "upcoming":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const TrendingFestivals = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Trending Festivals
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the vibrant cultural celebrations that bring Jharkhand's traditions to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {festivals.map((festival) => (
            <Card key={festival.id} className="group cursor-pointer hover:shadow-strong transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={festival.image}
                  alt={festival.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className={`${getStatusColor(festival.status)} text-white`}>
                    {festival.season}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {festival.name}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {festival.month}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {festival.location}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {festival.description}
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingFestivals;