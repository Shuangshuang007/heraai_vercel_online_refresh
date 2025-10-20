// ============================================
// AgentKit Types and Interfaces
// ============================================

export interface AgentKitPlan {
  planId: string;
  sessionId: string;
  steps: AgentStep[];
  intent: any;
  createdAt: Date;
  status?: 'draft' | 'executing' | 'completed' | 'failed';
}

export interface AgentStep {
  stepId: string;
  toolName: string;
  args: Record<string, any>;
  priority: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  executedAt?: Date;
}

export interface AgentKitIntent {
  primary: 'job_search' | 'profile_update' | 'application_support' | 'career_advice';
  readiness: 'needs_resume' | 'profile_incomplete' | 'ready';
  blockers: string[];
  confidence: number; // 0-1
  action?: string;
  updates?: Record<string, any>;
}

export interface AgentKitMemory {
  sessionId: string;
  context: {
    userProfile?: any;
    lastActions?: string[];
    conversationHistory?: any[];
    jobContext?: any;
  };
  updatedAt: Date;
  createdAt: Date;
}

export interface AgentKitExecutionResult {
  success: boolean;
  stepId: string;
  toolName: string;
  result?: any;
  error?: string;
  latency?: number;
}

export interface ToolExecutionContext {
  planId: string;
  stepId: string;
  sessionId: string;
  args: Record<string, any>;
}

