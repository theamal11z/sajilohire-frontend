import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, Bot, User, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useChatHistory, useSendMessage, useStartChat } from "@/hooks/useApi";
import { ChatTurnResponse } from "@/services/api";

const Onboarding = () => {
  const { candidateId } = useParams();
  const personId = candidateId ? parseInt(candidateId) : 0;
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use backend API hooks
  const { data: chatData, isLoading: chatLoading } = useChatHistory(personId);
  const sendMessageMutation = useSendMessage(personId);
  const startChatMutation = useStartChat(personId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!candidateId) {
      toast({
        title: "Error",
        description: "Invalid candidate ID. Please apply first.",
        variant: "destructive",
      });
    }
  }, [candidateId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  // Start conversation if no messages exist yet
  useEffect(() => {
    if (!chatLoading && chatData && chatData.total_turns === 0 && personId > 0) {
      startChatMutation.mutate();
    }
  }, [chatData, chatLoading, personId, startChatMutation]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const response = await sendMessageMutation.mutateAsync(inputMessage);
      setInputMessage("");
      
      // Show success feedback if needed
      if (response.is_complete) {
        toast({
          title: "Interview Complete!",
          description: "You can now view your results.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
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
                <span>{chatData ? Math.round((chatData.total_turns / 10) * 100) : 0}%</span>
              </div>
              <Progress value={chatData ? (chatData.total_turns / 10) * 100 : 0} className="h-2" />
            </div>
          </div>

          {/* Chat Container */}
          <div className="card-elegant">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">Loading chat history...</p>
                </div>
              ) : (
                chatData?.turns.map((turn) => (
                  <div
                    key={turn.id}
                    className={`flex items-start space-x-3 ${
                      turn.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        turn.role === "ai"
                          ? "bg-primary text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {turn.role === "ai" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        turn.role === "ai"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary text-white"
                      }`}
                    >
                      <p className="text-sm">{turn.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(turn.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {sendMessageMutation.isPending && (
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
              {chatData && chatData.total_turns >= 10 ? (
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
                    disabled={sendMessageMutation.isPending}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={sendMessageMutation.isPending || !inputMessage.trim()}
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