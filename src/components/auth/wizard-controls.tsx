'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useAuth, useFirestore, useStorage } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


interface WizardControlsProps {
  totalSteps: number;
  onRegisterSuccess: () => void;
}

export default function WizardControls({ totalSteps, onRegisterSuccess }: WizardControlsProps) {
  const { currentStep, prevStep, nextStep, isStepValid, formData } = useOnboardingContext();
  const { t } = useLanguage();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const uploadPhotos = async (userId: string, photos: string[]): Promise<string[]> => {
    const photoURLs: string[] = [];

    for (const photo of photos) {
      const photoId = uuidv4();
      const storageRef = ref(storage, `users/${userId}/photos/${photoId}.jpg`);
      // 'photo' is a data URL (e.g., 'data:image/jpeg;base64,...')
      const uploadResult = await uploadString(storageRef, photo, 'data_url');
      const downloadURL = await getDownloadURL(uploadResult.ref);
      photoURLs.push(downloadURL);
    }
    
    return photoURLs;
  };

  const handleFinish = async () => {
    if (!isStepValid) return;
    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Upload photos to Firebase Storage
      const photoURLs = await uploadPhotos(user.uid, formData.photos);

      // 3. Create user profile in Firestore with photo URLs
      const userDocRef = doc(firestore, 'users', user.uid);
      
      const userProfileData = {
          id: user.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`, // For easy display
          age: formData.age,
          dateOfBirth: formData.dateOfBirth ? Timestamp.fromDate(formData.dateOfBirth) : null,
          bio: formData.bio,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          interests: formData.interests,
          goal: formData.goal,
          avatarUrl: photoURLs[0] || '',
          imageUrls: photoURLs,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          prompts: [],
          zodiac: '',
          videoUrl: '',
          videoDescription: '',
          voiceNoteUrl: '',
      };
      
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

    