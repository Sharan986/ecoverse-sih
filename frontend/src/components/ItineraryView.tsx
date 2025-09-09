import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Clock, 
  MapPin, 
  Users, 
  Share2, 
  Download, 
  Edit3, 
  Save,
  Sunrise,
  Sun,
  Moon
} from "lucide-react";

interface Attraction {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  location: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

interface ItineraryDay {
  day: number;
  attractions: Attraction[];
  total: number;
}

interface ItineraryViewProps {
  itinerary: ItineraryDay[];
  totalBudget: number;
}

const timeIcons = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Moon,
};

const timeColors = {
  morning: "bg-gradient-to-r from-yellow-400 to-orange-500",
  afternoon: "bg-gradient-to-r from-sky-400 to-blue-600",
  evening: "bg-gradient-to-r from-purple-500 to-pink-600",
};

const timeLabels = {
  morning: "Morning",
  afternoon: "Afternoon", 
  evening: "Evening",
};

const ItineraryView = ({ itinerary, totalBudget }: ItineraryViewProps) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [savedAttractions, setSavedAttractions] = useState<Set<number>>(new Set());

  const toggleSaveAttraction = (id: number) => {
    setSavedAttractions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const currentDay = itinerary.find(day => day.day === selectedDay);

  const groupedAttractions = currentDay?.attractions.reduce((acc, attraction) => {
    if (!acc[attraction.timeOfDay]) {
      acc[attraction.timeOfDay] = [];
    }
    acc[attraction.timeOfDay].push(attraction);
    return acc;
  }, {} as Record<string, Attraction[]>) || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Your {itinerary.length}-Day Jharkhand Adventure ✈️
          </h2>
          <p className="text-muted-foreground mt-1">
            Total Budget: <span className="font-semibold text-primary">₹{totalBudget.toLocaleString()}</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Edit3 className="w-4 h-4" />
            Customize
          </Button>
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Day Tabs */}
      <Tabs value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
        <TabsList className="flex flex-wrap gap-2">
          {itinerary.map((day) => (
            <TabsTrigger 
              key={day.day} 
              value={day.day.toString()}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
            >
              Day {day.day}
            </TabsTrigger>
          ))}
        </TabsList>

        {itinerary.map((day) => (
          <TabsContent key={day.day} value={day.day.toString()} className="space-y-6">
            {/* Day Summary */}
            <Card className="border-primary/20 shadow-md rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">Day {day.day} Overview</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                    ₹{day.total.toLocaleString()} / person
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Time-based Sections */}
            {(['morning', 'afternoon', 'evening'] as const).map((timeOfDay) => {
              const TimeIcon = timeIcons[timeOfDay];
              const attractions = groupedAttractions[timeOfDay] || [];
              
              if (attractions.length === 0) return null;

              return (
                <div key={timeOfDay} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${timeColors[timeOfDay]}`}>
                      <TimeIcon className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {timeLabels[timeOfDay]}
                    </h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {attractions.map((attraction) => (
                      <Card 
                        key={attraction.id} 
                        className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={attraction.image} 
                            alt={attraction.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                            <span className="text-white font-semibold text-lg">{attraction.title}</span>
                          </div>
                          <button
                            onClick={() => toggleSaveAttraction(attraction.id)}
                            className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                savedAttractions.has(attraction.id) 
                                  ? "text-red-500 fill-current" 
                                  : "text-white"
                              }`} 
                            />
                          </button>
                        </div>
                        
                        <CardContent className="p-4 space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {attraction.description}
                          </p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{attraction.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{attraction.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>₹{attraction.price} per person</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ItineraryView;
