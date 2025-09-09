import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { geminiService } from "../services/geminiService";
import { speechService } from "../services/speechService";
import { translations, keyboardLayouts } from "../utils/translations";
import { 
  MessageCircle, 
  Send, 
  X, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Keyboard,
  Loader2,
  MapPin,
  Languages
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  language: string;
}

interface ChatBotProps {
  isMinimized?: boolean;
}

const ChatBot = ({ isMinimized: controlledMinimized }: ChatBotProps) => {
  const { userProfile, isGuest } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(controlledMinimized || false);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Bengali'>('English');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Initialize welcome message
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      text: t.welcomeMessage,
      isBot: true,
      timestamp: new Date(),
      language: language
    }]);
  }, [language, t.welcomeMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message function
  const sendMessage = async (msg: string = inputText) => {
    if (!msg.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: msg,
      isBot: false,
      timestamp: new Date(),
      language: language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const userId = userProfile?.uid || 'guest-user';
      const response = await geminiService.generateResponse(msg, language, userId);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        language: language
      };

      setMessages(prev => [...prev, botMessage]);

      // Auto-speak response
      if (!isSpeaking && speechService.isSynthesisSupported) {
        const plainResponse = geminiService.stripMarkdown(response);
        await speechService.speak(plainResponse, language);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: t.errorMessage,
        isBot: true,
        timestamp: new Date(),
        language: language
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice input handling
  const startListening = async () => {
    if (!speechService.isRecognitionSupported) return;

    try {
      setIsListening(true);
      const transcript = await speechService.startListening(language);
      setInputText(transcript);
      // Auto-send voice input
      await sendMessage(transcript);
    } catch (error) {
      console.error('Speech recognition error:', error);
    } finally {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
    }
  };

  // Virtual keyboard handling
  const handleVirtualKey = (key: string) => {
    if (key === "Backspace") {
      setInputText(prev => prev.slice(0, -1));
    } else if (key === "Space") {
      setInputText(prev => prev + " ");
    } else {
      setInputText(prev => prev + key);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      text: t.welcomeMessage,
      isBot: true,
      timestamp: new Date(),
      language: language
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold text-sm">{t.chatTitle}</span>
                {isGuest && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                    Demo
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: "Popular Destinations", icon: MapPin, action: "show-destinations" },
    { label: "Accommodations", icon: ShoppingBag, action: "show-hotels" },
    { label: "Local Culture", icon: Globe, action: "show-culture" },
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = '';
      
      if (inputText.toLowerCase().includes('ranchi')) {
        botResponse = `Great choice! In Ranchi, I recommend visiting:

1. Patratu Valley - Scenic views and boating
2. Hundru Falls - Spectacular 98m waterfall
3. Rock Garden - Adventure activities
4. Jagannath Temple - Religious significance

Would you like me to help you book accommodations or find local guides?`;
      } else if (inputText.toLowerCase().includes('book') || inputText.toLowerCase().includes('hotel')) {
        botResponse = `I can help you with bookings! Here are some options:

🏨 **Hotels in Ranchi:**
- Radisson Blu - ₹4,500/night
- Hotel Chanakya - ₹2,800/night
- BNR Hotel - ₹2,200/night

🏡 **Homestays:**
- Traditional Tribal Homestay - ₹1,500/night
- Nature Valley Stay - ₹1,800/night

Would you like me to check availability and make a booking?`;
      } else {
        botResponse = `I understand you're asking about "${inputText}". Let me provide you with relevant information about Jharkhand's attractions, culture, and travel options. What specific aspect would you like to know more about?`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    let response = '';
    
    switch (action) {
      case 'show-destinations':
        response = "Here are Jharkhand's top destinations: Ranchi (capital city), Netarhat (Queen of Chotanagpur), Betla National Park (wildlife), Dassam Falls, and Jamshedpur (steel city). Which interests you most?";
        break;
      case 'show-hotels':
        response = "I can help you find accommodations! What's your preferred location and budget range? We have luxury hotels, budget stays, and authentic homestays available.";
        break;
      case 'show-culture':
        response = "Jharkhand has rich tribal culture! Experience Sarhul festival (spring celebration), traditional Santhali dances, tribal handicrafts, and authentic local cuisine. Would you like to know about upcoming festivals?";
        break;
    }
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="sm"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <CardTitle className="text-sm">Jharkhand Tourism Assistant</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)}>
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[600px] shadow-xl">
        {/* Header */}
        <CardHeader className="pb-3 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Jharkhand Tourism Assistant</CardTitle>
                <p className="text-xs opacity-90">Your personal travel guide</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="text-primary-foreground hover:bg-primary-foreground/20">
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex gap-1 mt-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? "secondary" : "ghost"}
                size="sm"
                className="text-xs px-2 py-1 h-auto text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setCurrentLanguage(lang.code)}
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.code === 'en' ? 'En' : lang.code === 'hi' ? 'हि' : lang.code === 'sa' ? 'स' : 'न'}
              </Button>
            ))}
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="p-0 flex flex-col h-[480px]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.isBot
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-3 border-t bg-muted/30">
            <div className="flex flex-wrap gap-1 mb-3">
              {quickActions.map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage}
                size="sm"
                disabled={!inputText.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;