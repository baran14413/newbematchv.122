'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

interface WizardControlsProps {
  totalSteps: number;
}

export default function WizardControls({ totalSteps }: WizardControlsProps) {
  const { currentStep, prevStep, nextStep, isStepValid } = useOnboardingContext();
  const { t } = useLanguage();

  const isLastStepBeforeWelcome = currentStep === totalSteps - 2;

  return (
    <div className="flex items-center justify-between gap-4">
       {currentStep > 0 && ( // Hide back button on the first real step (step index 0)
         <Button
            variant="outline"
            onClick={prevStep}
            className="h-14 w-14 rounded-full flex-shrink-0"
            aria-label={t('onboarding.back')}
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
       )}

      <Button onClick={nextStep} disabled={!isStepValid} className="font-bold text-lg py-7 rounded-xl w-full">
        {t('onboarding.next')}
      </Button>
    </div>
  );
}
