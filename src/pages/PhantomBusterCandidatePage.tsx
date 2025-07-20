import { useParams, Link } from "react-router-dom";
import { 
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Bot,
  User,
  Brain,
  Target,
  MessageSquare,
  Clock,
  Shield,
  ExternalLink,
  TrendingUp,
  Users,
  Award,
  RefreshCw
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePhantomBusterAnalysis, usePhantomBusterStatus, useTriggerPhantomBusterEnrichment } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

const PhantomBusterCandidatePage = () => {
  const { candidateId } = useParams();
  const personId = candidateId ? parseInt(candidateId) : 0;

  const { data: analysisData, isLoading: isAnalysisLoading, error: analysisError, refetch: refetchAnalysis } = usePhantomBusterAnalysis(personId);
  const { data: statusData, isLoading: isStatusLoading, error: statusError, refetch: refetchStatus } = usePhantomBusterStatus(personId);
  const triggerEnrichment = useTriggerPhantomBusterEnrichment();

  const handleTriggerEnrichment = async () => {
    try {
      await triggerEnrichment.mutateAsync({ personId, forceRefresh: true });
      toast({
        title: "Enrichment Triggered",
        description: "PhantomBuster enrichment has been started.",
      });
      // Refetch data after triggering
      setTimeout(() => {
        refetchStatus();
        refetchAnalysis();
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger enrichment.",
        variant: "destructive",
      });
    }
  };

  if (isAnalysisLoading || isStatusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (analysisError || statusError || !analysisData || !statusData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="content-width section-padding py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Data Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The data you're looking for doesn't exist or there was an error loading the data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={`/candidate/${candidateId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Candidate
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Bot className="h-8 w-8 mr-3 text-primary" />
                PhantomBuster Analysis
              </h1>
              <p className="text-muted-foreground mt-1">
                {analysisData?.candidate_info.name || 'Candidate'} • ID: {candidateId}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleTriggerEnrichment} 
            disabled={triggerEnrichment.isPending}
            variant="outline"
          >
            {triggerEnrichment.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Analysis
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Overview */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Candidate Overview
                </CardTitle>
                <CardDescription>
                  Last analyzed on {analysisData?.analysis_timestamp ? new Date(analysisData.analysis_timestamp).toLocaleString() : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                    <p className="text-foreground">{analysisData?.candidate_info.name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <p className="text-foreground">{analysisData?.candidate_info.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Trust Score</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant={analysisData?.candidate_info.trust_score ? (analysisData.candidate_info.trust_score > 7 ? "default" : "secondary") : "outline"}>
                        {analysisData?.candidate_info.trust_score || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Verification</span>
                    <Badge variant={analysisData?.candidate_info.verification_status === 'verified' ? 'default' : 'secondary'}>
                      {analysisData?.candidate_info.verification_status || 'Pending'}
                    </Badge>
                  </div>
                </div>
                
                {(analysisData?.candidate_info.linkedin || analysisData?.candidate_info.github) && (
                  <div className="pt-4 border-t border-border">
                    <span className="text-sm font-medium text-muted-foreground mb-2 block">Social Profiles</span>
                    <div className="flex space-x-2">
                      {analysisData?.candidate_info.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={analysisData.candidate_info.linkedin} target="_blank" rel="noopener noreferrer">
                            LinkedIn <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {analysisData?.candidate_info.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={analysisData.candidate_info.github} target="_blank" rel="noopener noreferrer">
                            GitHub <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {analysisData?.ai_detailed_analysis && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Overall Assessment
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysisData.ai_detailed_analysis.overall_assessment}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Strengths</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysisData.ai_detailed_analysis.strengths}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Concerns</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysisData.ai_detailed_analysis.concerns}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Technical Competency
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysisData.ai_detailed_analysis.technical_competency}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Cultural Fit
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysisData.ai_detailed_analysis.cultural_fit}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Personality Analysis</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysisData.ai_detailed_analysis.personality_analysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Recommendations */}
            {analysisData?.ai_detailed_analysis?.interview_recommendations && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Interview Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysisData.ai_detailed_analysis.interview_recommendations}
                  </p>
                  
                  {analysisData.ai_detailed_analysis.final_recommendation && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-foreground mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          Final Recommendation
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {analysisData.ai_detailed_analysis.final_recommendation}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Comprehensive Insights */}
            {analysisData?.comprehensive_insights && Object.keys(analysisData.comprehensive_insights).length > 0 && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Comprehensive Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(analysisData.comprehensive_insights, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Status & Metadata */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enrichment Status */}
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Enrichment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={statusData?.enrichment_status === 'completed' ? 'default' : 'secondary'}>
                    {statusData?.enrichment_status || 'Unknown'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Has Data</span>
                  <Badge variant={statusData?.has_phantombuster_data ? 'default' : 'outline'}>
                    {statusData?.has_phantombuster_data ? 'Yes' : 'No'}
                  </Badge>
                </div>
                
                {statusData?.last_updated && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-xs text-foreground">
                      {new Date(statusData.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {statusData?.enrichment_progress && Object.keys(statusData.enrichment_progress).length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <span className="text-sm font-medium text-muted-foreground mb-2 block">Progress Details</span>
                    <div className="space-y-1">
                      {Object.entries(statusData.enrichment_progress).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conversation History */}
            {analysisData?.conversation_history && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Conversation Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Messages</span>
                    <Badge variant="outline">
                      {analysisData.conversation_history.total_messages}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User Responses</span>
                    <Badge variant="outline">
                      {analysisData.conversation_history.user_responses}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Quality</span>
                    <Badge variant={analysisData.conversation_history.response_quality === 'high' ? 'default' : 'secondary'}>
                      {analysisData.conversation_history.response_quality || 'N/A'}
                    </Badge>
                  </div>
                  
                  {analysisData.conversation_history.topics && analysisData.conversation_history.topics.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <span className="text-sm font-medium text-muted-foreground mb-2 block">Discussion Topics</span>
                      <div className="flex flex-wrap gap-1">
                        {analysisData.conversation_history.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisData.conversation_history.last_interaction && (
                    <div className="pt-2">
                      <span className="text-sm text-muted-foreground">Last Interaction</span>
                      <p className="text-xs text-foreground">
                        {new Date(analysisData.conversation_history.last_interaction).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {analysisData?.recommendations && analysisData.recommendations.length > 0 && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Key Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Raw PhantomBuster Data */}
            {analysisData?.phantombuster_data && Object.keys(analysisData.phantombuster_data).length > 0 && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Raw Data</CardTitle>
                  <CardDescription>Raw PhantomBuster enrichment data</CardDescription>
                </CardHeader>
                <CardContent>
                  <details className="cursor-pointer">
                    <summary className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      View Raw Data
                    </summary>
                    <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto mt-2 max-h-60">
                      {JSON.stringify(analysisData.phantombuster_data, null, 2)}
                    </pre>
                  </details>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PhantomBusterCandidatePage;

