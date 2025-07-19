import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Filter, Users, Briefcase } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreBadge } from "@/components/ui/score-badge";
import { RiskTag } from "@/components/ui/risk-tag";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboard, useJobs } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { data: jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState("");
  const [includeBorderline, setIncludeBorderline] = useState(false);
  const { data, isLoading, error } = useDashboard(parseInt(selectedJob), includeBorderline);

  // Set default job when jobs are loaded
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0].id.toString());
    }
  }, [jobs, selectedJob]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    }
  }, [error]);

  const candidates = data ? data.candidates : [];
  const highFitCount = candidates.filter(c => c.fit_bucket === "top").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">
            Manage candidates and track hiring progress for your open positions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-elegant p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{candidates.length}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{highFitCount}</p>
                <p className="text-sm text-muted-foreground">High Fit</p>
              </div>
            </div>
          </div>
          
          <div className="card-elegant p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Filter className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {candidates.length > 0 ? Math.round((highFitCount / candidates.length) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Quality Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-elegant p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job Position
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full p-3 border border-input rounded-lg bg-background"
                disabled={!jobs || jobs.length === 0}
              >
                {!jobs || jobs.length === 0 ? (
                  <option value="">No jobs available</option>
                ) : (
                  jobs.map((job) => (
                    <option key={job.id} value={job.id.toString()}>
                      {job.title} - {job.company}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="borderline"
                checked={includeBorderline}
                onCheckedChange={(checked) => setIncludeBorderline(checked as boolean)}
              />
              <label htmlFor="borderline" className="text-sm font-medium text-foreground">
                Show borderline candidates
              </label>
            </div>
          </div>
        </div>

        {/* Current Selection */}
        {data && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Candidates for {data.job_title}
            </h2>
            <p className="text-muted-foreground">Job ID: {data.job_id}</p>
          </div>
        )}

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="flex justify-center">Loading candidates...</div>
        ) : (
          candidates.length === 0 ? (
            <div className="card-elegant p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No candidates yet</h3>
              <p className="text-muted-foreground">
                No candidates have applied for this position yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate.person_id} className="card-interactive p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{candidate.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                    <ScoreBadge value={candidate.fit_score} size="sm" />
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Turnover Risk</span>
                      <RiskTag risk={candidate.turnover_risk} size="sm" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Applied</span>
                      <span className="text-sm text-foreground">
                        {new Date(candidate.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    {candidate.trust_score && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Trust Score</span>
                        <span className="text-sm text-foreground">
                          {Math.round(candidate.trust_score * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {candidate.flags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.flags.map((flag) => (
                          <span
                            key={flag}
                            className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full"
                          >
                            {flag.replace("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Link to={`/candidate/${candidate.person_id}`}>
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
