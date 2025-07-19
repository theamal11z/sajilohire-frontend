import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  BarChart3, 
  Users, 
  ArrowRight,
  Sparkles,
  Target,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-secondary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative content-width section-padding py-20 lg:py-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Hiring Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              AI That Helps You
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Hire Better
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Interactive onboarding + intelligent candidate ranking.
              <br />
              Find the perfect fit faster with SajiloHire.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/jobs" className="btn-hero">
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="btn-outline-hero">
                Recruiter Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="content-width section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Revolutionize Your Hiring Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes hiring smarter, faster, and more effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-elegant p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">AI Onboarding</h3>
              <p className="text-muted-foreground">
                Adaptive questions that go deeper. Our AI conducts intelligent conversations 
                to understand candidates beyond their resume.
              </p>
            </div>
            
            <div className="card-elegant p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-xl mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Fit Scoring</h3>
              <p className="text-muted-foreground">
                Skill + motivation + stability. Get comprehensive scoring that evaluates 
                technical ability, cultural fit, and career stability.
              </p>
            </div>
            
            <div className="card-elegant p-8 text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-xl mb-6 group-hover:bg-warning/20 transition-colors duration-300">
                <Users className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Smart Shortlists</h3>
              <p className="text-muted-foreground">
                Recruiters see only the best candidates first. Our ranking system 
                prioritizes quality matches to save you time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card">
        <div className="content-width section-padding">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Accuracy in Fit Prediction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">60%</div>
              <div className="text-muted-foreground">Faster Hiring Process</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-warning mb-2">2x</div>
              <div className="text-muted-foreground">Better Candidate Quality</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
