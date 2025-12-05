'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';
import { useEffect } from 'react';

const MAX_BIO_LENGTH = 250;

export default function StepBio() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_BIO_LENGTH) {
      updateFormData({ bio: value });
    }
  };

  useEffect(() => {
    setStepValid(formData.bio.trim().length > 0);
  }, [formData.bio, setStepValid]);

  const remainingChars = MAX_BIO_LENGTH - formData.bio.length;

  return (
    <div className="space-y-4 flex flex-col h-full">
        <Textarea
            placeholder={t('onboarding.bio.placeholder')}
            value={formData.bio}
            onChange={handleChange}
            className="flex-1 resize-none text-base h-full"
            autoFocus
        />
      <p className="text-right text-sm text-muted-foreground">
        {t('onboarding.bio.remaining', { count: remainingChars })}
      </p>
    </div>
  );
}
