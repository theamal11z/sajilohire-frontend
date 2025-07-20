import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEnrichmentStatus } from "@/hooks/useApi";

interface EnrichmentProgressProps {
  personId: number;
  onComplete?: () => void;
  onDismiss?: () => void;
}

const EnrichmentProgress = ({ personId, onComplete, onDismiss }: EnrichmentProgressProps) => {
  const { data: enrichmentData, isLoading } = useEnrichmentStatus(personId);
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Simulate progress animation
  useEffect(() => {
    if (enrichmentData?.enrichment_status === 'processing') {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        
        // Simulate gradual progress (reaches ~80% in 2 minutes, then waits for completion)
        setProgress(prev => {
          if (prev < 80) {
            return Math.min(prev + 2, 80);
          }
          return prev;
        });
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    } else if (enrichmentData?.enrichment_status === 'verified' || 
               enrichmentData?.enrichment_status === 'needs_review' ||
               enrichmentData?.enrichment_status === 'unverified') {
      setProgress(100);
      setTimeout(() => onComplete?.(), 2000); // Auto-dismiss after 2 seconds
    } else if (enrichmentData?.enrichment_status === 'failed') {
      setProgress(0);
    }
  }, [enrichmentData?.enrichment_status, onComplete]);

  if (isLoading || !enrichmentData) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Loading status...</h3>
          </div>
        </div>
      </div>
    );
  }

  const { enrichment_status, status_descriptions, trust_score, has_enrichment_data } = enrichmentData;

  const getStatusConfig = () => {
    switch (enrichment_status) {
      case 'processing':
        return {
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-blue-50 border-blue-200',
          titleColor: 'text-blue-900',
          title: 'Analyzing Your Profile',
          showProgress: true,
          showDismiss: false,
        };
      case 'verified':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          bgColor: 'bg-green-50 border-green-200',
          titleColor: 'text-green-900',
          title: 'Profile Verified!',
          showProgress: false,
          showDismiss: true,
        };
      case 'needs_review':
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          bgColor: 'bg-yellow-50 border-yellow-200',
          titleColor: 'text-yellow-900',
          title: 'Profile Analyzed',
          showProgress: false,
          showDismiss: true,
        };
      case 'unverified':
        return {
          icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
          bgColor: 'bg-orange-50 border-orange-200',
          titleColor: 'text-orange-900',
          title: 'Profile Analysis Complete',
          showProgress: false,
          showDismiss: true,
        };
      case 'failed':
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          bgColor: 'bg-red-50 border-red-200',
          titleColor: 'text-red-900',
          title: 'Analysis Failed',
          showProgress: false,
          showDismiss: true,
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          bgColor: 'bg-gray-50 border-gray-200',
          titleColor: 'text-gray-900',
          title: 'Profile Analysis',
          showProgress: false,
          showDismiss: true,
        };
    }
  };

  const config = getStatusConfig();
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${config.bgColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {config.icon}
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${config.titleColor}`}>
              {config.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {status_descriptions[enrichment_status]}
            </p>
            
            {config.showProgress && (
              <div className="mt-3 space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Analyzing LinkedIn and social profiles...</span>
                  <span>{formatTime(timeElapsed)} elapsed</span>
                </div>
              </div>
            )}
            
            {trust_score && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Trust Score: {Math.round(trust_score * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
        
        {config.showDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {enrichment_status === 'processing' && (
        <div className="mt-3 text-xs text-blue-600">
          💡 While we analyze your profile, you can start your AI interview below
        </div>
      )}
    </div>
  );
};

export default EnrichmentProgress;
