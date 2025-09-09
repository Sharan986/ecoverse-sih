import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  Calendar, 
  Car, 
  Train, 
  Plane,
  Bus,
  Hotel,
  Utensils,
  Camera,
  AlertTriangle,
  Download,
  Share2,
  Heart,
  Star,
  Users,
  Navigation,
  Wifi,
  Smartphone,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Sun,
  Moon,
  Sunrise,
  MapIcon,
  Info
} from "lucide-react";

interface ItineraryDisplayProps {
  itinerary: string;
  isLoading?: boolean;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, isLoading }) => {
  const [savedToFavorites, setSavedToFavorites] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">✨ AI is crafting your perfect itinerary</h3>
              <p className="text-sm text-muted-foreground">Analyzing destinations, optimizing routes, and personalizing experiences...</p>
            </div>
            <Progress value={75} className="w-64 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Parse the itinerary text into structured sections
  const parseItinerary = (text: string) => {
    const sections = {
      transport: '',
      accommodation: '',
      days: [] as Array<{day: number, title: string, activities: string[]}>,
      costs: '',
      notes: ''
    };

    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = '';
    let currentDay = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Detect sections
      if (trimmedLine.toLowerCase().includes('transport') || trimmedLine.toLowerCase().includes('travel')) {
        currentSection = 'transport';
        sections.transport += trimmedLine + '\n';
      } else if (trimmedLine.toLowerCase().includes('stay') || trimmedLine.toLowerCase().includes('accommodation')) {
        currentSection = 'accommodation';
        sections.accommodation += trimmedLine + '\n';
      } else if (trimmedLine.match(/day\s*\d+/i)) {
        currentSection = 'days';
        const dayMatch = trimmedLine.match(/day\s*(\d+)/i);
        if (dayMatch) {
          currentDay = {
            day: parseInt(dayMatch[1]),
            title: trimmedLine,
            activities: []
          };
          sections.days.push(currentDay);
        }
      } else if (trimmedLine.toLowerCase().includes('cost') || trimmedLine.toLowerCase().includes('budget')) {
        currentSection = 'costs';
        sections.costs += trimmedLine + '\n';
      } else if (trimmedLine.toLowerCase().includes('note') || trimmedLine.toLowerCase().includes('safety')) {
        currentSection = 'notes';
        sections.notes += trimmedLine + '\n';
      } else if (currentSection === 'days' && currentDay && trimmedLine) {
        currentDay.activities.push(trimmedLine);
      } else if (currentSection && trimmedLine && currentSection !== 'days') {
        if (currentSection === 'transport') {
          sections.transport += trimmedLine + '\n';
        } else if (currentSection === 'accommodation') {
          sections.accommodation += trimmedLine + '\n';
        } else if (currentSection === 'costs') {
          sections.costs += trimmedLine + '\n';
        } else if (currentSection === 'notes') {
          sections.notes += trimmedLine + '\n';
        }
      }
    }

    return sections;
  };

  const sections = parseItinerary(itinerary);

  const getActivityIcon = (activity: string) => {
    const text = activity.toLowerCase();
    if (text.includes('visit') || text.includes('see') || text.includes('explore')) return Camera;
    if (text.includes('lunch') || text.includes('dinner') || text.includes('breakfast') || text.includes('meal') || text.includes('food')) return Utensils;
    if (text.includes('hotel') || text.includes('check') || text.includes('stay')) return Hotel;
    if (text.includes('travel') || text.includes('drive') || text.includes('reach')) return Navigation;
    if (text.includes('shopping') || text.includes('market')) return MapIcon;
    return MapPin;
  };

  const getTimeIcon = (activity: string) => {
    const text = activity.toLowerCase();
    if (text.includes('morning') || text.includes('breakfast')) return Sunrise;
    if (text.includes('evening') || text.includes('sunset') || text.includes('dinner')) return Moon;
    return Sun;
  };

  const getTransportIcon = (text: string) => {
    if (text.toLowerCase().includes('flight')) return Plane;
    if (text.toLowerCase().includes('train')) return Train;
    if (text.toLowerCase().includes('bus')) return Bus;
    return Car;
  };

  const extractCostValue = (line: string) => {
    const match = line.match(/₹?\s*(\d+(?:,\d+)*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl"></div>
        <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <MapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Your Jharkhand Adventure
                  </h2>
                  <p className="text-muted-foreground">AI-crafted itinerary for an unforgettable journey</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={savedToFavorites ? "default" : "outline"} 
                size="sm"
                onClick={() => setSavedToFavorites(!savedToFavorites)}
                className="hover:scale-105 transition-transform"
              >
                <Heart className={`w-4 h-4 mr-2 ${savedToFavorites ? 'fill-current' : ''}`} />
                {savedToFavorites ? 'Saved!' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-700">{sections.days.length}</div>
              <div className="text-xs text-blue-600">Days</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-700">
                {sections.days.reduce((acc, day) => acc + day.activities.length, 0)}
              </div>
              <div className="text-xs text-green-600">Activities</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <Camera className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-700">
                {sections.days.reduce((acc, day) => 
                  acc + day.activities.filter(act => 
                    act.toLowerCase().includes('visit') || 
                    act.toLowerCase().includes('see') || 
                    act.toLowerCase().includes('explore')
                  ).length, 0
                )}
              </div>
              <div className="text-xs text-purple-600">Attractions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <Utensils className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-700">
                {sections.days.reduce((acc, day) => 
                  acc + day.activities.filter(act => 
                    act.toLowerCase().includes('lunch') || 
                    act.toLowerCase().includes('dinner') || 
                    act.toLowerCase().includes('meal')
                  ).length, 0
                )}
              </div>
              <div className="text-xs text-orange-600">Meals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Information */}
      {sections.transport && (
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-blue-700">
              <div className="p-2 bg-blue-100 rounded-full">
                {React.createElement(getTransportIcon(sections.transport), { className: "w-5 h-5 text-blue-600" })}
              </div>
              <div>
                <span className="text-lg font-bold">Transportation</span>
                <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">Essential</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700 leading-relaxed whitespace-pre-line">{sections.transport}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accommodation Information */}
      {sections.accommodation && (
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-green-700">
              <div className="p-2 bg-green-100 rounded-full">
                <Hotel className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <span className="text-lg font-bold">Accommodation</span>
                <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-200">Comfort</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-white rounded-lg border border-green-100">
              <p className="text-sm text-green-700 leading-relaxed whitespace-pre-line">{sections.accommodation}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Itinerary */}
      {sections.days.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Daily Adventure Plan
            </h3>
            <p className="text-muted-foreground mt-2">Your personalized day-by-day journey through Jharkhand</p>
            <div className="flex justify-center mt-4">
              <Badge variant="secondary" className="px-4 py-2">
                {sections.days.length} {sections.days.length === 1 ? 'Day' : 'Days'} of Amazing Experiences
              </Badge>
            </div>
          </div>
          
          <div className="grid gap-6">
            {sections.days.map((day, index) => {
              const IconComponent = getTimeIcon(day.title);
              const isExpanded = expandedDay === day.day;
              
              return (
                <Card key={day.day} className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 via-pink-50 to-white shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardHeader 
                    className="pb-3 cursor-pointer hover:bg-purple-50/50 transition-colors rounded-t-lg"
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{day.day}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-yellow-800" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              Day {day.day}
                            </Badge>
                            {React.createElement(IconComponent, { className: "w-4 h-4 text-purple-600" })}
                          </div>
                          <h4 className="text-lg font-semibold text-purple-800 mt-1">
                            {day.title.replace(/day\s*\d+/i, '').trim() || 'Adventure Awaits'}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-700">
                          {day.activities.length} Activities
                        </Badge>
                        <ArrowRight className={`w-5 h-5 text-purple-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid gap-3">
                        {day.activities.map((activity, actIndex) => {
                          const ActivityIcon = getActivityIcon(activity);
                          const timeString = activity.match(/(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))/i)?.[0] || '';
                          
                          return (
                            <div key={actIndex} className="group relative">
                              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {React.createElement(ActivityIcon, { className: "w-5 h-5 text-purple-600" })}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                      {activity}
                                    </p>
                                    {timeString && (
                                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 flex-shrink-0">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {timeString}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {actIndex < day.activities.length - 1 && (
                                <div className="absolute left-7 top-16 w-0.5 h-4 bg-gradient-to-b from-purple-300 to-transparent"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Day Summary */}
                      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 text-sm text-purple-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Day {day.day} Complete!</span>
                          <span className="text-purple-600">• {day.activities.length} amazing experiences await</span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      {sections.costs && (
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-orange-700">
              <div className="p-2 bg-orange-100 rounded-full">
                <IndianRupee className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <span className="text-lg font-bold">Budget Breakdown</span>
                <Badge className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-200">Essential</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {sections.costs.split('\n').filter(line => line.trim()).map((line, index) => {
                const isTotal = line.toLowerCase().includes('total');
                const costValue = extractCostValue(line);
                
                return (
                  <div key={index} className={`flex justify-between items-center p-4 rounded-lg border transition-all hover:shadow-sm ${
                    isTotal 
                      ? 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-300 font-semibold' 
                      : 'bg-white border-orange-100 hover:border-orange-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isTotal ? (
                        <Star className="w-4 h-4 text-orange-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`text-sm ${isTotal ? 'text-orange-800' : 'text-orange-700'}`}>
                        {line.replace(/₹?\s*\d+(?:,\d+)*/, '').trim()}
                      </span>
                    </div>
                    {costValue && (
                      <Badge variant={isTotal ? "default" : "secondary"} className={isTotal ? "bg-orange-600" : "bg-orange-100 text-orange-700"}>
                        ₹{costValue.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes and Tips */}
      {sections.notes && (
        <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-amber-700">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-lg font-bold">Important Notes & Tips</span>
                <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-200">Must Read</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-white rounded-lg border border-amber-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700 leading-relaxed whitespace-pre-line">{sections.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* If no structured content found, show raw text */}
      {!sections.transport && !sections.accommodation && sections.days.length === 0 && !sections.costs && !sections.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Your Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{itinerary}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />
      
      {/* Enhanced Footer */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Powered by Advanced AI</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          🎯 Intelligently crafted for Jharkhand tourism • Personalized recommendations • Plan with confidence
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure & Private
          </span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Real-time Data
          </span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            Mobile Optimized
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
