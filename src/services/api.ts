// Base API configuration
const API_BASE_URL = 'http://localhost:8000';

// API client with error handling
export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

// Type definitions based on SajiloHire backend API schemas
export interface PersonCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_id: number;
}

export interface PersonExtend {
  job_id: number;
  resume_text: string;
  skills?: string;
  intro?: string;
  why_us?: string;
  linkedin?: string;
  github?: string;
}

export interface PersonResponse {
  id: number;
  upstream_person_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_id: number;
  skills_tags: string[];
  resume_text?: string;
  intro?: string;
  why_us?: string;
  linkedin?: string;
  github?: string;
  github_data?: Record<string, any>;
  avatar_url?: string;
  phantombuster_data?: Record<string, any>;
  trust_score?: number;
  social_verification_status?: string;
  created_ts: string;
  last_chat_ts?: string;
}

export interface ChatMessage {
  message: string;
}

export interface ChatTurnResponse {
  id: number;
  turn_index: number;
  role: 'user' | 'ai' | 'system';
  intent: 'skill_probe' | 'motivation' | 'trap' | 'values' | 'scenario' | 'other';
  content: string;
  analysis_json?: Record<string, any>;
  ts: string;
}

export interface ChatResponse {
  agent_reply: string;
  progress: number;
  turn_count: number;
  is_complete: boolean;
}

export interface ChatHistory {
  person_id: number;
  turns: ChatTurnResponse[];
  total_turns: number;
}

export interface CandidateSignalsResponse {
  consistency_score: number;
  depth_score: number;
  motivation_alignment: number;
  culture_alignment: number;
  turnover_risk: number;
  data_confidence: number;
  credibility_flag: boolean;
  flags: string[];
  updated_at: string;
}

export interface CandidateScoreResponse {
  fit_score: number;
  fit_bucket: 'top' | 'borderline' | 'low';
  computed_at: string;
}

export interface JobSkillMatch {
  skill_name: string;
  required_level?: string;
  candidate_level?: string;
  is_mandatory: boolean;
  match_score?: number;
}

export interface JobProfile {
  id: number;
  title: string;
  description?: string;
  role_level: string;
  technical_focus: string[];
  growth_opportunities: string[];
  analyzed_skills?: Record<string, any>;
}

export interface CompanyProfile {
  name?: string;
  industry?: string;
  location?: Record<string, any>;
  industry_insights?: Record<string, any>;
  company_size_estimate?: string;
  business_focus: string[];
}

export interface JobProfileResponse {
  job: JobProfile;
  company: CompanyProfile;
  personalization_context: Record<string, any>;
  interview_focus: Record<string, any>;
  cultural_indicators: string[];
}

export interface FullCandidateResponse {
  person: PersonResponse;
  signals?: CandidateSignalsResponse;
  score?: CandidateScoreResponse;
  chat_history: ChatTurnResponse[];
  job_skills: JobSkillMatch[];
  job_profile?: JobProfileResponse;
  upstream_data?: Record<string, any>;
}

export interface DashboardCandidate {
  person_id: number;
  full_name: string;
  email: string;
  avatar_url?: string;
  fit_score: number;
  fit_bucket: 'top' | 'borderline' | 'low';
  turnover_risk: number;
  flags: string[];
  github_username?: string;
  linkedin_url?: string;
  trust_score?: number;
  social_verification_status?: string;
  professional_insights?: Record<string, any>;
  risk_indicators: string[];
  applied_at: string;
}

export interface DashboardResponse {
  job_id: number;
  job_title: string;
  candidates: DashboardCandidate[];
  total_count: number;
  high_fit_count: number;
}

export interface JobCacheResponse {
  id: number;
  upstream_job_id: number;
  title: string;
  description?: string;
  client_id: number;
  client_name?: string;
  location?: string;
  salary?: string;
  remote?: boolean;
  skills_json: Record<string, any>[];
  job_type?: string;
  employment_type?: string;
  status?: string;
}

export interface JobResponse {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  posted: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  database: string;
  upstream_api: string;
}

export interface EnrichmentStatusResponse {
  person_id: number;
  enrichment_status: 'not_started' | 'processing' | 'verified' | 'needs_review' | 'unverified' | 'failed';
  trust_score?: number;
  has_enrichment_data: boolean;
  status_descriptions: Record<string, string>;
  estimated_completion?: string;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  code?: string;
}

