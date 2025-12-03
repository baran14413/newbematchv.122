'use client';
import { useState } from 'react';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PasswordStrength from '@/components/auth/password-strength';
import { useLanguage } from '@/context/language-context';

export default function StepCredentials() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateStep = (data: typeof formData) => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const isPasswordValid = data.password.length >= 8;
    const isPasswordMatch = data.password === data.confirmPassword;
    setStepValid(isEmailValid && isPasswordValid && isPasswordMatch);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    updateFormData(newFormData);
    validateStep(newFormData);
  };

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
        />
      </div>
      <div className="space-y-2 relative">
        <Label htmlFor="password">{t('onboarding.credentials.password')}</Label>
        <Input 
          id="password" 
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('onboarding.credentials.passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground"
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
          className={
            formData.confirmPassword && formData.password !== formData.confirmPassword
              ? 'border-red-500'
              : ''
          }
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
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500">{t('onboarding.credentials.passwordMismatch')}</p>
        )}
      </div>
    </div>
  );
}
