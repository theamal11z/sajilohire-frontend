import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Filter, Users, Briefcase } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreBadge } from "@/components/ui/score-badge";
import { RiskTag } from "@/components/ui/risk-tag";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Candidate {
  personId: string;
  fullName: string;
  email: string;
  fitScore: number;
  fitBucket: "high" | "medium" | "low";
  turnoverRisk: number;
  flags: string[];
  appliedAt: string;
}

const mockJobs = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp" },
  { id: 2, title: "Full Stack Engineer", company: "StartupABC" },
  { id: 3, title: "UI/UX Designer", company: "DesignStudio" },
];

const mockCandidates: Candidate[] = [
  {
    personId: "candidate_1",
    fullName: "Sarah Johnson",
    email: "sarah.j@email.com",
    fitScore: 92,
    fitBucket: "high",
    turnoverRisk: 0.2,
    flags: ["top-performer"],
    appliedAt: "2025-01-19",
  },
  {
    personId: "candidate_2", 
    fullName: "Michael Chen",
    email: "m.chen@email.com",
    fitScore: 78,
    fitBucket: "medium",
    turnoverRisk: 0.4,
    flags: ["cultural-fit"],
    appliedAt: "2025-01-18",
  },
  {
    personId: "candidate_3",
    fullName: "Emily Rodriguez",
    email: "emily.r@email.com",
    fitScore: 85,
    fitBucket: "high",
    turnoverRisk: 0.3,
    flags: ["quick-learner"],
    appliedAt: "2025-01-17",
  },
  {
    personId: "candidate_4",
    fullName: "James Wilson",
    email: "j.wilson@email.com",
    fitScore: 65,
    fitBucket: "medium",
    turnoverRisk: 0.6,
    flags: ["needs-support"],
    appliedAt: "2025-01-16",
  },
  {
    personId: "candidate_5",
    fullName: "Lisa Park",
    email: "lisa.park@email.com",
    fitScore: 45,
    fitBucket: "low",
    turnoverRisk: 0.8,
    flags: ["skill-gap"],
    appliedAt: "2025-01-15",
  },
];

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState("1");
  const [includeBorderline, setIncludeBorderline] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // Filter candidates based on job selection and borderline setting
    let candidates = mockCandidates;
    
    if (!includeBorderline) {
      candidates = candidates.filter(c => c.fitBucket !== "low");
    }
    
    // Sort by fit score descending
    candidates.sort((a, b) => b.fitScore - a.fitScore);
    
    setFilteredCandidates(candidates);
  }, [selectedJob, includeBorderline]);

  const selectedJobData = mockJobs.find(job => job.id.toString() === selectedJob);
  const highFitCount = filteredCandidates.filter(c => c.fitBucket === "high").length;
  const totalCount = filteredCandidates.length;

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
                <p className="text-2xl font-bold text-foreground">{totalCount}</p>
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
                  {totalCount > 0 ? Math.round((highFitCount / totalCount) * 100) : 0}%
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
              >
                {mockJobs.map((job) => (
                  <option key={job.id} value={job.id.toString()}>
                    {job.title} - {job.company}
                  </option>
                ))}
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
        {selectedJobData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Candidates for {selectedJobData.title}
            </h2>
            <p className="text-muted-foreground">{selectedJobData.company}</p>
          </div>
        )}

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="card-elegant p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No candidates yet</h3>
            <p className="text-muted-foreground">
              No candidates have applied for this position yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.personId} className="card-interactive p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{candidate.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <ScoreBadge value={candidate.fitScore} size="sm" />
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Turnover Risk</span>
                    <RiskTag risk={candidate.turnoverRisk} size="sm" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applied</span>
                    <span className="text-sm text-foreground">
                      {new Date(candidate.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
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
                
                <Link to={`/candidate/${candidate.personId}`}>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;