'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import StepIndicator from '@/components/auth/step-indicator';
import StepName from '@/components/auth/steps/step-name';
import StepGoals from '@/components/auth/steps/step-goals';
import StepInterests from '@/components/auth/steps/step-interests';
import StepLocation from '@/components/auth/steps/step-location';
import StepPhotos from '@/components/auth/steps/step-photos';
import StepCredentials from '@/components/auth/steps/step-credentials';
import WizardControls from '@/components/auth/wizard-controls';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/language-context';

type AuthView = 'login' | 'register';

interface OnboardingWizardProps {
  onSwitchView: (view: AuthView) => void;
  onRegisterSuccess: () => void;
}

export default function OnboardingWizard({ onSwitchView, onRegisterSuccess }: OnboardingWizardProps) {
  const { currentStep } = useOnboardingContext();
  const { t } = useLanguage();

  const steps = [
    { component: StepName, title: t("onboarding.stepNameTitle") },
    { component: StepGoals, title: t('onboarding.stepGoalsTitle') },
    { component: StepInterests, title: t('onboarding.stepInterestsTitle') },
    { component: StepLocation, title: t('onboarding.stepLocationTitle') },
    { component: StepPhotos, title: t('onboarding.stepPhotosTitle') },
    { component: StepCredentials, title: t('onboarding.stepCredentialsTitle') },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full h-full flex flex-col bg-background">
        <div className="p-6">
            <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full flex-1 flex flex-col"
              >
                <div className="px-6 pb-8 flex-1">
                    <h2 className="text-3xl font-bold mb-8 text-center">{steps[currentStep].title}</h2>
                    <CurrentStepComponent />
                </div>
              </motion.div>
           </AnimatePresence>
        </div>
        <div className="p-6 space-y-4">
          <WizardControls totalSteps={steps.length} onRegisterSuccess={onRegisterSuccess} />
           <p className="text-sm text-muted-foreground text-center">
                {t('onboarding.haveAccount')}{' '}
                <button onClick={() => onSwitchView('login')} className="font-semibold text-primary hover:underline">
                    {t('onboarding.login')}
                </button>
           </p>
        </div>
    </div>
  );
}
