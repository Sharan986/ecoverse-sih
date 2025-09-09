import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw,
  Info,
  MapPin
} from "lucide-react";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  content: string;
  type: 'info' | 'navigation' | 'entrance';
}

interface TourSection {
  id: string;
  name: string;
  image: string;
  hotspots: Hotspot[];
}

const VirtualTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [progress, setProgress] = useState(60);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLDivElement>(null);

  const tourSections: TourSection[] = [
    {
      id: "temple-exterior",
      name: "Temple Exterior", 
      image: "/api/placeholder/1200/600",
      hotspots: [
        {
          id: "main-entrance",
          x: 50,
          y: 70,
          title: "Main Entrance",
          content: "Historical Significance of the temple entrance built in 1691",
          type: "entrance"
        },
        {
          id: "history-info",
          x: 75,
          y: 40,
          title: "History of Jagannath Temple", 
          content: "Built in 1691 by Raja Aani Nath Shah Deo, this temple is a replica of the Puri temple. It is one of his significant pilgrimage sites...",
          type: "info"
        },
        {
          id: "temple-interior-nav",
          x: 25,
          y: 50,
          title: "Temple Interior",
          content: "Navigate to the temple interior",
          type: "navigation"
        }
      ]
    },
    {
      id: "temple-interior",
      name: "Temple Interior",
      image: "/api/placeholder/1200/600", 
      hotspots: [
        {
          id: "main-altar",
          x: 60,
          y: 45,
          title: "Main Altar",
          content: "The sacred altar where daily prayers are performed",
          type: "info"
        }
      ]
    },
    {
      id: "temple-gardens",
      name: "Temple Gardens",
      image: "/api/placeholder/1200/600",
      hotspots: [
        {
          id: "garden-info",
          x: 40,
          y: 60, 
          title: "Sacred Gardens",
          content: "Beautiful gardens surrounding the temple complex",
          type: "info"
        }
      ]
    }
  ];

  const currentTour = tourSections[currentSection];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  const navigateSection = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setProgress(prev => Math.max(prev - 20, 0));
    } else if (direction === 'next' && currentSection < tourSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setProgress(prev => Math.min(prev + 20, 100));
    }
    setSelectedHotspot(null);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        variant="default"
        className="bg-gradient-primary hover:bg-gradient-primary/90"
      >
        Start Virtual Temple Tour
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
      {/* Header */}
      <div className="bg-primary/90 text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Virtual Temple Tour</h2>
          <div className="flex items-center gap-2 text-sm">
            <span>Tour Completion: {progress}%</span>
          </div>
        </div>
        <Button
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Progress value={progress} className="h-1" />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Navigation Sidebar */}
        <div className="w-64 bg-muted/50 p-4 border-r">
          <h3 className="font-medium mb-4 text-foreground">Tour Sections</h3>
          <div className="space-y-2">
            {tourSections.map((section, index) => (
              <Button
                key={section.id}
                variant={index === currentSection ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  setCurrentSection(index);
                  setSelectedHotspot(null);
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {section.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Tour Viewer */}
        <div className="flex-1 relative overflow-hidden bg-muted">
          <div 
            ref={imageRef}
            className="relative w-full h-full bg-cover bg-center transition-transform duration-300"
            style={{ 
              backgroundImage: `url(${currentTour.image})`,
              transform: `scale(${zoom})`,
              transformOrigin: 'center'
            }}
          >
            {/* Hotspots */}
            {currentTour.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className="absolute w-8 h-8 bg-primary/80 hover:bg-primary rounded-full border-2 border-primary-foreground animate-pulse hover:animate-none transition-all"
                style={{ 
                  left: `${hotspot.x}%`, 
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <Info className="w-4 h-4 text-primary-foreground mx-auto mt-1" />
              </button>
            ))}

            {/* Navigation Arrows */}
            {currentSection > 0 && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={() => navigateSection('prev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            {currentSection < tourSections.length - 1 && (
              <Button
                variant="secondary" 
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={() => navigateSection('next')}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Section Info */}
          <div className="absolute top-4 left-4">
            <Card className="bg-background/90 backdrop-blur-sm">
              <CardContent className="p-3">
                <h4 className="font-medium text-foreground">{currentTour.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Section {currentSection + 1} of {tourSections.length}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hotspot Info Panel */}
        {selectedHotspot && (
          <div className="w-80 bg-background border-l p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {selectedHotspot.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedHotspot(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {selectedHotspot.content}
              </p>
              {selectedHotspot.type === 'info' && (
                <div className="bg-muted rounded-lg p-4">
                  <img 
                    src="/api/placeholder/200/150" 
                    alt={selectedHotspot.title}
                    className="w-full rounded-md mb-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    Additional historical context and significance...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTour;