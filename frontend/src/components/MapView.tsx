import { Card } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";

const attractions = [
  { id: 1, name: "Hundru Falls", rating: 4.5, x: 20, y: 60 },
  { id: 2, name: "Jonha Falls", rating: 4.3, x: 35, y: 40 },
  { id: 3, name: "Ranchi Lake", rating: 4.2, x: 60, y: 70 },
  { id: 4, name: "Tribal Research Institute", rating: 4.1, x: 45, y: 50 },
  { id: 5, name: "Jagannath Temple", rating: 4.4, x: 55, y: 30 },
  { id: 6, name: "Rock Garden", rating: 4.0, x: 75, y: 45 },
];

const MapView = () => {
  return (
    <Card className="w-full h-96 relative overflow-hidden shadow-medium">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-blue-100">
        {/* Simulated terrain */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-32 h-24 bg-green-300 rounded-full blur-lg"></div>
          <div className="absolute top-20 right-20 w-40 h-32 bg-green-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-28 bg-blue-300 rounded-full blur-lg"></div>
          <div className="absolute bottom-10 right-10 w-28 h-20 bg-green-200 rounded-full blur-md"></div>
        </div>
      </div>

      {/* Attractions */}
      {attractions.map((attraction) => (
        <div
          key={attraction.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ left: `${attraction.x}%`, top: `${attraction.y}%` }}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-card border border-border rounded-lg p-2 shadow-strong min-w-max">
                <p className="font-semibold text-sm text-card-foreground">{attraction.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-accent fill-current" />
                  <span className="text-xs text-muted-foreground">{attraction.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Info Box */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-medium">
        <p className="text-sm font-semibold text-card-foreground mb-1">Showing 12 attractions</p>
        <p className="text-xs text-muted-foreground">Hover over pins for details</p>
      </div>
    </Card>
  );
};

export default MapView;