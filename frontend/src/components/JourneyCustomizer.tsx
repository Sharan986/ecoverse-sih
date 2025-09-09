import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Sparkles, TreePine, Mountain, Palette, Church, ShoppingBag } from "lucide-react";

const themes = [
  { name: "Nature", icon: TreePine, color: "nature" },
  { name: "Adventure", icon: Mountain, color: "adventure" },
  { name: "Culture", icon: Palette, color: "culture" },
  { name: "Religion", icon: Church, color: "religion" },
  { name: "Shopping", icon: ShoppingBag, color: "shopping" },
];

interface JourneyCustomizerProps {
  onGenerate: (preferences: { themes: string[]; duration: number; budget: number }) => void;
}

const JourneyCustomizer = ({ onGenerate }: JourneyCustomizerProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(["Nature"]);
  const [duration, setDuration] = useState([6]);
  const [budget, setBudget] = useState([30000]);

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleGenerate = () => {
    onGenerate({
      themes: selectedThemes,
      duration: duration[0],
      budget: budget[0]
    });
  };

  return (
    <Card className="w-full max-w-md shadow-medium">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Customize Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="font-medium text-foreground mb-3">Travel Themes</h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedThemes.includes(theme.name);
              return (
                <button
                  key={theme.name}
                  onClick={() => toggleTheme(theme.name)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    isSelected 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-foreground">Duration</h3>
            <span className="text-xl font-bold text-primary">{duration[0]} Days</span>
          </div>
          <Slider
            value={duration}
            onValueChange={setDuration}
            max={14}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 Day</span>
            <span>14 Days</span>
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-foreground">Budget</h3>
            <span className="text-xl font-bold text-primary">₹{budget[0].toLocaleString()}</span>
          </div>
          <Slider
            value={budget}
            onValueChange={setBudget}
            max={50000}
            min={5000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>₹5,000</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          variant="hero"
          className="w-full font-semibold py-6"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate AI Itinerary
        </Button>
      </CardContent>
    </Card>
  );
};

export default JourneyCustomizer;