import React, { useState } from 'react';
import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  isPremium?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  expiresAt?: Date;
  expiresAtAEST?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  isPremium = false, 
  size = 'md',
  className = '',
  expiresAt,
  expiresAtAEST
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isPremium) return null;

  const badgeSizeClasses = {
    sm: 'w-3 h-3 -top-1 -right-1',
    md: 'w-4 h-4 -top-1 -right-1',
    lg: 'w-5 h-5 -top-2 -right-2'
  };

  const crownSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  const getExpiryText = () => {
    if (expiresAtAEST) {
      return `有效期至 ${expiresAtAEST} AEST`;
    }
    if (expiresAt) {
      const aestExpires = new Date(expiresAt.getTime() + (10 * 60 * 60 * 1000));
      return `有效期至 ${aestExpires.toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })} AEST`;
    }
    return 'Premium 用户';
  };

  return (
    <div className="relative">
      <div 
        className={`absolute ${badgeSizeClasses[size]} bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg z-10 ${className} cursor-help transition-transform hover:scale-110`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Crown className={`${crownSizeClasses[size]} text-white`} />
      </div>
      
      {/* Hover Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg">
          {getExpiryText()}
          <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};
