import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  Loader2,
  AlertCircle,
  CheckCircle,
  Star,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobProfile } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

const JobProfile = () => {
  const { jobId } = useParams();
  const { data: jobProfileData, isLoading, error } = useJobProfile(jobId ? parseInt(jobId) : 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (error || !jobProfileData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="content-width section-padding py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Job Profile Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The job profile you're looking for doesn't exist or there was an error loading the data.
            </p>
            <Link to="/jobs">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { job, company, personalization_context, interview_focus, cultural_indicators } = jobProfileData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/jobs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Job Profile</h1>
          </div>
          <Link to={`/dashboard`}>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              View Candidates
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Job Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <Card className="card-elegant">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-foreground">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Building2 className="h-4 w-4" />
                      {company?.name || 'Company Name'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    {job.role_level || 'Mid-level'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Job Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {company?.location?.city && company?.location?.state 
                        ? `${company.location.city}, ${company.location.state}`
                        : 'Location not specified'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {company?.industry || 'Industry not specified'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Focus */}
            {job.technical_focus && job.technical_focus.length > 0 && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Technical Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.technical_focus.map((focus) => (
                      <Badge key={focus} variant="outline" className="px-3 py-1">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills Analysis */}
            {job.analyzed_skills && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {job.analyzed_skills.categories && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Mandatory Skills */}
                      {job.analyzed_skills.categories.mandatory && job.analyzed_skills.categories.mandatory.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-3 flex items-center">
                            <Star className="h-4 w-4 mr-1 text-destructive" />
                            Required Skills
                          </h4>
                          <div className="space-y-1">
                            {job.analyzed_skills.categories.mandatory.map((skill) => (
                              <Badge key={skill} variant="destructive" className="text-xs mr-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Preferred Skills */}
                      {job.analyzed_skills.categories.preferred && job.analyzed_skills.categories.preferred.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Preferred Skills</h4>
                          <div className="space-y-1">
                            {job.analyzed_skills.categories.preferred.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs mr-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Skills */}
                      {job.analyzed_skills.categories.technical && job.analyzed_skills.categories.technical.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Technical Skills</h4>
                          <div className="space-y-1">
                            {job.analyzed_skills.categories.technical.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs mr-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Frameworks */}
                      {job.analyzed_skills.categories.frameworks && job.analyzed_skills.categories.frameworks.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Frameworks & Tools</h4>
                          <div className="space-y-1">
                            {job.analyzed_skills.categories.frameworks.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs mr-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {job.analyzed_skills.total_skills || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Skills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-destructive">
                        {job.analyzed_skills.mandatory_count || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Required</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {job.analyzed_skills.technical_depth || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Technical Depth</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">
                        {job.analyzed_skills.primary_technologies?.length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Key Technologies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Growth Opportunities */}
            {job.growth_opportunities && job.growth_opportunities.length > 0 && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {job.growth_opportunities.map((opportunity) => (
                      <div key={opportunity} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-foreground">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Company & Context */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Information */}
            {company && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Company Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{company.name}</h4>
                    <p className="text-sm text-muted-foreground">{company.industry}</p>
                  </div>
                  
                  {company.location && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Location</h5>
                      <p className="text-sm text-muted-foreground">
                        {company.location.city}, {company.location.state} {company.location.zip}
                      </p>
                    </div>
                  )}

                  {company.company_size_estimate && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Company Size</h5>
                      <p className="text-sm text-muted-foreground">{company.company_size_estimate}</p>
                    </div>
                  )}

                  {company.business_focus && company.business_focus.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">Business Focus</h5>
                      <div className="flex flex-wrap gap-1">
                        {company.business_focus.map((focus) => (
                          <Badge key={focus} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Industry Insights */}
                  {company.industry_insights && (
                    <div className="pt-4 border-t border-border">
                      <h5 className="text-sm font-medium text-foreground mb-2">Industry Values</h5>
                      {company.industry_insights.values && company.industry_insights.values.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {company.industry_insights.values.map((value) => (
                            <Badge key={value} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cultural Indicators */}
            {cultural_indicators && cultural_indicators.length > 0 && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Cultural Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cultural_indicators.map((indicator) => (
                      <div key={indicator} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground capitalize">{indicator.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Focus */}
            {interview_focus && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Interview Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interview_focus.primary_skills_to_probe && interview_focus.primary_skills_to_probe.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">Primary Skills Assessment</h5>
                      <div className="flex flex-wrap gap-1">
                        {interview_focus.primary_skills_to_probe.map((skill) => (
                          <Badge key={skill} variant="destructive" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {interview_focus.secondary_skills_to_explore && interview_focus.secondary_skills_to_explore.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2">Secondary Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {interview_focus.secondary_skills_to_explore.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {interview_focus.experience_level_to_assess && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Target Experience Level</h5>
                      <Badge variant="outline" className="capitalize">
                        {interview_focus.experience_level_to_assess}
                      </Badge>
                    </div>
                  )}

                  {interview_focus.scenario_complexity && (
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-1">Interview Complexity</h5>
                      <Badge variant="outline" className="capitalize">
                        {interview_focus.scenario_complexity}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Personalization Context */}
            {personalization_context && (
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    AI Personalization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {personalization_context.seniority_level && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seniority:</span>
                      <span className="text-foreground capitalize">{personalization_context.seniority_level}</span>
                    </div>
                  )}
                  {personalization_context.role_focus && personalization_context.role_focus.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Focus:</span>
                      <span className="text-foreground">{personalization_context.role_focus.join(', ')}</span>
                    </div>
                  )}
                  {personalization_context.key_skills && personalization_context.key_skills.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Key Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {personalization_context.key_skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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

export default JobProfile;
