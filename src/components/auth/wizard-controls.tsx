'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';

interface WizardControlsProps {
  totalSteps: number;
}

export default function WizardControls({ totalSteps }: WizardControlsProps) {
  const { currentStep, prevStep, nextStep, isStepValid } = useOnboardingContext();
  const router = useRouter();
  const { t } = useLanguage();

  const handleFinish = () => {
    // Burada genellikle form verilerini gönderirsiniz
    console.log('Form gönderiliyor...');
    router.push('/discover');
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={prevStep}
        disabled={currentStep === 0}
        className="text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('onboarding.back')}
      </Button>

      {isLastStep ? (
        <Button onClick={handleFinish} disabled={!isStepValid} className="font-bold text-lg py-6 rounded-xl">
          {t('onboarding.createAccount')}
        </Button>
      ) : (
        <Button onClick={nextStep} disabled={!isStepValid}>
          {t('onboarding.next')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
