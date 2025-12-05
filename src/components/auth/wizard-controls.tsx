'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface WizardControlsProps {
  totalSteps: number;
  onRegisterSuccess: () => void;
}

export default function WizardControls({ totalSteps, onRegisterSuccess }: WizardControlsProps) {
  const { currentStep, prevStep, nextStep, isStepValid, formData } = useOnboardingContext();
  const { t } = useLanguage();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async () => {
    if (!isStepValid) return;
    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Create user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      
      const userProfileData = {
          id: user.uid,
          email: formData.email,
          displayName: `${formData.firstName} ${formData.lastName}`,
          // TODO: Get real age from date of birth
          age: 30, // Placeholder
          bio: "", // Add a bio step later if needed
          location: formData.location,
          interests: formData.interests,
          goal: formData.goal,
          // TODO: Upload photos to Firebase Storage and get URLs
          profilePictureUrl: formData.photos[0] || '',
          imageUrls: formData.photos,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      };
      
      // Using non-blocking update from the guide is not applicable here
      // as we need to ensure the user document is created before proceeding.
      await setDoc(userDocRef, userProfileData);

      console.log('User registered and profile created:', user.uid);
      
      toast({
        title: "Hesap oluşturuldu!",
        description: "BeMatch'e hoş geldiniz.",
      });

      onRegisterSuccess();

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: "Kayıt sırasında hata oluştu",
        description: error.message || 'Lütfen bilgilerinizi kontrol edip tekrar deneyin.',
      });
    } finally {
        setIsLoading(false);
    }
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
            disabled={isLoading}
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
       )}

      {isLastStep ? (
        <Button onClick={handleFinish} disabled={!isStepValid || isLoading} className="font-bold text-lg py-7 rounded-xl w-full">
          {isLoading ? <Loader2 className="animate-spin" /> : t('onboarding.createAccount')}
        </Button>
      ) : (
        <Button onClick={nextStep} disabled={!isStepValid} className="font-bold text-lg py-7 rounded-xl w-full">
          <ArrowRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
