import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github,
  MessageSquare,
  User,
  Bot,
  Award,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreBadge } from "@/components/ui/score-badge";
import { RiskTag } from "@/components/ui/risk-tag";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCandidate } from "@/hooks/useApi";


const CandidateDetail = () => {
const { candidateId } = useParams();
  const { data: candidate, isLoading } = useCandidate(candidateId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!candidate) {
    return <div className="text-center">Candidate not found.</div>;
  }

  const getSkillMatch = (skillName: string) => {
    const jobSkill = candidate.jobSkills.find(s => s.name === skillName);
    const personSkill = candidate.personSkills.find(s => s.name === skillName);
    
    if (!jobSkill || !personSkill) return null;
    
    return {
      ...jobSkill,
      candidateLevel: personSkill.level,
      match: Math.min((personSkill.level / jobSkill.level) * 100, 100),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Candidate Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Scores */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="card-elegant p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {candidate.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-bold text-foreground">{candidate.fullName}</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{candidate.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{candidate.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a href={candidate.linkedin} className="text-primary hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <a href={candidate.github} className="text-primary hover:underline">
                    GitHub Profile
                  </a>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="card-elegant p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Score Breakdown
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Overall Fit</span>
                    <ScoreBadge value={candidate.fitScore} size="sm" />
                  </div>
                  <Progress value={candidate.fitScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Culture Alignment</span>
                    <ScoreBadge value={candidate.cultureAlignment} size="sm" />
                  </div>
                  <Progress value={candidate.cultureAlignment} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Technical Depth</span>
                    <ScoreBadge value={candidate.depthScore} size="sm" />
                  </div>
                  <Progress value={candidate.depthScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Data Confidence</span>
                    <ScoreBadge value={candidate.dataConfidence} size="sm" />
                  </div>
                  <Progress value={candidate.dataConfidence} className="h-2" />
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Turnover Risk</span>
                    <RiskTag risk={candidate.turnoverRisk} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Section */}
            <div className="card-elegant p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Resume</h3>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                {candidate.resumeText}
              </pre>
            </div>

            {/* Skills Matrix */}
            <div className="card-elegant p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Skills Assessment
              </h3>
              
              <div className="space-y-4">
                {candidate.jobSkills.map((jobSkill) => {
                  const match = getSkillMatch(jobSkill.name);
                  
                  return (
                    <div key={jobSkill.name} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{jobSkill.name}</span>
                          {jobSkill.required && (
                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        {match && (
                          <ScoreBadge value={match.match} size="sm" />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Required Level: </span>
                          <span className="text-foreground">{jobSkill.level}/5</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Candidate Level: </span>
                          <span className="text-foreground">
                            {match ? `${match.candidateLevel}/5` : "Not assessed"}
                          </span>
                        </div>
                      </div>
                      
                      {match && (
                        <div className="mt-3">
                          <Progress value={(match.candidateLevel / 5) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Transcript */}
            <div className="card-elegant p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                AI Interview Transcript
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {candidate.chatHistory.map((message) => (
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
                      className={`max-w-lg px-4 py-3 rounded-lg ${
                        message.sender === "bot"
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CandidateDetail;