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
import { Card, CardContent } from '../ui/card';
import { AnimatePresence, motion } from 'framer-motion';

const steps = [
  { component: StepName, title: "What's Your Name?" },
  { component: StepGoals, title: 'What brings you here?' },
  { component: StepInterests, title: 'What are your interests?' },
  { component: StepLocation, title: 'Where are you located?' },
  { component: StepPhotos, title: 'Add your best photos' },
  { component: StepCredentials, title: 'Create your account' },
];

type AuthView = 'login' | 'register';

interface OnboardingWizardProps {
  onSwitchView: (view: AuthView) => void;
}

export default function OnboardingWizard({ onSwitchView }: OnboardingWizardProps) {
  const { currentStep } = useOnboardingContext();
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
            <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        </div>
        <div className="relative h-[450px] overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute w-full"
              >
                <div className="p-6 pt-0">
                    <h2 className="text-2xl font-bold mb-6 text-center">{steps[currentStep].title}</h2>
                    <CurrentStepComponent />
                </div>
              </motion.div>
           </AnimatePresence>
        </div>
        <div className="p-6 bg-gray-50 border-t">
          <WizardControls totalSteps={steps.length} />
            <p className="text-sm text-muted-foreground text-center mt-4">
                Already have an account?{' '}
                <button onClick={() => onSwitchView('login')} className="font-semibold text-primary hover:underline">
                    Log In
                </button>
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
