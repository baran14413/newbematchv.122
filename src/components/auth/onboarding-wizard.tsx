'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import StepIndicator from '@/components/auth/step-indicator';
import StepName from '@/components/auth/steps/step-name';
import StepAge from '@/components/auth/steps/step-age';
import StepGender from '@/components/auth/steps/step-gender';
import StepGoals from '@/components/auth/steps/step-goals';
import StepInterests from '@/components/auth/steps/step-interests';
import StepLocation from '@/components/auth/steps/step-location';
import StepBio from '@/components/auth/steps/step-bio';
import StepPhotos from '@/components/auth/steps/step-photos';
import StepCredentials from '@/components/auth/steps/step-credentials';
import StepWelcome from '@/components/auth/steps/step-welcome';
import WizardControls from '@/components/auth/wizard-controls';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/language-context';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    { component: StepAge, title: t('onboarding.stepAgeTitle') },
    { component: StepGender, title: t('onboarding.stepGenderTitle') },
    { component: StepGoals, title: t('onboarding.stepGoalsTitle') },
    { component: StepInterests, title: t('onboarding.stepInterestsTitle') },
    { component: StepLocation, title: t('onboarding.stepLocationTitle') },
    { component: StepBio, title: t('onboarding.stepBioTitle') },
    { component: StepPhotos, title: t('onboarding.stepPhotosTitle') },
    { component: StepCredentials, title: t('onboarding.stepCredentialsTitle') },
    { component: StepWelcome, title: t('onboarding.stepWelcomeTitle') },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const isExpandedStep = [6, 7, 9].includes(currentStep);
  const hideControls = currentStep === steps.length -1;

  return (
    <div className="w-full h-full flex flex-col bg-background">
        <div className="p-4">
            <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden px-6">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full flex-1 flex flex-col"
              >
                <div className="text-center pt-2 pb-6">
                    <h2 className="text-3xl font-bold">{steps[currentStep].title}</h2>
                </div>
                <div className={`flex-1 ${isExpandedStep ? 'flex flex-col' : ''}`}>
                    <ScrollArea className="flex-1 -mx-6">
                        <div className="px-6">
                            <CurrentStepComponent onRegisterSuccess={onRegisterSuccess} />
                        </div>
                    </ScrollArea>
                </div>
              </motion.div>
           </AnimatePresence>
        </div>
        <div className="p-4 space-y-3">
          {!hideControls && <WizardControls totalSteps={steps.length} />}
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
