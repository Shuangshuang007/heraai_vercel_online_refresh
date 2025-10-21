// ============================================
// AgentKit V2 - 独立路由 (不依赖现有代码)
// ============================================
// 完全隔离的v2实现，避免依赖问题

import { NextRequest, NextResponse } from 'next/server';

const JSON_HEADERS = { "Content-Type": "application/json" };

function json200(data: any, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return json200({ error: "invalid_json" });
    }

    console.log('[MCP V2] Request:', {
      method: body.method,
      id: body.id,
      timestamp: new Date().toISOString(),
    });

    // ============================================
    // agentkit-v2/plan - 只读规划
    // ============================================
    if (body.method === "agentkit-v2/plan") {
      const traceId = crypto.randomUUID();
      console.log("[AgentKit V2] Planning request:", { traceId });
      
      try {
        const { plan } = await import('../../../experimental/agentkit_mvp/planner');
        const { userId = 'anonymous', intent } = body.params || {};
        
        if (!intent) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "intent parameter is required",
                    plan: null
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }
        
        const p = await plan(userId, intent);
        
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  plan: p
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
        
      } catch (error: any) {
        console.error('[AgentKit V2] Planning error:', error);
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  error: error.message || 'Planning failed',
                  plan: null
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
      }
    }

    // ============================================
    // agentkit-v2/execute - 执行器，仅允许指定工具
    // ============================================
    if (body.method === "agentkit-v2/execute") {
      const traceId = crypto.randomUUID();
      console.log("[AgentKit V2] Execution request:", { traceId });
      
      try {
        const { execute } = await import('../../../experimental/agentkit_mvp/executor');
        const { plan, allowTools = ["searchJobs"] } = body.params || {};
        
        if (!plan) {
          return json200({
            jsonrpc: "2.0",
            id: body.id ?? null,
            result: {
              content: [{
                type: "json",
                data: {
                  content: {
                    error: "plan parameter is required",
                    executions: []
                  }
                }
              }],
              isError: false
            }
          }, { "X-AgentKit-V2-Trace-Id": traceId });
        }
        
        const out = await execute(plan, { allowTools, dryRun: false });
        
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  executions: out
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
        
      } catch (error: any) {
        console.error('[AgentKit V2] Execution error:', error);
        return json200({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: {
            content: [{
              type: "json",
              data: {
                content: {
                  error: error.message || 'Execution failed',
                  executions: []
                }
              }
            }],
            isError: false
          }
        }, { "X-AgentKit-V2-Trace-Id": traceId });
      }
    }

    // ============================================
    // 未知方法
    // ============================================
    return json200({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: {
        code: -32601,
        message: "Method not found"
      }
    });

  } catch (error: any) {
    console.error('[MCP V2] General error:', error);
    return json200({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32603,
        message: "Internal error"
      }
    });
  }
}

export async function GET() {
  return json200({
    name: "AgentKit V2",
    version: "2.0.0",
    methods: ["agentkit-v2/plan", "agentkit-v2/execute"],
    timestamp: new Date().toISOString()
  });
}
