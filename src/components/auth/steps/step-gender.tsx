'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { useEffect } from 'react';

export default function StepGender() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();

  const genders = [
    { id: 'woman', label: t('onboarding.gender.woman') },
    { id: 'man', label: t('onboarding.gender.man') },
    { id: 'other', label: t('onboarding.gender.other') },
  ];
  
  useEffect(() => {
    // This step is valid if a gender has been chosen.
    setStepValid(!!formData.gender);
  }, [formData.gender, setStepValid]);

  const handleSelectGender = (genderId: string) => {
    let interestedIn = 'everyone'; // Default for 'other'
    if (genderId === 'woman') {
      interestedIn = 'man';
    } else if (genderId === 'man') {
      interestedIn = 'woman';
    }
    
    updateFormData({ gender: genderId, interestedIn: interestedIn });
    setStepValid(true); // A selection automatically makes the step valid
  };

  return (
    <div className="space-y-3">
      {genders.map((gender) => (
        <Button
          key={gender.id}
          onClick={() => handleSelectGender(gender.id)}
          variant={formData.gender === gender.id ? 'default' : 'outline'}
          className={cn('w-full justify-center h-12 text-base')}
        >
          {gender.label}
        </Button>
      ))}
    </div>
  );
}
