'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export interface PremiumStatus {
  isPremium: boolean;
  planName: string;
  renewalDate: string;
  price: string;
  isLoading: boolean;
  isPremiumToday: boolean;
  plan: string;
  expiresAt?: Date;
  dayKey: string;
  expiresAtAEST?: string;
  refreshStatus: () => void;
}

// 获取AEST时区的当前日期key (YYYY-MM-DD)
const getAESTDayKey = (): string => {
  const now = new Date();
  // 转换为AEST时区 (UTC+10)
  const aestTime = new Date(now.getTime() + (10 * 60 * 60 * 1000));
  return aestTime.toISOString().split('T')[0];
};

// 检查是否在24小时有效期内（从购买时刻到第二天的23:59:59）
const isPremiumTodayAEST = (expiresAt: Date): boolean => {
  if (!expiresAt) return false;
  
  const now = new Date();
  const aestNow = new Date(now.getTime() + (10 * 60 * 60 * 1000));
  const aestExpires = new Date(expiresAt.getTime() + (10 * 60 * 60 * 1000));
  
  // 检查是否在第二天23:59:59之前（24小时有效期）
  const tomorrowEnd = new Date(aestNow);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
  tomorrowEnd.setHours(23, 59, 59, 999);
  
  return aestExpires > tomorrowEnd;
};

// 格式化AEST时区的到期时间
const formatExpiresAtAEST = (expiresAt: Date): string => {
  const aestExpires = new Date(expiresAt.getTime() + (10 * 60 * 60 * 1000));
  return aestExpires.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const usePremiumStatus = (): PremiumStatus => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    planName: 'FREE',
    renewalDate: '',
    price: '',
    isLoading: true,
    isPremiumToday: false,
    plan: 'free',
    expiresAt: undefined,
    dayKey: getAESTDayKey(),
    expiresAtAEST: undefined,
    refreshStatus: () => {} // 初始空函数
  });

  const fetchPremiumStatus = useCallback(async (forceRefresh = false) => {
    if (!session?.user?.email) {
      setPremiumStatus(prev => ({ 
        ...prev, 
        isLoading: false,
        refreshStatus: () => fetchPremiumStatus(true)
      }));
      return;
    }

    const currentDayKey = getAESTDayKey();
    const cachedDayKey = premiumStatus.dayKey;

    // 如果不是强制刷新，且日期相同，使用缓存
    if (!forceRefresh && currentDayKey === cachedDayKey && !premiumStatus.isLoading) {
      return;
    }

    try {
      const response = await fetch(`/api/subscription/status?email=${session.user.email}`);
      if (response.ok) {
        const data = await response.json();
        const expiresAt = data.expiresAt ? new Date(data.expiresAt) : undefined;
        
        setPremiumStatus({
          isPremium: data.isPremiumToday, // 直接使用后端返回的值
          planName: data.isPremiumToday ? 'PREMIUM' : 'FREE',
          renewalDate: expiresAt ? new Date(expiresAt).toLocaleDateString() : '',
          price: data.plan === 'daily' ? 'AUD $1.99' : 'FREE',
          isLoading: false,
          isPremiumToday: data.isPremiumToday, // 直接使用后端返回的值
          plan: data.plan,
          expiresAt,
          dayKey: currentDayKey,
          expiresAtAEST: expiresAt ? formatExpiresAtAEST(expiresAt) : undefined,
          refreshStatus: () => fetchPremiumStatus(true)
        });
      } else {
        // 如果API调用失败，设置为免费用户
        setPremiumStatus(prev => ({ 
          ...prev, 
          isLoading: false,
          isPremium: false,
          planName: 'FREE',
          isPremiumToday: false,
          plan: 'free',
          dayKey: currentDayKey,
          refreshStatus: () => fetchPremiumStatus(true)
        }));
      }
    } catch (error) {
      console.error('Error fetching premium status:', error);
      setPremiumStatus(prev => ({ 
        ...prev, 
        isLoading: false,
        isPremium: false,
        planName: 'FREE',
        isPremiumToday: false,
        plan: 'free',
        dayKey: currentDayKey,
        refreshStatus: () => fetchPremiumStatus(true)
      }));
    }
  }, [session?.user?.email, premiumStatus.dayKey, premiumStatus.isLoading]);

  // 初始加载和session变化时获取状态
  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  // 路由变化时刷新状态 - 重要功能，不能移除
  useEffect(() => {
    // 当 pathname 变化时刷新订阅状态
    // 这确保用户在页面间切换时能看到最新的Premium状态
    fetchPremiumStatus(true);
  }, [pathname, fetchPremiumStatus]);

  // 监听全局订阅状态更新事件
  useEffect(() => {
    const handleSubscriptionUpdate = (event: CustomEvent) => {
      console.log('[usePremiumStatus] Received subscription update event:', event.detail);
      
      const { isPremium, plan, expiresAt, updatedAt } = event.detail;
      
      // 立即更新本地状态
      setPremiumStatus(prev => ({
        ...prev,
        isPremium,
        planName: isPremium ? 'PREMIUM' : 'FREE',
        isPremiumToday: isPremium,
        plan: plan || 'free',
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        expiresAtAEST: expiresAt ? formatExpiresAtAEST(new Date(expiresAt)) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : new Date()
      }));
      
      // 同时更新localStorage
      try {
        localStorage.setItem('heraai_premium_status', JSON.stringify({
          isPremium,
          plan,
          expiresAt,
          updatedAt
        }));
      } catch (error) {
        console.error('[usePremiumStatus] Error updating localStorage:', error);
      }
    };

    // 添加事件监听器
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate as EventListener);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate as EventListener);
    };
  }, []);

  // 提供手动刷新方法
  const refreshStatus = useCallback(() => {
    fetchPremiumStatus(true);
  }, [fetchPremiumStatus]);

  return {
    ...premiumStatus,
    refreshStatus
  };
};
