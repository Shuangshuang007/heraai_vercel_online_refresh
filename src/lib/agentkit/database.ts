// ============================================
// AgentKit Database Service
// ============================================

import { connectToMongoDB } from '../../services/jobDatabaseService';
import type { AgentKitPlan, AgentKitMemory } from './types';

/**
 * AgentKit Database Service - Handles all AgentKit-related database operations
 */
export class AgentKitDatabase {
  
  /**
   * Store AgentKit execution plan
   */
  async storePlan(plan: AgentKitPlan): Promise<void> {
    try {
      const { db } = await connectToMongoDB();
      
      const planDocument = {
        planId: plan.planId,
        sessionId: plan.sessionId,
        steps: plan.steps,
        intent: plan.intent,
        status: plan.status || 'draft',
        createdAt: plan.createdAt,
        updatedAt: new Date()
      };

      await db.collection('agentkit_plans').updateOne(
        { planId: plan.planId },
        { 
          $set: {
            sessionId: plan.sessionId,
            steps: plan.steps,
            intent: plan.intent,
            status: plan.status || 'draft',
            updatedAt: new Date()
          },
          $setOnInsert: { 
            planId: plan.planId,
            createdAt: plan.createdAt 
          }
        },
        { upsert: true }
      );

      console.log('[AgentKitDatabase] Plan stored:', plan.planId);
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to store plan:', error);
      throw error;
    }
  }

  /**
   * Get AgentKit execution plan by ID
   */
  async getPlan(planId: string): Promise<AgentKitPlan | null> {
    try {
      const { db } = await connectToMongoDB();
      const doc = await db.collection('agentkit_plans').findOne({ planId });
      
      if (!doc) return null;
      
      return {
        planId: doc.planId,
        sessionId: doc.sessionId,
        steps: doc.steps || [],
        intent: doc.intent,
        status: doc.status,
        createdAt: doc.createdAt
      };
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to get plan:', error);
      return null;
    }
  }

  /**
   * Update AgentKit execution plan
   */
  async updatePlan(plan: AgentKitPlan): Promise<void> {
    try {
      const { db } = await connectToMongoDB();
      await db.collection('agentkit_plans').updateOne(
        { planId: plan.planId },
        { 
          $set: { 
            steps: plan.steps,
            status: plan.status,
            intent: plan.intent,
            updatedAt: new Date() 
          } 
        }
      );
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to update plan:', error);
      throw error;
    }
  }

  /**
   * Store AgentKit memory context
   */
  async storeMemory(memory: AgentKitMemory): Promise<void> {
    try {
      const { db } = await connectToMongoDB();
      
      await db.collection('agentkit_memory').updateOne(
        { sessionId: memory.sessionId },
        { 
          $set: {
            context: memory.context,
            updatedAt: memory.updatedAt
          },
          $setOnInsert: { 
            sessionId: memory.sessionId,
            createdAt: memory.createdAt 
          }
        },
        { upsert: true }
      );

      console.log('[AgentKitDatabase] Memory stored for session:', memory.sessionId);
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to store memory:', error);
      throw error;
    }
  }

  /**
   * Get AgentKit memory context by session ID
   */
  async getMemory(sessionId: string): Promise<AgentKitMemory | null> {
    try {
      const { db } = await connectToMongoDB();
      const doc = await db.collection('agentkit_memory').findOne({ sessionId });
      
      if (!doc) return null;

      return {
        sessionId: doc.sessionId,
        context: doc.context || {},
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt
      };
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to get memory:', error);
      return null;
    }
  }

  /**
   * Update memory context (partial update)
   */
  async updateMemory(sessionId: string, contextUpdate: Partial<AgentKitMemory['context']>): Promise<void> {
    try {
      const { db } = await connectToMongoDB();
      
      const updateData: any = {
        updatedAt: new Date()
      };

      // Update specific context fields
      Object.keys(contextUpdate).forEach(key => {
        updateData[`context.${key}`] = contextUpdate[key as keyof AgentKitMemory['context']];
      });

      await db.collection('agentkit_memory').updateOne(
        { sessionId },
        { 
          $set: updateData,
          $setOnInsert: { 
            sessionId,
            createdAt: new Date(),
            context: contextUpdate
          }
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to update memory:', error);
      throw error;
    }
  }

  /**
   * Get plans by session ID
   */
  async getPlansBySession(sessionId: string, limit: number = 10): Promise<AgentKitPlan[]> {
    try {
      const { db } = await connectToMongoDB();
      const docs = await db.collection('agentkit_plans')
        .find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return docs.map(doc => ({
        planId: doc.planId,
        sessionId: doc.sessionId,
        steps: doc.steps || [],
        intent: doc.intent,
        status: doc.status,
        createdAt: doc.createdAt
      }));
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to get plans by session:', error);
      return [];
    }
  }

  /**
   * Clean up old plans (older than 7 days)
   */
  async cleanupOldPlans(): Promise<number> {
    try {
      const { db } = await connectToMongoDB();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await db.collection('agentkit_plans').deleteMany({
        createdAt: { $lt: sevenDaysAgo }
      });

      console.log('[AgentKitDatabase] Cleaned up', result.deletedCount, 'old plans');
      return result.deletedCount || 0;
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to cleanup old plans:', error);
      return 0;
    }
  }

  /**
   * Clean up old memory entries (older than 30 days)
   */
  async cleanupOldMemory(): Promise<number> {
    try {
      const { db } = await connectToMongoDB();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await db.collection('agentkit_memory').deleteMany({
        updatedAt: { $lt: thirtyDaysAgo }
      });

      console.log('[AgentKitDatabase] Cleaned up', result.deletedCount, 'old memory entries');
      return result.deletedCount || 0;
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to cleanup old memory:', error);
      return 0;
    }
  }

  /**
   * Create database indexes for better performance
   */
  async createIndexes(): Promise<void> {
    try {
      const { db } = await connectToMongoDB();

      // Create indexes for agentkit_plans
      await db.collection('agentkit_plans').createIndex({ planId: 1 }, { unique: true });
      await db.collection('agentkit_plans').createIndex({ sessionId: 1 });
      await db.collection('agentkit_plans').createIndex({ createdAt: -1 });
      await db.collection('agentkit_plans').createIndex({ status: 1 });

      // Create indexes for agentkit_memory
      await db.collection('agentkit_memory').createIndex({ sessionId: 1 }, { unique: true });
      await db.collection('agentkit_memory').createIndex({ updatedAt: -1 });

      console.log('[AgentKitDatabase] Indexes created successfully');
    } catch (error) {
      console.error('[AgentKitDatabase] Failed to create indexes:', error);
    }
  }
}
