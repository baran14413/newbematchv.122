import React from 'react';
import { cn } from '@/lib/utils';

type StrengthLevel = 'Zayıf' | 'Orta' | 'Güçlü' | '';

interface PasswordStrengthProps {
  password?: string;
}

const checkStrength = (password: string): StrengthLevel => {
  if (!password || password.length === 0) return '';
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length >= 8 && hasLetters && hasNumbers && hasSymbols) {
    return 'Güçlü';
  }
  if (password.length >= 6 && (hasLetters || hasNumbers)) {
    return 'Orta';
  }
  return 'Zayıf';
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const strength = checkStrength(password);

  const getBarColor = (level: StrengthLevel) => {
    switch (level) {
      case 'Zayıf':
        return 'bg-red-500';
      case 'Orta':
        return 'bg-yellow-500';
      case 'Güçlü':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className={cn('h-1.5 flex-1 rounded-full', strength === 'Zayıf' || strength === 'Orta' || strength === 'Güçlü' ? getBarColor('Zayıf') : 'bg-gray-200')} />
        <div className={cn('h-1.5 flex-1 rounded-full', strength === 'Orta' || strength === 'Güçlü' ? getBarColor('Orta') : 'bg-gray-200')} />
        <div className={cn('h-1.5 flex-1 rounded-full', strength === 'Güçlü' ? getBarColor('Güçlü') : 'bg-gray-200')} />
      </div>
      {strength && <p className="text-xs font-medium" style={{ color: getBarColor(strength).replace('bg-','').replace('-500','') }}>{strength}</p>}
    </div>
  );
};

export default PasswordStrength;
