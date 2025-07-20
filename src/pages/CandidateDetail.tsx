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
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Building
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreBadge } from "@/components/ui/score-badge";
import { RiskTag } from "@/components/ui/risk-tag";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCandidate, useCandidateStatus, useInterviewReadiness, useScoringAnalysis, useTriggerEnrichment, usePrepareInterview } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const candidateIdNum = candidateId ? parseInt(candidateId) : 0;
  
  // Primary candidate data
  const { data: candidateData, isLoading, error } = useCandidate(candidateIdNum);
  
  // Enhanced candidate data
  const { data: candidateStatus } = useCandidateStatus(candidateIdNum);
  const { data: interviewReadiness } = useInterviewReadiness(candidateIdNum);
  const { data: scoringAnalysis } = useScoringAnalysis(candidateIdNum);
  
  // Mutations
  const triggerEnrichment = useTriggerEnrichment();
  const prepareInterview = usePrepareInterview();
  
  const handleTriggerEnrichment = () => {
    triggerEnrichment.mutate(candidateIdNum, {
      onSuccess: (data) => {
        toast({
          title: "Enrichment Triggered",
          description: data.message || "Enrichment analysis has been started.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to trigger enrichment analysis.",
          variant: "destructive"
        });
      }
    });
  };
  
  const handlePrepareInterview = (force = false) => {
    prepareInterview.mutate({ personId: candidateIdNum, force }, {
      onSuccess: (data) => {
        toast({
          title: "Interview Prepared",
          description: data.prepared ? "Interview plan has been generated." : data.reason,
          variant: data.prepared ? "default" : "destructive"
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to prepare interview.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (error || !candidateData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="content-width section-padding py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Candidate Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The candidate you're looking for doesn't exist or there was an error loading the data.
            </p>
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { person, signals, score, chat_history, job_skills, job_profile } = candidateData;
  const fullName = `${person.first_name} ${person.last_name}`;
  
  // Calculate progress and stats
  const totalTurns = chat_history?.length || 0;
  const progress = Math.min((totalTurns / 10) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Candidate Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
            {/* Enhanced Actions */}
            <div className="flex items-center space-x-2">
              {candidateStatus?.enrichment?.status !== 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTriggerEnrichment}
                  disabled={triggerEnrichment.isPending}
                >
                  {triggerEnrichment.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Trigger Enrichment
                </Button>
              )}
              
              {interviewReadiness?.ready_for_interview && !interviewReadiness?.current_interview?.status?.includes('completed') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePrepareInterview()}
                  disabled={prepareInterview.isPending}
                >
                  {prepareInterview.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Prepare Interview
                </Button>
              )}
            </div>
            
            {/* Score Badge */}
            {score && (
              <ScoreBadge value={Math.round(score.fit_score * 100)} size="lg" />
            )}
          </div>
        </div>

        {/* Enhanced Status Overview */}
        {candidateStatus && (
          <div className="card-elegant p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Candidate Status Overview
            </h3>
            
            <div className="grid md:grid-cols-4 gap-4">
              {/* Enrichment Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    candidateStatus.enrichment?.status === 'completed' ? 'bg-green-500' :
                    candidateStatus.enrichment?.status === 'processing' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-foreground">Enrichment</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidateStatus.enrichment?.status === 'completed' ? 'Completed' :
                   candidateStatus.enrichment?.status === 'processing' ? 'In Progress' :
                   'Pending'}
                </p>
                {candidateStatus.enrichment?.trust_score && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Trust: </span>
                    <ScoreBadge value={Math.round(candidateStatus.enrichment.trust_score * 100)} size="xs" />
                  </div>
                )}
              </div>
              
              {/* Profile Completeness */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    candidateStatus.profile_analysis?.completeness_score >= 0.8 ? 'bg-green-500' :
                    candidateStatus.profile_analysis?.completeness_score >= 0.6 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-foreground">Profile</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((candidateStatus.profile_analysis?.completeness_score || 0) * 100)}% Complete
                </p>
                <div className="text-xs text-muted-foreground">
                  Skills: {candidateStatus.profile_analysis?.skills_count || 0}
                </div>
              </div>
              
              {/* Interview Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    candidateStatus.interview?.ready ? 'bg-green-500' :
                    candidateStatus.interview?.statistics?.status === 'in_progress' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-foreground">Interview</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidateStatus.interview?.ready ? 'Ready' :
                   candidateStatus.interview?.statistics?.status === 'in_progress' ? 'In Progress' :
                   candidateStatus.interview?.statistics?.status === 'completed' ? 'Completed' :
                   'Not Ready'}
                </p>
                {candidateStatus.interview?.statistics?.questions_answered > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {candidateStatus.interview.statistics.questions_answered}/{candidateStatus.interview.statistics.planned_questions} Q's
                  </div>
                )}
              </div>
              
              {/* Scoring Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    candidateStatus.scoring?.available ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-foreground">Scoring</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {candidateStatus.scoring?.available ? 'Available' : 'Pending'}
                </p>
                {candidateStatus.scoring?.fit_score && (
                  <div className="text-xs">
                    <ScoreBadge value={Math.round(candidateStatus.scoring.fit_score * 100)} size="xs" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Scores */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="card-elegant p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {person.first_name[0]}{person.last_name[0]}
                </div>
                <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {job_profile?.job?.title || 'Candidate'}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{person.email}</span>
                </div>
                {person.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{person.phone}</span>
                  </div>
                )}
                {job_profile?.company?.location && (
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {job_profile.company.location.city}, {job_profile.company.location.state}
                    </span>
                  </div>
                )}
                {person.linkedin && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a href={person.linkedin} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {person.github && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a href={person.github} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub Profile
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Applied {new Date(person.created_ts).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Skills Tags */}
              {person.skills_tags && person.skills_tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {person.skills_tags.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Score Breakdown */}
            {(signals || score) && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Assessment Results
                </h3>
                
                <div className="space-y-4">
                  {score && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Overall Fit</span>
                        <ScoreBadge value={Math.round(score.fit_score * 100)} size="sm" />
                      </div>
                      <Progress value={score.fit_score * 100} className="h-2" />
                      <div className="mt-1">
                        <Badge variant={score.fit_bucket === 'top' ? 'default' : score.fit_bucket === 'borderline' ? 'secondary' : 'outline'}>
                          {score.fit_bucket} fit
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {signals && (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Consistency Score</span>
                          <ScoreBadge value={Math.round(signals.consistency_score * 100)} size="sm" />
                        </div>
                        <Progress value={signals.consistency_score * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Technical Depth</span>
                          <ScoreBadge value={Math.round(signals.depth_score * 100)} size="sm" />
                        </div>
                        <Progress value={signals.depth_score * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Culture Alignment</span>
                          <ScoreBadge value={Math.round(signals.culture_alignment * 100)} size="sm" />
                        </div>
                        <Progress value={signals.culture_alignment * 100} className="h-2" />
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Turnover Risk</span>
                          <RiskTag risk={signals.turnover_risk} size="sm" />
                        </div>
                      </div>

                      {person.trust_score && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">Trust Score</span>
                            <ScoreBadge value={Math.round(person.trust_score * 100)} size="sm" />
                          </div>
                          <Progress value={person.trust_score * 100} className="h-2" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Context */}
            {job_profile && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Job & Company Context
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Position</h4>
                    <p className="text-sm text-muted-foreground">{job_profile.job?.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Level: {job_profile.job?.role_level}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Company</h4>
                    <p className="text-sm text-muted-foreground">{job_profile.company?.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Industry: {job_profile.company?.industry}</p>
                  </div>
                </div>
                {job_profile.job?.technical_focus && job_profile.job.technical_focus.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Technical Focus</h4>
                    <div className="flex flex-wrap gap-1">
                      {job_profile.job.technical_focus.map((focus) => (
                        <Badge key={focus} variant="outline" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resume Section */}
            {person.resume_text && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Resume</h3>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {person.resume_text}
                </div>
              </div>
            )}

            {/* Personal Statements */}
            {(person.intro || person.why_us) && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Personal Statements</h3>
                <div className="space-y-4">
                  {person.intro && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Introduction</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{person.intro}</p>
                    </div>
                  )}
                  {person.why_us && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Why This Company</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{person.why_us}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat Transcript */}
            {chat_history && chat_history.length > 0 && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  AI Interview Transcript
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chat_history.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === "ai"
                            ? "bg-primary text-white"
                            : "bg-secondary text-white"
                        }`}
                      >
                        {message.role === "ai" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div
                        className={`max-w-lg px-4 py-3 rounded-lg ${
                          message.role === "ai"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {new Date(message.ts).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Interview Progress</span>
                    <span className="text-foreground">{totalTurns} messages</span>
                  </div>
                  <Progress value={progress} className="h-2 mt-2" />
                </div>
              </div>
            )}

            {/* Enhanced Scoring Analysis */}
            {scoringAnalysis && scoringAnalysis.scoring_available && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Detailed Scoring Analysis
                </h3>
                
                <div className="space-y-4">
                  {/* Component Breakdown */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Component Breakdown</h4>
                    <div className="space-y-3">
                      {Object.entries(scoringAnalysis.breakdown.components).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <ScoreBadge value={Math.round((value as number) * 100)} size="sm" />
                          </div>
                          <Progress value={(value as number) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  {scoringAnalysis.recommendations && scoringAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {scoringAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-sm text-foreground">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Analysis Confidence */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Analysis Confidence</span>
                      <ScoreBadge value={Math.round(scoringAnalysis.analysis_confidence * 100)} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Flags and Warnings */}
            {signals?.flags && signals.flags.length > 0 && (
              <div className="card-elegant p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Assessment Flags
                </h3>
                <div className="space-y-2">
                  {signals.flags.map((flag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm text-foreground">{flag.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CandidateDetail;
