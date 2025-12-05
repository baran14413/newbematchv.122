'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

export default function StepGender() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();

  const genders = [
    { id: 'woman', label: t('onboarding.gender.woman') },
    { id: 'man', label: t('onboarding.gender.man') },
    { id: 'other', label: t('onboarding.gender.other') },
  ];
  
  const interests = [
    { id: 'man', label: t('onboarding.interestedIn.men') },
    { id: 'woman', label: t('onboarding.interestedIn.women') },
    { id: 'everyone', label: t('onboarding.interestedIn.everyone') },
  ];

  useEffect(() => {
    setStepValid(!!formData.gender && !!formData.interestedIn);
  }, [formData.gender, formData.interestedIn, setStepValid]);

  const handleSelectGender = (genderId: string) => {
    updateFormData({ gender: genderId });
  };
  
  const handleSelectInterest = (interestId: string) => {
    updateFormData({ interestedIn: interestId });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-center mb-3">{t('onboarding.gender.yourGender')}</p>
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
      </div>

      <Separator />

      <div>
        <p className="font-semibold text-center mb-3">{t('onboarding.interestedIn.showMe')}</p>
        <div className="space-y-3">
        {interests.map((interest) => (
            <Button
            key={interest.id}
            onClick={() => handleSelectInterest(interest.id)}
            variant={formData.interestedIn === interest.id ? 'default' : 'outline'}
            className={cn('w-full justify-center h-12 text-base')}
            >
            {interest.label}
            </Button>
        ))}
        </div>
      </div>
    </div>
  );
}
