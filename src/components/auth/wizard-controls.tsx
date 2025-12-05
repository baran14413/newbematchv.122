'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

interface WizardControlsProps {
  totalSteps: number;
  onRegisterSuccess: () => void;
}

export default function WizardControls({ totalSteps, onRegisterSuccess }: WizardControlsProps) {
  const { currentStep, prevStep, nextStep, isStepValid, isLastStep } = useOnboardingContext();
  const { t } = useLanguage();

  if (isLastStep) {
    // The final action button is now rendered inside StepCredentials
    return currentStep > 0 ? (
         <Button
            variant="outline"
            onClick={prevStep}
            className="h-14 w-14 rounded-full flex-shrink-0"
            aria-label={t('onboarding.back')}
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
    ) : <div></div>; // Hide controls completely if it's somehow the last and first step
  }

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

      <Button onClick={nextStep} disabled={!isStepValid} className="font-bold text-lg py-7 rounded-xl w-full">
        {t('onboarding.next')}
      </Button>
    </div>
  );
}
