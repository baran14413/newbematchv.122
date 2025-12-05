'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { useLanguage } from '@/context/language-context';
import { differenceInYears, subYears, isValid } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepAge() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();

  const handleDateChange = (part: 'day' | 'month' | 'year', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newFormData = { ...formData, [part]: numericValue };
    updateFormData(newFormData);
  };

  const { age, isValidDate, isUnderage } = useMemo(() => {
    const { day, month, year } = formData;
    if (!day || !month || !year || year.length < 4) {
      return { age: 0, isValidDate: false, isUnderage: false };
    }

    const date = new Date(`${year}-${month}-${day}`);
    const isValidDate = isValid(date) && date.getFullYear() === parseInt(year, 10);
    
    if (isValidDate) {
      const age = differenceInYears(new Date(), date);
      const isUnderage = age < 18;
      
      // Update form data with the calculated age and date object
      // This is a bit of a side-effect in useMemo, but it's contained.
      if (formData.age !== age || formData.dateOfBirth?.getTime() !== date.getTime()) {
        updateFormData({ dateOfBirth: date, age });
      }

      return { age, isValidDate: true, isUnderage };
    }
    
    return { age: 0, isValidDate: false, isUnderage: false };
  }, [formData.day, formData.month, formData.year, formData.age, formData.dateOfBirth, updateFormData]);

  useEffect(() => {
    setStepValid(isValidDate && !isUnderage);
  }, [isValidDate, isUnderage, setStepValid]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="day" className="text-muted-foreground">{t('common.day')}</Label>
          <Input
            id="day"
            type="tel"
            placeholder={t('common.dayPlaceholder')}
            maxLength={2}
            value={formData.day}
            onChange={(e) => handleDateChange('day', e.target.value)}
            className="h-14 text-lg text-center"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="month" className="text-muted-foreground">{t('common.month')}</Label>
          <Input
            id="month"
            type="tel"
            placeholder={t('common.monthPlaceholder')}
            maxLength={2}
            value={formData.month}
            onChange={(e) => handleDateChange('month', e.target.value)}
            className="h-14 text-lg text-center"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year" className="text-muted-foreground">{t('common.year')}</Label>
          <Input
            id="year"
            type="tel"
            placeholder={t('common.yearPlaceholder')}
            maxLength={4}
            value={formData.year}
            onChange={(e) => handleDateChange('year', e.target.value)}
            className="h-14 text-lg text-center"
          />
        </div>
      </div>
      <div className="h-6 text-center">
        {formData.year.length === 4 && !isValidDate && (
          <p className="text-sm text-destructive">{t('onboarding.invalidDate')}</p>
        )}
        {isValidDate && isUnderage && (
            <p className="text-sm text-destructive">{t('onboarding.ageInfo')}</p>
        )}
        {isValidDate && !isUnderage && (
            <p className="text-sm font-semibold text-primary">{t('onboarding.currentAge', { age: age })}</p>
        )}
      </div>
    </div>
  );
}
