'use client';

import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <span className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent ${className}`}>
        Héra AI
      </span>
    </Link>
  );
} 