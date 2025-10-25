"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { StorageManager } from '@/utils/storage';
import { useSession } from "next-auth/react";
import VisionSection from '@/components/VisionSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FooterSection from '@/components/FooterSection';
import CookieConsent from '@/components/CookieConsent';
import FeatureAnnouncement from '@/components/FeatureAnnouncement';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/jobs");
    }
  }, [status, router]);

  // 在用户登录时，将邮箱保存到localStorage
  useEffect(() => {
    if (session?.user?.email) {
      // 将登录邮箱保存到localStorage
      localStorage.setItem('registeredEmail', session.user.email);
      console.log('Saved registeredEmail to localStorage from homepage:', session.user.email);
    }
  }, [session]);

  // 登录状态检测函数（伪代码，后续可抽到utils/auth.ts）
  function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    if (!token || !loginTime) return false;
    const now = Date.now();
    return now - Number(loginTime) < 30 * 24 * 60 * 60 * 1000;
  }

  const handleGetStarted = () => {
    if (isLoggedIn()) {
      router.push('/profile');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-start px-4 sm:px-8 md:px-12 pt-4">
        <div>
          <Logo />
          </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <button
            className="px-3 sm:px-5 py-2 border border-blue-600 text-blue-600 bg-white rounded-md font-medium hover:bg-blue-50 transition text-sm sm:text-base"
            onClick={() => {
              const visionSection = document.querySelector('section');
              if (visionSection)
                visionSection.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            About us
          </button>
          <button
            className="px-3 sm:px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition text-sm sm:text-base"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>
      {/* 中央内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-700 mb-4 tracking-tight mt-24 text-center">Connect You with Corporate Direct Jobs</h1>
        <div className="w-full max-w-[1200px] mx-auto mt-8">
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://iframe.videodelivery.net/15d6b28ac5090607351a387fb52978de"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
              title="Main Hera Introduction Video"
            />
          </div>
        </div>
      </div>
      <VisionSection />
      <HowItWorksSection />
      <FooterSection />
      <CookieConsent />
      <FeatureAnnouncement />
    </div>
  );
} 