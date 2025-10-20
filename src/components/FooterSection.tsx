import React from 'react';
import { Logo } from './Logo';

export default function FooterSection() {
  return (
    <footer className="bg-white py-12">
      <div className="px-12 w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左侧列：公司信息 */}
          <div className="flex-1">
            <div className="mb-4"><Logo className="text-xl" /></div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-800">
                <span>📍</span>
                <span>Melbourne VIC, Australia</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-800">
                <span>✉️</span>
                <span>shuang@heraai.net.au</span>
              </div>
              <div className="flex space-x-4 pt-4">
                <img src="/linkedin.svg" alt="LinkedIn" className="w-5 h-5 cursor-pointer" />
                <img src="/facebook.svg" alt="Facebook" className="w-5 h-5 cursor-pointer" />
                <img src="/tiktok.svg" alt="TikTok" className="w-5 h-5 cursor-pointer" />
                <img src="/xiaohongshu.svg" alt="Xiaohongshu" className="w-7 h-7 cursor-pointer" />
              </div>
            </div>
          </div>
          {/* 右侧列：导航链接 */}
          <div className="flex-1">
            <div className="space-y-3">
              <a href="/terms" className="text-gray-800 hover:text-gray-900 cursor-pointer mt-11 block">Terms of Use</a>
              <a href="/privacy" className="text-gray-800 hover:text-gray-900 cursor-pointer mt-3 block">Privacy and Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 