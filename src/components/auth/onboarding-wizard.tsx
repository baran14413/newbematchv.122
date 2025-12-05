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
import StepEmail from '@/components/auth/steps/step-email';
import StepCredentials from '@/components/auth/steps/step-credentials';
import StepWelcome from '@/components/auth/steps/step-welcome';
import WizardControls from '@/components/auth/wizard-controls';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/language-context';

type AuthView = 'login' | 'register';

interface OnboardingWizardProps {
  onSwitchView: (view: AuthView) => void;
  onRegisterSuccess: () => void;
}

export default function OnboardingWizard({ onSwitchView, onRegisterSuccess }: OnboardingWizardProps) {
  const { currentStep, resetOnboarding } = useOnboardingContext();
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
    { component: StepEmail, title: t('onboarding.credentials.emailTitle') },
    { component: StepCredentials, title: t('onboarding.credentials.passwordTitle') },
    { component: StepWelcome, title: t('onboarding.stepWelcomeTitle') },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const isWelcomeStep = currentStep === steps.length - 1;


  return (
    <div className="w-full h-full flex flex-col bg-background">
       {!isWelcomeStep && (
        <div className="p-4">
            <StepIndicator currentStep={currentStep} totalSteps={steps.length-1} />
        </div>
       )}
        <div className="flex-1 flex flex-col overflow-hidden px-6 pb-4">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full flex-1 flex flex-col"
              >
                {!isWelcomeStep && (
                  <div className="text-center pt-2 pb-6">
                      <h2 className="text-3xl font-bold">{steps[currentStep].title}</h2>
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                    <CurrentStepComponent onRegisterSuccess={onRegisterSuccess} onSwitchView={onSwitchView} resetOnboarding={resetOnboarding}/>
                </div>
              </motion.div>
           </AnimatePresence>
        </div>
        {!isWelcomeStep && (
          <div className="p-4 pt-0 space-y-3">
              <WizardControls totalSteps={steps.length} />
          </div>
        )}
    </div>
  );
}
