'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Loader2, X } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useOnboardingContext } from '@/context/onboarding-context';
import { useAuth, useFirestore, useStorage } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const RuleItem = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

type AuthView = 'login' | 'register';

interface StepWelcomeProps {
    onRegisterSuccess: () => void;
    onSwitchView: (view: AuthView) => void;
}

export default function StepWelcome({ onRegisterSuccess, onSwitchView }: StepWelcomeProps) {
  const { t } = useLanguage();
  const { formData } = useOnboardingContext();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const rules = [
    { title: t('onboarding.welcome.rule1Title'), description: t('onboarding.welcome.rule1Desc') },
    { title: t('onboarding.welcome.rule2Title'), description: t('onboarding.welcome.rule2Desc') },
    { title: t('onboarding.welcome.rule3Title'), description: t('onboarding.welcome.rule3Desc') },
    { title: t('onboarding.welcome.rule4Title'), description: t('onboarding.welcome.rule4Desc') },
  ];

  const uploadPhotos = async (userId: string, photos: string[]): Promise<string[]> => {
    const photoURLs: string[] = [];

    for (const photo of photos) {
      const photoId = uuidv4();
      const storageRef = ref(storage, `users/${userId}/photos/${photoId}.jpg`);
      const uploadResult = await uploadString(storageRef, photo, 'data_url');
      const downloadURL = await getDownloadURL(uploadResult.ref);
      photoURLs.push(downloadURL);
    }
    
    return photoURLs;
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Upload photos to Firebase Storage
      const photoURLs = await uploadPhotos(user.uid, formData.photos);

      // 3. Create user profile in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      
      const userProfileData = {
          id: user.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          age: formData.age,
          dateOfBirth: formData.dateOfBirth ? Timestamp.fromDate(formData.dateOfBirth) : null,
          gender: formData.gender,
          interestedIn: formData.interestedIn,
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
          globalMode: true,
          maxDistance: 50,
          ageRange: [18, 55]
      };
      
      await setDoc(userDocRef, userProfileData);

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


  return (
    <div className="flex flex-col h-full relative">
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-0 right-0"
            onClick={() => onSwitchView('login')}
        >
            <X className="w-5 h-5 text-muted-foreground" />
        </Button>
        <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="mb-8 pt-8">
                <Flame className="w-12 h-12 text-primary" />
            </div>
            
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">{t('onboarding.welcome.title')}</h1>
                <p className="text-muted-foreground">{t('onboarding.welcome.subtitle')}</p>
                
                <div className="space-y-5 pt-4">
                    {rules.map(rule => <RuleItem key={rule.title} {...rule} />)}
                </div>
            </div>
        </motion.div>

        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="pb-4"
        >
            <Button onClick={handleConfirm} disabled={isLoading} className="w-full font-bold text-lg py-7 rounded-xl mt-8">
                {isLoading ? <Loader2 className="animate-spin" /> : t('onboarding.welcome.confirm')}
            </Button>
        </motion.div>
    </div>
  );
}
