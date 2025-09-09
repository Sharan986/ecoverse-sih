import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Plane, 
  Train, 
  Car, 
  Bus,
  Sparkles,
  Save,
  MessageCircle,
  Trash2,
  Download,
  Loader2
} from 'lucide-react';
import { generateItineraryWithGemini, chatWithGemini, ItineraryPayload } from '../services/geminiApi';
import { saveItinerary, getUserItineraries, deleteItinerary, SavedItinerary } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import ItineraryDisplay from './ItineraryDisplay';

const transportIcons = {
  car: Car,
  train: Train,
  flight: Plane,
  bus: Bus,
};

const ItineraryPlanner: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Form state
  const [form, setForm] = useState<ItineraryPayload>({
    budget: 15000,
    startDate: '',
    duration: 3,
    homePlace: '',
    transport: 'train',
    arrival: '',
    preferredDestinations: [],
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [destinationsInput, setDestinationsInput] = useState('');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', message: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Load saved itineraries on mount
  useEffect(() => {
    loadSavedItineraries();
  }, [currentUser]);

  const loadSavedItineraries = async () => {
    const result = await getUserItineraries();
    if (result.success && result.itineraries) {
      setSavedItineraries(result.itineraries);
    }
  };

  const handleInputChange = (field: keyof ItineraryPayload, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDestinationsChange = (value: string) => {
    setDestinationsInput(value);
    const destinations = value.split(',').map(dest => dest.trim()).filter(dest => dest.length > 0);
    handleInputChange('preferredDestinations', destinations);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.homePlace || !form.startDate || !form.arrival) {
      setStatus('❌ Please fill in all required fields');
      return;
    }

    setLoading(true);
    setStatus('🤖 AI is creating your personalized itinerary...');
    setGeneratedPlan(null);

    try {
      const result = await generateItineraryWithGemini(form);
      
      if (result.success && result.plan) {
        setGeneratedPlan(result.plan);
        setStatus('✅ Itinerary generated successfully!');
        setActiveTab('result');
      } else {
        setStatus(`❌ ${result.error || 'Failed to generate itinerary'}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setStatus('❌ Something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!generatedPlan) {
      setStatus('⚠️ No itinerary to save');
      return;
    }

    const result = await saveItinerary(generatedPlan, form);
    if (result.success) {
      setStatus(`✅ Itinerary saved successfully! ID: ${result.id}`);
      loadSavedItineraries();
    } else {
      setStatus(`❌ ${result.error || 'Failed to save itinerary'}`);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteItinerary(id);
    if (result.success) {
      setStatus('✅ Itinerary deleted successfully');
      loadSavedItineraries();
    } else {
      setStatus(`❌ ${result.error || 'Failed to delete itinerary'}`);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const result = await chatWithGemini(userMessage, generatedPlan || undefined);
      
      if (result.success && result.response) {
        setChatMessages(prev => [...prev, { role: 'ai', message: result.response! }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', message: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { role: 'ai', message: 'Sorry, I encountered an error. Please try again.' }]);
    }
    
    setChatLoading(false);
  };

  const downloadItinerary = () => {
    if (!generatedPlan) return;
    
    const blob = new Blob([generatedPlan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jharkhand-itinerary-${form.startDate}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          AI-Powered Jharkhand Itinerary Planner
        </h1>
        <p className="text-muted-foreground">Create personalized travel plans with artificial intelligence</p>
      </div>

      {status && (
        <div className="mb-6 p-4 rounded-lg bg-muted border text-center">
          {status}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Itinerary</TabsTrigger>
          <TabsTrigger value="result">Generated Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Itineraries</TabsTrigger>
        </TabsList>

        {/* Create Itinerary Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Plan Your Jharkhand Adventure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Home Place */}
                  <div className="space-y-2">
                    <Label htmlFor="homePlace">Your Hometown *</Label>
                    <Input
                      id="homePlace"
                      value={form.homePlace}
                      onChange={(e) => handleInputChange('homePlace', e.target.value)}
                      placeholder="e.g., Mumbai, Delhi, Kolkata"
                      required
                    />
                  </div>

                  {/* Arrival City */}
                  <div className="space-y-2">
                    <Label htmlFor="arrival">Arrival City in Jharkhand *</Label>
                    <Select value={form.arrival} onValueChange={(value) => handleInputChange('arrival', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select arrival city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ranchi">Ranchi</SelectItem>
                        <SelectItem value="Jamshedpur">Jamshedpur</SelectItem>
                        <SelectItem value="Dhanbad">Dhanbad</SelectItem>
                        <SelectItem value="Bokaro">Bokaro</SelectItem>
                        <SelectItem value="Deoghar">Deoghar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (Days)</Label>
                    <Select value={form.duration.toString()} onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14].map(days => (
                          <SelectItem key={days} value={days.toString()}>
                            {days} {days === 1 ? 'Day' : 'Days'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        value={form.budget}
                        onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                        className="pl-10"
                        min="1000"
                        step="1000"
                      />
                    </div>
                  </div>

                  {/* Transport */}
                  <div className="space-y-2">
                    <Label>Preferred Transport</Label>
                    <Select value={form.transport} onValueChange={(value: any) => handleInputChange('transport', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="train">🚂 Train</SelectItem>
                        <SelectItem value="flight">✈️ Flight</SelectItem>
                        <SelectItem value="car">🚗 Car</SelectItem>
                        <SelectItem value="bus">🚌 Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Preferred Destinations */}
                <div className="space-y-2">
                  <Label htmlFor="destinations">Preferred Destinations (Optional)</Label>
                  <Textarea
                    id="destinations"
                    value={destinationsInput}
                    onChange={(e) => handleDestinationsChange(e.target.value)}
                    placeholder="e.g., Betla National Park, Hundru Falls, Netarhat, Ranchi Hill, Deoghar Temple"
                    className="min-h-[80px]"
                  />
                  <p className="text-sm text-muted-foreground">Separate multiple destinations with commas</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Itinerary
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Plan Tab */}
        <TabsContent value="result" className="space-y-6">
          {generatedPlan ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Itinerary Content */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Your Personalized Itinerary</CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={downloadItinerary} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ItineraryDisplay itinerary={generatedPlan} />
                  </CardContent>
                </Card>
              </div>

              {/* AI Chat Sidebar */}
              <div className="lg:col-span-1">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Ask AI About Your Trip
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Ask me anything about your itinerary!</p>
                          <p className="text-sm">e.g., "What should I pack?" or "Any local food recommendations?"</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-blue-500 text-white ml-4'
                                : 'bg-muted mr-4'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        ))
                      )}
                      {chatLoading && (
                        <div className="bg-muted mr-4 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleChat} className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about your trip..."
                        disabled={chatLoading}
                      />
                      <Button type="submit" size="sm" disabled={chatLoading || !chatInput.trim()}>
                        Send
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Itinerary Generated Yet</h3>
                <p className="text-muted-foreground mb-4">Go to the "Create Itinerary" tab to generate your personalized plan</p>
                <Button onClick={() => setActiveTab('create')}>
                  Create New Itinerary
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Itineraries Tab */}
        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Saved Itineraries</CardTitle>
            </CardHeader>
            <CardContent>
              {savedItineraries.length === 0 ? (
                <div className="text-center py-12">
                  <Save className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Saved Itineraries</h3>
                  <p className="text-muted-foreground">Your saved itineraries will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedItineraries.map((itinerary) => (
                    <Card key={itinerary.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {itinerary.payload.homePlace} → {itinerary.payload.arrival}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(itinerary.payload.startDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {itinerary.payload.duration} days
                              </span>
                              <span className="flex items-center gap-1">
                                <IndianRupee className="w-3 h-3" />
                                {itinerary.payload.budget.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(itinerary.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-40 overflow-y-auto">
                            {itinerary.itinerary.substring(0, 500)}...
                          </pre>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => {
                            setGeneratedPlan(itinerary.itinerary);
                            setForm(itinerary.payload);
                            setActiveTab('result');
                          }}
                        >
                          View Full Itinerary
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItineraryPlanner;
