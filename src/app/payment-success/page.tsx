'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取用户应该返回的页面路径
  const returnTo = searchParams?.get('returnTo') || '/profile';
  
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // 倒计时结束，跳转到目标页面
      router.push(returnTo);
    }
  }, [countdown, router, returnTo]);

  // 获取页面名称用于显示
  const getPageName = (path: string) => {
    switch (path) {
      case '/profile': return 'Profile';
      case '/jobs': return 'Jobs';
      case '/applications': return 'Applications';
      default: return 'Profile';
    }
  };

  // 根据目标页面获取相应的提示消息
  const getPremiumMessage = (path: string) => {
    switch (path) {
      case '/profile':
        return 'Premium activated — Please click Download Resume to preview and download your file.';
      case '/jobs':
        return 'Premium activated — Please click Tailor Resume + to edit and download your file.';
      default:
        return 'Your subscription has been activated.';
    }
  };

  return (
    <>
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        <span className="text-red-600 font-bold">{getPremiumMessage(returnTo)}</span>
        <br />
        Redirecting to {getPageName(returnTo)} page in {countdown} seconds...
      </p>
      
      <button
        onClick={() => router.push(returnTo)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to {getPageName(returnTo)}
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </>
  );
}
