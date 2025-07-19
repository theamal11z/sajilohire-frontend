import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, Bot, User, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Onboarding = () => {
  const { candidateId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: "welcome",
        text: "Hello! I'm your AI interviewer. I'll be asking you some questions to better understand your background, skills, and motivations. This conversation will help us assess your fit for the position. Are you ready to get started?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mockQuestions = [
    "Can you tell me about a challenging project you've worked on recently?",
    "How do you approach learning new technologies?",
    "What motivates you in your day-to-day work?",
    "Describe a time when you had to work with a difficult team member.",
    "Where do you see yourself in 5 years?",
    "What interests you most about this role?",
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const currentProgress = progress + (100 / mockQuestions.length);
      setProgress(Math.min(currentProgress, 100));

      let botResponse = "";
      if (currentProgress < 100) {
        const questionIndex = Math.floor(currentProgress / (100 / mockQuestions.length));
        botResponse = mockQuestions[questionIndex] || "Thank you for that insight. Can you tell me more about your experience?";
      } else {
        botResponse = "Thank you for completing the onboarding process! I have gathered enough information to assess your fit for the position. You can now view your results.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">AI Onboarding</h1>
            <p className="text-muted-foreground">
              Complete your interactive interview to get matched with the perfect role.
            </p>
            
            {/* Progress */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Chat Container */}
          <div className="card-elegant">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "bot"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.sender === "bot"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-6">
              {progress >= 100 ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center text-success">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    <span className="font-medium">Onboarding Complete!</span>
                  </div>
                  <Link to={`/candidate/${candidateId}`}>
                    <Button className="w-full">View My Score</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your response..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;