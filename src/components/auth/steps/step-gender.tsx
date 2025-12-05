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
  ];
  
  useEffect(() => {
    setStepValid(!!formData.gender);
  }, [formData.gender, setStepValid]);

  const handleSelectGender = (genderId: 'woman' | 'man') => {
    const interestedIn = genderId === 'woman' ? 'man' : 'woman';
    updateFormData({ gender: genderId, interestedIn: interestedIn });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-center mb-3">{t('onboarding.gender.yourGender')}</p>
        <div className="space-y-3">
        {genders.map((gender) => (
            <Button
            key={gender.id}
            onClick={() => handleSelectGender(gender.id as 'woman' | 'man')}
            variant={formData.gender === gender.id ? 'default' : 'outline'}
            className={cn('w-full justify-center h-12 text-base')}
            >
            {gender.label}
            </Button>
        ))}
        </div>
      </div>
    </div>
  );
}
