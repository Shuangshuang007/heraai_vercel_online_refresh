// ============================================
// AgentKit Executor - Dry-Run Execution
// ============================================
// dry-run执行器，调用registry的mock实现
// 仅打印结果，不执行业务逻辑

import { Plan, ExecutionRecord } from './types';
import { ToolRegistry } from './registry';

export async function execute(
  plan: Plan, 
  opts: { dryRun?: boolean; allowTools?: string[] } = { dryRun: true }
): Promise<ExecutionRecord[]> {
  const results: ExecutionRecord[] = [];
  
  console.log(`[AgentKit Executor] Starting execution for plan: ${plan.id}`);
  console.log(`[AgentKit Executor] Mode: ${opts.dryRun ? 'DRY-RUN' : 'LIVE'}`);

  for (const step of plan.steps) {
    const t0 = Date.now();
    console.log(`[AgentKit Executor] Executing step: ${step.id} (${step.tool})`);
    
    // 白名单过滤：如果指定了allowTools，只执行允许的工具
    if (opts.allowTools && opts.allowTools.length > 0 && !opts.allowTools.includes(step.tool)) {
      const record: ExecutionRecord = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        planId: plan.id,
        stepId: step.id,
        tool: step.tool,
        status: 'skipped',
        latencyMs: 0,
        inputSnapshot: step.args,
        errorMessage: 'tool not allowed in v2 phase',
        createdAt: new Date().toISOString(),
      };
      
      results.push(record);
      console.log(`[AgentKit Executor] Step ${step.id} skipped: ${step.tool} not in allowTools list`);
      continue;
    }
    
    try {
      // 调用registry中的mock工具
      const output = await ToolRegistry[step.tool](step.args);
      
      const record: ExecutionRecord = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        planId: plan.id,
        stepId: step.id,
        tool: step.tool,
        status: 'success',
        latencyMs: Date.now() - t0,
        inputSnapshot: step.args,
        outputSnapshot: output,
        createdAt: new Date().toISOString(),
      };
      
      results.push(record);
      console.log(`[AgentKit Executor] Step ${step.id} completed successfully in ${record.latencyMs}ms`);
      
    } catch (e: any) {
      const record: ExecutionRecord = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        planId: plan.id,
        stepId: step.id,
        tool: step.tool,
        status: 'error',
        latencyMs: Date.now() - t0,
        inputSnapshot: step.args,
        errorMessage: String(e?.message ?? e),
        createdAt: new Date().toISOString(),
      };
      
      results.push(record);
      console.log(`[AgentKit Executor] Step ${step.id} failed: ${record.errorMessage}`);
    }
  }

  console.log(`[AgentKit Executor] Execution completed with ${results.length} steps`);
  return results;
}
