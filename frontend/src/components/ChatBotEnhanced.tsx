import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Languages,
  RotateCcw,
  Clock
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col">
      {/* Main Chat Window */}
      <Card className="w-96 h-[600px] shadow-xl border-2 border-green-200 mb-4">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">{t.chatTitle}</span>
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
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
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

          {/* Language Selector & Controls */}
          <div className="flex items-center justify-between mt-2">
            <Select value={language} onValueChange={(value: 'English' | 'Hindi' | 'Bengali') => setLanguage(value)}>
              <SelectTrigger className="w-32 h-8 bg-white/20 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">🇬🇧 English</SelectItem>
                <SelectItem value="Hindi">🇮🇳 हिंदी</SelectItem>
                <SelectItem value="Bengali">🇧🇩 বাংলা</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title={t.clearChat}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title="Virtual Keyboard"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-96 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                  }`}
                >
                  {message.isBot ? (
                    <div className="prose prose-sm">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <div className="text-xs opacity-70 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </ScrollArea>
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              className="flex-1"
              disabled={isLoading}
            />
            
            {/* Voice Button */}
            {speechService.isRecognitionSupported && (
              <Button
                variant="outline"
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className={`${isListening ? 'bg-red-100 text-red-600' : ''}`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}

            {/* Speech Toggle */}
            {speechService.isSynthesisSupported && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSpeech}
                className={`${isSpeaking ? 'bg-blue-100 text-blue-600' : ''}`}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}

            <Button
              onClick={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <Card className="w-96 shadow-xl border-2 border-green-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              {keyboardLayouts[language].map((row, i) => (
                <div key={i} className="flex justify-center space-x-1">
                  {row.map((key, j) => (
                    <Button
                      key={j}
                      variant="outline"
                      size="sm"
                      onClick={() => handleVirtualKey(key)}
                      className={`${key === "Space" ? "px-8" : "px-2"} py-1 text-xs h-8`}
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatBot;
