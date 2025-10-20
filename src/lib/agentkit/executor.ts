// ============================================
// AgentKit Executor - Tool Execution & Plan Management
// ============================================

import { AgentKitDatabase } from './database';
import { MCPToolExecutor } from './mcp-tool-executor';
import type { AgentKitPlan, AgentKitExecutionResult, ToolExecutionContext } from './types';

/**
 * AgentKit Executor - Manages plan execution and tool orchestration
 */
export class AgentKitExecutor {
  private db: AgentKitDatabase;
  private mcpExecutor: MCPToolExecutor;

  constructor() {
    this.db = new AgentKitDatabase();
    this.mcpExecutor = new MCPToolExecutor();
  }
  
  /**
   * Execute a specific step from an AgentKit plan
   */
  async executeStep(planId: string, stepId: string): Promise<AgentKitExecutionResult> {
    const startTime = Date.now();
    
    try {
      console.log('[AgentKitExecutor] Executing step:', { planId, stepId });

      // Get the plan and step
      const plan = await this.getPlan(planId);
      if (!plan) {
        throw new Error(`Plan ${planId} not found`);
      }

      const step = plan.steps.find(s => s.stepId === stepId);
      if (!step) {
        throw new Error(`Step ${stepId} not found in plan ${planId}`);
      }

      // Update step status to running
      step.status = 'running';
      await this.updatePlan(plan);

      // Execute the tool
      const context: ToolExecutionContext = {
        planId,
        stepId,
        sessionId: plan.sessionId,
        args: step.args
      };

      const toolResult = await this.executeTool(step.toolName, context);
      
      // Update step with result
      step.status = toolResult.success ? 'completed' : 'failed';
      step.result = toolResult.result;
      step.error = toolResult.error;
      step.executedAt = new Date();

      await this.updatePlan(plan);

      const latency = Date.now() - startTime;

      console.log('[AgentKitExecutor] Step completed:', {
        stepId,
        success: toolResult.success,
        latency
      });

      return {
        success: toolResult.success,
        stepId,
        toolName: step.toolName,
        result: toolResult.result,
        error: toolResult.error,
        latency
      };

    } catch (error: any) {
      console.error('[AgentKitExecutor] Step execution failed:', error);
      
      // Try to update step status to failed
      try {
        const plan = await this.getPlan(planId);
        if (plan) {
          const step = plan.steps.find(s => s.stepId === stepId);
          if (step) {
            step.status = 'failed';
            step.error = error.message;
            await this.updatePlan(plan);
          }
        }
      } catch (updateError) {
        console.error('[AgentKitExecutor] Failed to update step status:', updateError);
      }

      return {
        success: false,
        stepId,
        toolName: 'unknown',
        error: error.message,
        latency: Date.now() - startTime
      };
    }
  }

  /**
   * Execute the entire plan
   */
  async executePlan(planId: string): Promise<AgentKitExecutionResult[]> {
    const plan = await this.getPlan(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    // Update plan status to executing
    plan.status = 'executing';
    await this.updatePlan(plan);

    const results: AgentKitExecutionResult[] = [];
    
    // Execute steps in priority order
    const sortedSteps = [...plan.steps].sort((a, b) => a.priority - b.priority);
    
    for (const step of sortedSteps) {
      if (step.status === 'completed') {
        continue; // Skip already completed steps
      }

      const result = await this.executeStep(planId, step.stepId);
      results.push(result);

      // Stop execution if a critical step fails
      if (!result.success && step.priority <= 2) {
        plan.status = 'failed';
        await this.updatePlan(plan);
        break;
      }
    }

    // Update final plan status
    const allCompleted = plan.steps.every(step => step.status === 'completed');
    if (allCompleted) {
      plan.status = 'completed';
    } else if (plan.status !== 'failed') {
      plan.status = 'failed';
    }
    
    await this.updatePlan(plan);

    return results;
  }

  /**
   * Execute a specific tool by name
   */
  private async executeTool(toolName: string, context: ToolExecutionContext): Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }> {
    try {
      switch (toolName) {
        case 'recommend_jobs':
          return await this.executeRecommendJobs(context);
        case 'search_jobs':
          return await this.executeSearchJobs(context);
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error: any) {
      console.error(`[AgentKitExecutor] Tool ${toolName} execution failed:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute recommend_jobs tool using existing MCP logic
   */
  private async executeRecommendJobs(context: ToolExecutionContext): Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }> {
    try {
      console.log('[AgentKitExecutor] Executing recommend_jobs with args:', context.args);
      
      const mcpResult = await this.mcpExecutor.executeRecommendJobs(context.args);
      return {
        success: mcpResult.success,
        result: {
          recommendations: mcpResult.recommendations,
          totalFound: mcpResult.totalFound,
          searchCriteria: mcpResult.searchCriteria,
          note: mcpResult.note
        },
        error: mcpResult.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute search_jobs tool using existing MCP logic
   */
  private async executeSearchJobs(context: ToolExecutionContext): Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }> {
    try {
      console.log('[AgentKitExecutor] Executing search_jobs with args:', context.args);
      
      const mcpResult = await this.mcpExecutor.executeSearchJobs(context.args);
      return {
        success: mcpResult.success,
        result: {
          jobs: mcpResult.jobs,
          total: mcpResult.total,
          searchParams: mcpResult.searchParams
        },
        error: mcpResult.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Store a plan in the database
   */
  async storePlan(plan: AgentKitPlan): Promise<void> {
    await this.db.storePlan(plan);
  }

  /**
   * Retrieve a plan from the database
   */
  async getPlan(planId: string): Promise<AgentKitPlan | null> {
    return await this.db.getPlan(planId);
  }

  /**
   * Update a plan in the database
   */
  async updatePlan(plan: AgentKitPlan): Promise<void> {
    await this.db.updatePlan(plan);
  }
}
