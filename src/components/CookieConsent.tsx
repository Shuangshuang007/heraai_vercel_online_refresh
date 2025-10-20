"use client";
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 检查cookie同意时间戳
    const cookieAcceptedAt = localStorage.getItem('cookieAcceptedAt');
    
    if (!cookieAcceptedAt) {
      // 如果没有记录，显示横幅
      setIsVisible(true);
    } else {
      // 检查是否超过365天（1年）
      const acceptedTime = parseInt(cookieAcceptedAt);
      const currentTime = Date.now();
      const oneYearInMs = 365 * 24 * 60 * 60 * 1000; // 365天的毫秒数
      
      if (currentTime - acceptedTime > oneYearInMs) {
        // 超过1年，显示横幅
        setIsVisible(true);
      } else {
        // 在1年内，不显示横幅
        setIsVisible(false);
      }
    }
  }, []);

  const handleAccept = () => {
    // 存储当前时间戳
    localStorage.setItem('cookieAcceptedAt', Date.now().toString());
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="cookie-banner"
      className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-md px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-gray-700"
    >
      <div>
        We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to personalize content, analyze site usage, and improve your experience. Read our{" "}
        <a
          href="/privacy"
          className="underline text-blue-600 hover:text-blue-800"
        >
          Privacy and Cookie Policy
        </a>
        .
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
        >
          Accept
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-1.5 border border-blue-600 text-blue-600 bg-white rounded text-sm hover:bg-blue-50 transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
} 