import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/jharkhand-hero.jpg";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("destinations");

  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
          Discover Jharkhand
        </h1>
        <p className="text-xl lg:text-2xl mb-12 text-white/90">
          Explore the land of forests, waterfalls, and rich tribal heritage
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto bg-white rounded-full p-2 flex items-center gap-2 shadow-strong">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-40 border-none bg-transparent text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="destinations">Destinations</SelectItem>
              <SelectItem value="festivals">Festivals</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search for places, events, or activities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0"
            />
          </div>
          
          <Button className="rounded-full bg-gradient-primary hover:bg-primary-hover px-6">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Quick Location Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribag", "Deoghar"].map((location) => (
            <button
              key={location}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
            >
              <MapPin className="w-4 h-4" />
              {location}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;