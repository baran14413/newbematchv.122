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
    <div className="flex items-center justify-between gap-4">
       {currentStep > 0 && (
         <Button
            variant="outline"
            onClick={prevStep}
            className="h-14 w-14 rounded-full flex-shrink-0"
            aria-label={t('onboarding.back')}
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
       )}

      {isLastStep ? (
        <Button onClick={handleFinish} disabled={!isStepValid} className="font-bold text-lg py-7 rounded-xl w-full">
          {t('onboarding.createAccount')}
        </Button>
      ) : (
        <Button onClick={nextStep} disabled={!isStepValid} className="font-bold text-lg py-7 rounded-xl w-full">
          <ArrowRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
