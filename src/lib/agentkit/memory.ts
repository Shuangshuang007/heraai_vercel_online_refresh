// ============================================
// AgentKit Memory - Session Context & State Management
// ============================================

import { AgentKitDatabase } from './database';
import { connectToMongoDB } from '../../services/jobDatabaseService';
import type { AgentKitMemory as AgentKitMemoryType } from './types';

/**
 * AgentKit Memory Management - Handles session context and state persistence
 */
export class AgentKitMemory {
  private db: AgentKitDatabase;

  constructor() {
    this.db = new AgentKitDatabase();
  }
  
  /**
   * Store or update session memory
   */
  async storeContext(sessionId: string, context: Partial<AgentKitMemoryType['context']>): Promise<void> {
    try {
      const existingMemory = await this.db.getMemory(sessionId);
      
      const memoryData: AgentKitMemoryType = {
        sessionId,
        context: {
          ...existingMemory?.context,
          ...context
        },
        updatedAt: new Date(),
        createdAt: existingMemory?.createdAt || new Date()
      };

      await this.db.storeMemory(memoryData);
      console.log('[AgentKitMemory] Context stored for session:', sessionId);
    } catch (error) {
      console.error('[AgentKitMemory] Failed to store context:', error);
    }
  }

  /**
   * Retrieve session context
   */
  async getContext(sessionId: string): Promise<AgentKitMemoryType | null> {
    try {
      return await this.db.getMemory(sessionId);
    } catch (error) {
      console.error('[AgentKitMemory] Failed to get context:', error);
      return null;
    }
  }

  /**
   * Update user profile in memory
   */
  async updateUserProfile(sessionId: string, profile: any): Promise<void> {
    try {
      const existingMemory = await this.getContext(sessionId);
      const updatedContext = {
        ...existingMemory?.context,
        userProfile: {
          ...existingMemory?.context?.userProfile,
          ...profile,
          updatedAt: new Date()
        }
      };

      await this.storeContext(sessionId, updatedContext);
      console.log('[AgentKitMemory] User profile updated for session:', sessionId);
    } catch (error) {
      console.error('[AgentKitMemory] Failed to update user profile:', error);
    }
  }

  /**
   * Add action to conversation history
   */
  async addAction(sessionId: string, action: string): Promise<void> {
    try {
      const existingMemory = await this.getContext(sessionId);
      const lastActions = existingMemory?.context?.lastActions || [];
      const updatedActions = [...lastActions.slice(-9), action]; // Keep last 10 actions

      await this.storeContext(sessionId, {
        ...existingMemory?.context,
        lastActions: updatedActions
      });
    } catch (error) {
      console.error('[AgentKitMemory] Failed to add action:', error);
    }
  }

  /**
   * Store conversation history
   */
  async storeConversationHistory(sessionId: string, history: any[]): Promise<void> {
    try {
      const existingMemory = await this.getContext(sessionId);
      await this.storeContext(sessionId, {
        ...existingMemory?.context,
        conversationHistory: history.slice(-10) // Keep last 10 messages
      });
    } catch (error) {
      console.error('[AgentKitMemory] Failed to store conversation history:', error);
    }
  }

  /**
   * Get user readiness state based on memory
   */
  async getUserReadiness(sessionId: string): Promise<'needs_resume' | 'profile_incomplete' | 'ready'> {
    try {
      const memory = await this.getContext(sessionId);
      
      if (!memory?.context?.userProfile) {
        return 'needs_resume';
      }

      const profile = memory.context.userProfile;
      
      // Check if profile has essential information
      const hasJobTitles = profile.jobTitles && profile.jobTitles.length > 0;
      const hasSkills = profile.skills && profile.skills.length > 0;
      const hasLocation = profile.city;

      if (hasJobTitles && hasSkills && hasLocation) {
        return 'ready';
      }

      return 'profile_incomplete';
    } catch (error) {
      console.error('[AgentKitMemory] Failed to get readiness:', error);
      return 'needs_resume';
    }
  }

  /**
   * Clean up old memory entries (older than 30 days)
   */
  async cleanupOldMemory(): Promise<void> {
    try {
      const { db } = await connectToMongoDB();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await db.collection('agentkit_memory').deleteMany({
        updatedAt: { $lt: thirtyDaysAgo }
      });

      console.log('[AgentKitMemory] Cleaned up', result.deletedCount, 'old memory entries');
    } catch (error) {
      console.error('[AgentKitMemory] Failed to cleanup old memory:', error);
    }
  }
}
