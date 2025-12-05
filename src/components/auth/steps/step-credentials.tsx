'use client';
import { useState, useEffect } from 'react';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PasswordStrength from '@/components/auth/password-strength';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export default function StepCredentials() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);

  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const hasLetters = /[a-zA-Z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const isPasswordStrongEnough = formData.password.length >= 8 && hasLetters && hasNumbers;
    const isPasswordMatch = formData.password === formData.confirmPassword;
    setStepValid(isEmailValid && isPasswordStrongEnough && isPasswordMatch);
  }, [formData.email, formData.password, formData.confirmPassword, setStepValid]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const passwordsDontMatch = isConfirmTouched && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <Label htmlFor="email">{t('onboarding.credentials.email')}</Label>
          <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder={t('onboarding.credentials.emailPlaceholder')}
          value={formData.email}
          onChange={handleChange}
          className="h-12 text-base"
          autoFocus
          />
      </div>
      <div className="space-y-2 relative">
          <Label htmlFor="password">{t('onboarding.credentials.password')}</Label>
          <p className="text-xs text-muted-foreground -mt-1 mb-2">
              {t('onboarding.credentials.passwordPolicy')}
          </p>
          <Input 
          id="password" 
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('onboarding.credentials.passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange}
          className="h-12 text-base"
          />
          <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2.5 top-[42px] h-7 w-7 text-muted-foreground"
          onClick={() => setShowPassword(!showPassword)}
          >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <PasswordStrength password={formData.password} />
      </div>
      <div className="space-y-2 relative">
          <Label htmlFor="confirmPassword">{t('onboarding.credentials.confirmPassword')}</Label>
          <Input 
          id="confirmPassword" 
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder={t('onboarding.credentials.confirmPasswordPlaceholder')}
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={() => setIsConfirmTouched(true)}
          className={cn('h-12 text-base', passwordsDontMatch && 'border-destructive')}
          />
          <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          {passwordsDontMatch && (
              <p className="text-xs text-destructive">{t('onboarding.credentials.passwordMismatch')}</p>
          )}
      </div>
    </div>
  );
}
