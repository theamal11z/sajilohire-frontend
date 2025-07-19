import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, Clock, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useJobs } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

const Jobs = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleApply = (jobId: string) => {
    navigate(`/apply?jobId=${jobId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Find Your Next
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Dream Job</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover opportunities with top companies looking for talented professionals like you.
              </p>
            </div>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Available Positions</h2>
                <Badge variant="secondary" className="px-3 py-1">
                  {jobs?.length || 0} jobs available
                </Badge>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border border-border">
                      <CardHeader>
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full mb-4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : error ? (
                  <div className="card-elegant p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Jobs</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn't fetch the job listings. Please check your connection and try again.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Retry
                    </Button>
                  </div>
                ) : !jobs || jobs.length === 0 ? (
                  <div className="card-elegant p-12 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Jobs Available</h3>
                    <p className="text-muted-foreground">
                      There are currently no job openings. Please check back later.
                    </p>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <Card key={job.id} className="border border-border hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                              {job.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-2">
                              <Building2 className="h-4 w-4" />
                              {job.company}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {job.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req) => (
                            <Badge key={req} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.posted}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-foreground">{job.salary}</span>
                            <Button 
                              onClick={() => handleApply(job.id.toString())}
                              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;