import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, FileText } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const mockJobs = [
  { id: 1, title: "Senior Frontend Developer", company: "TechCorp", location: "Remote" },
  { id: 2, title: "Full Stack Engineer", company: "StartupABC", location: "San Francisco" },
  { id: 3, title: "UI/UX Designer", company: "DesignStudio", location: "New York" },
  { id: 4, title: "Data Scientist", company: "DataFlow", location: "Boston" },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string;
  resumeText: string;
  intro: string;
  whyUs: string;
  linkedin: string;
  github: string;
}

const Apply = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skills: "",
    resumeText: "",
    intro: "",
    whyUs: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    if (!jobId) {
      navigate('/jobs');
    }
  }, [jobId, navigate]);

  const steps = [
    {
      id: "contact",
      title: "Your Info",
      icon: User,
      fields: ["firstName", "lastName", "email", "phone"],
    },
    {
      id: "profile",
      title: "Profile & Resume",
      icon: FileText,
      fields: ["skills", "resumeText", "intro", "whyUs", "linkedin", "github"],
    },
  ];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Mock API call
    try {
      console.log("Form submitted:", { ...formData, jobId });
      toast({
        title: "Application Submitted!",
        description: "Starting AI onboarding process...",
      });
      
      // Mock candidate ID
      const mockCandidateId = `candidate_${Date.now()}`;
      navigate(`/onboarding/${mockCandidateId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case "contact":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => updateFormData("skills", e.target.value)}
                placeholder="React, TypeScript, Node.js, Python"
              />
            </div>
            
            <div>
              <Label htmlFor="resumeText">Resume Text *</Label>
              <Textarea
                id="resumeText"
                rows={6}
                value={formData.resumeText}
                onChange={(e) => updateFormData("resumeText", e.target.value)}
                placeholder="Paste your resume content here..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="intro">Tell us about yourself</Label>
              <Textarea
                id="intro"
                rows={4}
                value={formData.intro}
                onChange={(e) => updateFormData("intro", e.target.value)}
                placeholder="Brief introduction about your background and experience..."
              />
            </div>
            
            <div>
              <Label htmlFor="whyUs">Why do you want to work with us?</Label>
              <Textarea
                id="whyUs"
                rows={4}
                value={formData.whyUs}
                onChange={(e) => updateFormData("whyUs", e.target.value)}
                placeholder="What interests you about this role and company..."
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => updateFormData("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.github}
                  onChange={(e) => updateFormData("github", e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-width section-padding py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Apply for a Position
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our AI-powered hiring process and discover your perfect fit.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "border-primary bg-primary text-white"
                          : isCompleted
                          ? "border-secondary bg-secondary text-white"
                          : "border-muted-foreground/30 bg-background text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 w-16 md:w-24 ml-4 transition-all duration-300 ${
                          isCompleted ? "bg-secondary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-sm font-medium ${
                    index === currentStep
                      ? "text-primary"
                      : index < currentStep
                      ? "text-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="card-elegant p-8 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {steps[currentStep].title}
            </h2>
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} className="flex items-center">
                Start AI Onboarding
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Apply;