"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, User } from 'lucide-react';
import { Logo } from './Logo';

export default function Navbar() {
  const [language, setLanguage] = useState('EN');

  return (
    <nav className="bg-white shadow-sm h-16"> {/* h-16 = 64px */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* 左侧 Logo */}
          <Logo />

          {/* 右侧图标 */}
          <div className="flex items-center space-x-6">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
            <Link href="/sign-in" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 