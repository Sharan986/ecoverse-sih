import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Map, 
  Camera, 
  Bus,
  ArrowRight,
  Shield,
  X
} from "lucide-react";
import ItineraryPlanner from "./ItineraryPlanner";
import VirtualTour from "./VirtualTour";
import BlockchainVerification from "./BlockchainVerification";

const quickActions = [
  {
    id: 1,
    title: "Itinerary Planner",
    description: "Create personalized travel plans with AI assistance",
    icon: Calendar,
    color: "bg-blue-500",
    glow: "hover:shadow-blue-500/40",
    action: "Plan Trip"
  },
  {
    id: 2,
    title: "Interactive Map",
    description: "Explore destinations with detailed interactive maps",
    icon: Map,
    color: "bg-green-500",
    glow: "hover:shadow-green-500/40",
    action: "View Map"
  },
  {
    id: 3,
    title: "Virtual Tours",
    description: "Experience 360° virtual tours of attractions",
    icon: Camera,
    color: "bg-purple-500",
    glow: "hover:shadow-purple-500/40",
    action: "Start Tour"
  },
  {
    id: 4,
    title: "Blockchain Security",
    description: "Secure bookings with blockchain verification",
    icon: Shield,
    color: "bg-emerald-500",
    glow: "hover:shadow-emerald-500/40",
    action: "View Security"
  },
  {
    id: 5,
    title: "Transport Info",
    description: "Get real-time transport schedules and bookings",
    icon: Bus,
    color: "bg-orange-500",
    glow: "hover:shadow-orange-500/40",
    action: "Check Routes"
  }
];

const QuickActions = () => {
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleActionClick = (actionId: number) => {
    // Special case for Interactive Map - navigate to map page
    if (actionId === 2) {
      navigate('/map');
      return;
    }
    
    // Special case for Virtual Tours - navigate to 360° viewer
    if (actionId === 3) {
      navigate('/360-tours');
      return;
    }
    
    setActiveModal(actionId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Quick Actions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to plan and explore Jharkhand at your fingertips
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <Card 
                key={action.id} 
                className={`group cursor-pointer hover:scale-105 transition-all duration-300 border border-white/10 bg-white/10 backdrop-blur-md rounded-2xl hover:shadow-xl ${action.glow}`}
                onClick={() => handleActionClick(action.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {action.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    {action.action}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Modals */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full mx-4 relative p-6 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent animate-scaleIn">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 shadow-md transition"
              >
                <X className="w-5 h-5 text-black" />
              </button>

              {/* Modal Content */}
              {activeModal === 1 && <ItineraryPlanner />}
              {activeModal === 3 && <VirtualTour />}
              {activeModal === 4 && <BlockchainVerification />}
              {activeModal === 2 && <p className="text-center text-lg text-muted-foreground">Interactive Map Coming Soon 🗺️</p>}
              {activeModal === 5 && <p className="text-center text-lg text-muted-foreground">Transport Info Coming Soon 🚌</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuickActions;
