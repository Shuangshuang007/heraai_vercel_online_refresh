'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Crown, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email: string;
  errorCode?: string;
  postPaymentAction?: () => void; // 支付成功后要执行的操作
  featureDescription?: string; // 具体功能说明
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  email,
  errorCode,
  postPaymentAction,
  featureDescription
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // 支付成功后轮询订阅状态，直到变为Premium
  useEffect(() => {
    if (paymentSuccess) {
      const checkPremiumStatus = async () => {
        let attempts = 0;
        const maxAttempts = 10; // 增加尝试次数
        
        while (attempts < maxAttempts) {
          try {
            // 1. 检查订阅状态
            const response = await fetch(`/api/subscription/status?email=${email}`);
            if (response.ok) {
              const data = await response.json();
              console.log('[PaymentModal] Subscription status check:', data);
              
              if (data.isPremiumToday) {
                console.log('[PaymentModal] User is now Premium!');
                
                // 2. 更新localStorage
                try {
                  localStorage.setItem('heraai_premium_status', JSON.stringify({
                    isPremium: true,
                    plan: data.plan,
                    expiresAt: data.expiresAt,
                    updatedAt: new Date().toISOString()
                  }));
                  console.log('[PaymentModal] Premium status saved to localStorage');
                } catch (localStorageError) {
                  console.error('[PaymentModal] Error saving to localStorage:', localStorageError);
                }
                
                // 3. 触发全局状态更新事件
                try {
                  window.dispatchEvent(new CustomEvent('subscriptionUpdated', {
                    detail: { 
                      isPremium: true, 
                      plan: data.plan,
                      expiresAt: data.expiresAt,
                      updatedAt: new Date().toISOString()
                    }
                  }));
                  console.log('[PaymentModal] Global subscription update event dispatched');
                } catch (eventError) {
                  console.error('[PaymentModal] Error dispatching event:', eventError);
                }
                
                // 4. 关闭支付成功状态
                setPaymentSuccess(false);
                
                // 5. 执行成功回调
                onSuccess();
                
                // 6. 如果有postPaymentAction，执行它
                if (postPaymentAction) {
                  setTimeout(() => {
                    postPaymentAction();
                  }, 100);
                }
                
                // 7. 刷新页面以更新所有组件的Premium状态
                setTimeout(() => {
                  window.location.reload();
                }, 500);
                
                return;
              } else {
                // 如果还没有变为Premium，尝试手动触发webhook更新
                console.log('[PaymentModal] User not Premium yet, triggering manual webhook update');
                await triggerWebhookUpdate(selectedPlan);
              }
            }
          } catch (error) {
            console.error('[PaymentModal] Error checking premium status:', error);
          }
          
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        }
        
        // 如果超时，仍然关闭弹窗并刷新页面
        console.log('[PaymentModal] Timeout reached, closing modal and refreshing');
        setPaymentSuccess(false);
        onSuccess();
        
        // 刷新页面以确保状态同步
        setTimeout(() => {
          window.location.reload();
        }, 500);
      };
      
      checkPremiumStatus();
    }
  }, [paymentSuccess, email, onSuccess, postPaymentAction]);

  const handlePayment = async (plan: 'daily' | 'weekly' | 'monthly') => {
    setIsLoading(true);
    try {
      // 获取当前页面路径，用于智能跳转
      const currentPath = window.location.pathname;
      
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          plan,
          successUrl: `${window.location.origin}/payment-success?returnTo=${encodeURIComponent(currentPath)}`,
          cancelUrl: window.location.href
        })
      });

      const data = await response.json();
      if (data.url) {
        // 跳转到Stripe支付页面
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 手动触发webhook更新（备用方案）
  const triggerWebhookUpdate = async (plan: 'daily' | 'weekly' | 'monthly') => {
    try {
      console.log('[PaymentModal] Manually triggering webhook update for plan:', plan);
      
      // 模拟webhook事件数据
      const webhookData = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: `manual_${Date.now()}`,
            customer_email: email,
            metadata: {
              plan: plan,
              email: email,
              expiresAt: getExpiryDate(plan)
            }
          }
        }
      };

      // 调用webhook处理函数
      const response = await fetch('/api/subscription/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('[PaymentModal] Manual webhook update successful');
      } else {
        console.error('[PaymentModal] Manual webhook update failed');
      }
    } catch (error) {
      console.error('[PaymentModal] Error triggering manual webhook:', error);
    }
  };

  // 计算订阅过期时间（澳大利亚时间）
  const getExpiryDate = (plan: 'daily' | 'weekly' | 'monthly'): string => {
    const now = new Date();
    let expiryDate: Date;

    switch (plan) {
      case 'daily':
        // 当天23:59:59 AEST
        expiryDate = new Date(now);
        expiryDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        // 7天后23:59:59 AEST
        expiryDate = new Date(now);
        expiryDate.setDate(now.getDate() + 7);
        expiryDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        // 30天后23:59:59 AEST
        expiryDate = new Date(now);
        expiryDate.setDate(now.getDate() + 30);
        expiryDate.setHours(23, 59, 59, 999);
        break;
    }

    return expiryDate.toISOString();
  };

  // Get feature description text
  const getFeatureDescription = () => {
    if (featureDescription) return featureDescription;
    
    // 统一说明，而不是锁定某个功能
    return 'Access all resume and cover letter features with a Premium Pass';
  };

  // Get pricing information
  const getPlanInfo = (plan: 'daily' | 'weekly' | 'monthly') => {
    switch (plan) {
      case 'daily':
        return { price: 'AUD $1.99', duration: '1 day', description: 'Unlimited access for 1 day' };
      case 'weekly':
        return { price: 'AUD $7.99', duration: '7 days', description: 'Unlimited access for 7 days' };
      case 'monthly':
        return { price: 'AUD $27.99', duration: '30 days', description: 'Unlimited access for 30 days' };
    }
  };

  if (!isOpen) return null;

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Verifying subscription status, please wait...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mt-4"></div>
      </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-2" />
            Upgrade to Premium
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

            <div className="mb-4 sm:mb-6">
      <p className="text-base text-gray-600 mb-3 sm:mb-4 text-center">
        {getFeatureDescription()}
      </p>

      {/* Three pricing options */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {(['daily', 'weekly', 'monthly'] as const).map((plan) => {
              const planInfo = getPlanInfo(plan);
              const isSelected = selectedPlan === plan;
              
              return (
                <div
                  key={plan}
                  className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <div>
                      <h3 className="text-base font-semibold text-gray-700 capitalize">
                        {plan === 'daily' ? 'Daily' : plan === 'weekly' ? 'Weekly' : 'Monthly'} Premium Pass
                      </h3>
                      <p className="text-base text-gray-600">{planInfo.description}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base font-bold text-blue-600">{planInfo.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

                {/* Premium features description */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
        <h3 className="text-base font-semibold text-gray-700 mb-2 italic">
          Premium includes:
        </h3>
        <ul className="text-gray-800 text-sm space-y-1">
          <li>• Unlimited download of tailored resumes & cover letters</li>
          <li>• Unlimited resume generation and customization</li>
          <li>• Unlimited job search opportunities</li>
          <li>• Priority access to new features</li>
        </ul>
      </div>
        </div>

        <button
          onClick={() => handlePayment(selectedPlan)}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center justify-center font-semibold text-base"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Upgrade Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};
