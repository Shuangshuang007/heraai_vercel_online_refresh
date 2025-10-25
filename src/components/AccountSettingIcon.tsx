import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface AccountSettingIconProps {
  isPremium?: boolean;
  href?: string;
  className?: string;
  iconClassName?: string;
  showBadge?: boolean;
  expiresAt?: Date;
  expiresAtAEST?: string;
}

export const AccountSettingIcon: React.FC<AccountSettingIconProps> = ({
  isPremium = false,
  href = '/account-setting',
  className = '',
  iconClassName = '',
  showBadge = true,
  expiresAt,
  expiresAtAEST
}) => {
  const IconContent = (
    <div className="relative">
      <Settings className={`w-5 h-5 ${iconClassName}`} />
      {showBadge && (
        <PremiumBadge 
          isPremium={isPremium} 
          size="sm" 
          className="absolute -top-2 -right-2"
          expiresAt={expiresAt}
          expiresAtAEST={expiresAtAEST}
        />
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-center justify-center w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors ${className}`}
        title="Account Setting"
      >
        {IconContent}
      </Link>
    );
  }

  return (
    <div className={`flex items-center justify-center w-9 h-9 text-gray-600 rounded-md ${className}`}>
      {IconContent}
    </div>
  );
};
