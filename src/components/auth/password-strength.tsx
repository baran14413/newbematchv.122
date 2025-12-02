import React from 'react';
import { cn } from '@/lib/utils';

type StrengthLevel = 'Weak' | 'Medium' | 'Strong' | '';

interface PasswordStrengthProps {
  password?: string;
}

const checkStrength = (password: string): StrengthLevel => {
  if (!password || password.length === 0) return '';
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length >= 8 && hasLetters && hasNumbers && hasSymbols) {
    return 'Strong';
  }
  if (password.length >= 6 && (hasLetters || hasNumbers)) {
    return 'Medium';
  }
  return 'Weak';
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const strength = checkStrength(password);

  const getBarColor = (level: StrengthLevel) => {
    switch (level) {
      case 'Weak':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className={cn('h-1.5 flex-1 rounded-full', strength === 'Weak' || strength === 'Medium' || strength === 'Strong' ? getBarColor('Weak') : 'bg-gray-200')} />
        <div className={cn('h-1.5 flex-1 rounded-full', strength === 'Medium' || strength === 'Strong' ? getBarColor('Medium') : 'bg-gray-200')} />
        <div className={cn('h-1.5 flex-1 rounded-full', strength === 'Strong' ? getBarColor('Strong') : 'bg-gray-200')} />
      </div>
      {strength && <p className="text-xs font-medium" style={{ color: getBarColor(strength).replace('bg-','').replace('-500','') }}>{strength}</p>}
    </div>
  );
};

export default PasswordStrength;