export interface PhantomBusterAnalysisResponse {
  person_id: number;
  candidate_info: {
    name: string;
    email: string;
    linkedin?: string;
    github?: string;
    trust_score?: number;
    verification_status?: string;
  };
  phantombuster_data: Record<string, any>;
  comprehensive_insights: Record<string, any>;
  ai_detailed_analysis: {
    overall_assessment: string;
    strengths: string;
    concerns: string;
    technical_competency: string;
    cultural_fit: string;
    personality_analysis: string;
    interview_recommendations: string;
    final_recommendation: string;
    raw_analysis: string;
    analysis_timestamp: string;
  };
  conversation_history: {
    total_messages: number;
    user_responses: number;
    topics: string[];
    response_quality: string;
    last_interaction?: string;
  };
  analysis_timestamp: string;
  recommendations: string[];
}

export interface PhantomBusterStatusResponse {
  person_id: number;
  enrichment_status: 'not_started' | 'processing' | 'completed' | 'failed';
  has_phantombuster_data: boolean;
  trust_score?: number;
  verification_status?: string;
  enrichment_progress: Record<string, any>;
  last_updated?: string;
}

export interface PhantomBusterEnrichmentTriggerResponse {
  message: string;
  person_id: number;
  status: string;
  estimated_completion: string;
}

// API endpoints matching SajiloHire backend
export const endpoints = {
  // Health
  health: () => '/health',
  
  // Jobs
  jobs: () => '/sajilo/jobs',
  
  // Person Management
  createPerson: () => '/sajilo/person',
  extendPerson: (personId: number) => `/sajilo/person/${personId}/extend`,
  
  // Chat
  startChat: (personId: number) => `/sajilo/chat/${personId}/start`,
  chat: (personId: number) => `/sajilo/chat/${personId}`,
  chatHistory: (personId: number) => `/sajilo/chat/${personId}/history`,
  
  // Dashboard
  dashboard: (jobId: number, includeBorderline: boolean = false) => 
    `/sajilo/dashboard/${jobId}?include_borderline=${includeBorderline}`,
  
  // Candidate Details
  candidate: (personId: number) => `/sajilo/candidate/${personId}/full`,
  
  // Job Profiles
  jobProfile: (jobId: number) => `/sajilo/job-profile/${jobId}`,
  jobProfileContext: (jobId: number) => `/sajilo/job-profile/${jobId}/context`,
  jobSkillsAnalysis: (jobId: number) => `/sajilo/job-profile/${jobId}/skills-analysis`,
  
  // Enhanced Insights
  socialIntelligence: (personId: number) => `/sajilo/insights/${personId}/social-intelligence`,
  professionalSummary: (personId: number) => `/sajilo/insights/${personId}/professional-summary`,
  hrRecommendations: (personId: number) => `/sajilo/insights/${personId}/hr-recommendations`,
  refreshEnrichment: (personId: number) => `/sajilo/insights/${personId}/refresh-enrichment`,
  
  // Enrichment Status
  enrichmentStatus: (personId: number) => `/sajilo/person/${personId}/enrichment-status`,
  
  // Enhanced Candidate Management
  candidateStatus: (personId: number) => `/sajilo/candidate/${personId}/status`,
  triggerEnrichment: (personId: number) => `/sajilo/candidate/${personId}/trigger-enrichment`,
  interviewReadiness: (personId: number) => `/sajilo/candidate/${personId}/interview-readiness`,
  prepareInterview: (personId: number, force?: boolean) => `/sajilo/candidate/${personId}/prepare-interview${force ? '?force=true' : ''}`,
  scoringAnalysis: (personId: number) => `/sajilo/candidate/${personId}/scoring-analysis`,
  
  // AI Scoring Analysis
  aiAnalysis: (personId: number) => `/sajilo/candidate/${personId}/ai-analysis`,
  recomputeScore: (personId: number) => `/sajilo/candidate/${personId}/recompute-score`,
  
  // PhantomBuster Analysis
  phantomBusterAnalysis: (personId: number, refresh?: boolean) => `/sajilo/phantombuster-analysis/${personId}${refresh ? '?refresh=true' : ''}`,
  triggerPhantomBusterEnrichment: (personId: number, forceRefresh?: boolean) => `/sajilo/phantombuster-analysis/${personId}/trigger-enrichment${forceRefresh ? '?force_refresh=true' : ''}`,
  phantomBusterStatus: (personId: number) => `/sajilo/phantombuster-analysis/${personId}/status`,
};
