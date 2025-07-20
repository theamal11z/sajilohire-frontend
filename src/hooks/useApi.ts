import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiClient, 
  endpoints, 
  DashboardResponse, 
  FullCandidateResponse,
  JobProfileResponse,
  ChatResponse,
  ChatHistory,
  PersonCreate,
  PersonExtend,
  PersonResponse,
  HealthResponse,
  JobResponse
} from '../services/api';

// Query keys for React Query cache management
export const queryKeys = {
  jobs: ['jobs'] as const,
  dashboard: (jobId: number, includeBorderline: boolean = false) => ['dashboard', jobId, includeBorderline] as const,
  candidate: (personId: number) => ['candidate', personId] as const,
  jobProfile: (jobId: number) => ['jobProfile', jobId] as const,
  chatHistory: (personId: number) => ['chat', personId] as const,
  health: ['health'] as const,
  socialIntelligence: (personId: number) => ['socialIntelligence', personId] as const,
  professionalSummary: (personId: number) => ['professionalSummary', personId] as const,
  hrRecommendations: (personId: number) => ['hrRecommendations', personId] as const,
};

// Health check hook
export const useHealth = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: () => apiClient.get<HealthResponse>(endpoints.health()),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Jobs hook
export const useJobs = () => {
  return useQuery({
    queryKey: queryKeys.jobs,
    queryFn: () => apiClient.get<JobResponse[]>(endpoints.jobs()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Dashboard hooks
export const useDashboard = (jobId: number, includeBorderline: boolean = false) => {
  return useQuery({
    queryKey: queryKeys.dashboard(jobId, includeBorderline),
    queryFn: () => apiClient.get<DashboardResponse>(endpoints.dashboard(jobId, includeBorderline)),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Candidate hooks
export const useCandidate = (personId: number) => {
  return useQuery({
    queryKey: queryKeys.candidate(personId),
    queryFn: () => apiClient.get<FullCandidateResponse>(endpoints.candidate(personId)),
    enabled: !!personId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Job profile hooks
export const useJobProfile = (jobId: number) => {
  return useQuery({
    queryKey: queryKeys.jobProfile(jobId),
    queryFn: () => apiClient.get<JobProfileResponse>(endpoints.jobProfile(jobId)),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Chat hooks
export const useChatHistory = (personId: number) => {
  return useQuery({
    queryKey: queryKeys.chatHistory(personId),
    queryFn: () => apiClient.get<ChatHistory>(endpoints.chatHistory(personId)),
    enabled: !!personId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
    staleTime: 0, // Always fresh for real-time chat
    retry: (failureCount, error) => {
      // Don't retry 404 errors for non-existent persons
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useStartChat = (personId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => 
      apiClient.post<ChatResponse>(endpoints.startChat(personId)),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    onSuccess: () => {
      // Refetch chat history to show the initial AI message
      queryClient.invalidateQueries({ queryKey: queryKeys.chatHistory(personId) });
    },
    onError: (error) => {
      console.error(`Failed to start chat for person ${personId}:`, error);
    },
  });
};

export const useSendMessage = (personId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (message: string) => 
      apiClient.post<ChatResponse>(endpoints.chat(personId), { message }),
    onSuccess: () => {
      // Refetch chat history to get updated conversation
      queryClient.invalidateQueries({ queryKey: queryKeys.chatHistory(personId) });
      
      // Also invalidate candidate data if chat is complete
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate(personId) });
    },
  });
};

// Person management hooks
export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (personData: PersonCreate) => 
      apiClient.post<PersonResponse>(endpoints.createPerson(), personData),
    onSuccess: () => {
      // Invalidate dashboard queries to show new candidate
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useExtendPerson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: PersonExtend }) => 
      apiClient.post<PersonResponse>(endpoints.extendPerson(personId), data),
    onSuccess: (_, { personId }) => {
      // Invalidate candidate data to refetch with extended information
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate(personId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Enhanced insights hooks
export const useSocialIntelligence = (personId: number) => {
  return useQuery({
    queryKey: queryKeys.socialIntelligence(personId),
    queryFn: () => apiClient.get(endpoints.socialIntelligence(personId)),
    enabled: !!personId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProfessionalSummary = (personId: number) => {
  return useQuery({
    queryKey: queryKeys.professionalSummary(personId),
    queryFn: () => apiClient.get(endpoints.professionalSummary(personId)),
    enabled: !!personId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useHRRecommendations = (personId: number) => {
  return useQuery({
    queryKey: queryKeys.hrRecommendations(personId),
    queryFn: () => apiClient.get(endpoints.hrRecommendations(personId)),
    enabled: !!personId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Enrichment refresh hook
export const useRefreshEnrichment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (personId: number) => 
      apiClient.post(endpoints.refreshEnrichment(personId)),
    onSuccess: (_, personId) => {
      // Invalidate candidate data to refetch with updated information
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate(personId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.socialIntelligence(personId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.professionalSummary(personId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.hrRecommendations(personId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Utility hook for loading states
export const useApiStatus = () => {
  const healthQuery = useHealth();
  
  const isLoading = healthQuery.isLoading;
  const hasError = !!healthQuery.error;
  
  return {
    isLoading,
    hasError,
    isReady: !isLoading && !hasError,
    status: healthQuery.data?.status,
  };
};
