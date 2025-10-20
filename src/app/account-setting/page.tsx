'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { Settings, X, User, Mail, CreditCard, LogOut } from 'lucide-react';
import { AccountSettingIcon } from '@/components/AccountSettingIcon';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function AccountSettingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [emailSubscribed, setEmailSubscribed] = useState(true);
  const premiumStatus = usePremiumStatus();

  // 使用useEffect来处理未认证状态的导航
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // 如果正在加载session，显示加载状态
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 如果没有session且不是正在加载，显示加载状态或返回null
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 确保session存在
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 shadow-sm h-[56px]">
        <nav className="flex justify-between items-center px-6 h-[56px]">
          <div className="flex space-x-6">
            <Logo />
            <div className="hidden md:flex space-x-6">
              <Link href="/profile" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Profile
              </Link>
              <Link href="/jobs" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Jobs
              </Link>
              <Link href="/applications" className="border-b-2 border-transparent h-[56px] flex items-center text-[18px] font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Applications
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
                          <AccountSettingIcon 
                isPremium={premiumStatus.isPremium}
                href={undefined}
                className="text-blue-600 bg-blue-50 ml-8"
                iconClassName="text-blue-600"
                expiresAt={premiumStatus.expiresAt}
                expiresAtAEST={premiumStatus.expiresAtAEST}
              />
            {/* 语言栏暂时注释掉 - 这一版本不上线中文
            <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-9">
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
            */}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="mt-16 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account settings</h1>
        </div>

        <div className="space-y-6">
          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                Personal details
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-base text-gray-600">First name:</span>
                <span className="text-base text-gray-900">{session.user?.name?.split(' ')[0] || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-base text-gray-600">Last name:</span>
                <span className="text-base text-gray-900">{session.user?.name?.split(' ').slice(1).join(' ') || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-base text-gray-600">Registered email:</span>
                <span className="text-base text-gray-900">{session.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                Subscription
              </h2>
              <button className="flex items-center px-3 py-2 text-base text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                <X className="w-4 h-4 mr-2" />
                Cancel subscription
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-base text-gray-600">Plan:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-base ${
                  premiumStatus.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {premiumStatus.planName}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-base text-gray-600">Renews:</span>
                <span className="text-base text-gray-900">
                  {premiumStatus.isPremium && premiumStatus.renewalDate 
                    ? `${premiumStatus.renewalDate} for ${premiumStatus.price}`
                    : 'No active subscription'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Emails - 暂时注释掉 */}
          {/* 
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-gray-600" />
                  Emails
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Subscribe to career tips and HeraAI news, events, offers
                </p>
              </div>
              <button
                onClick={() => setEmailSubscribed(!emailSubscribed)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  emailSubscribed ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailSubscribed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          */}

          {/* Sign Out */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <LogOut className="w-5 h-5 mr-2 text-gray-600" />
                Sign out
              </h2>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-base text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
