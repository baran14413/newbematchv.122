'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Calendar } from '@/components/ui/calendar';
import { useLanguage } from '@/context/language-context';
import { differenceInYears, subYears } from 'date-fns';
import { useEffect } from 'react';

export default function StepAge() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const age = differenceInYears(new Date(), date);
      const newFormData = { ...formData, dateOfBirth: date, age };
      updateFormData(newFormData);
      setStepValid(age >= 18);
    } else {
        const newFormData = { ...formData, dateOfBirth: undefined, age: 0 };
        updateFormData(newFormData);
        setStepValid(false);
    }
  };

  useEffect(() => {
    // Validate on initial render if data already exists
    if(formData.dateOfBirth) {
        const age = differenceInYears(new Date(), formData.dateOfBirth);
        setStepValid(age >= 18);
    }
  }, [formData.dateOfBirth, setStepValid]);

  const isUnderage = formData.dateOfBirth ? differenceInYears(new Date(), formData.dateOfBirth) < 18 : false;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Calendar
        mode="single"
        selected={formData.dateOfBirth}
        onSelect={handleDateSelect}
        captionLayout="dropdown-buttons"
        fromYear={subYears(new Date(), 100).getFullYear()}
        toYear={subYears(new Date(), 18).getFullYear()}
        className="rounded-md border"
        initialFocus
      />
      {formData.dateOfBirth ? (
        isUnderage ? (
            <p className="text-sm text-destructive">{t('onboarding.ageInfo')}</p>
        ) : (
            <p className="text-sm font-semibold text-primary">{t('onboarding.currentAge', { age: formData.age })}</p>
        )
      ) : (
         <p className="text-sm text-muted-foreground">{t('onboarding.ageInfo')}</p>
      )}
    </div>
  );
}
