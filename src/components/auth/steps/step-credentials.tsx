'use client';
import { useState, useEffect } from 'react';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PasswordStrength from '@/components/auth/password-strength';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import PolicySheet from '@/components/auth/policy-sheet';
import { useAuth, useFirestore, useStorage } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

interface StepCredentialsProps {
    onRegisterSuccess: () => void;
}

export default function StepCredentials({ onRegisterSuccess }: StepCredentialsProps) {
  const { formData, updateFormData, setStepValid, nextStep: handleRegister, isLastStep } = useOnboardingContext();
  const { t } = useLanguage();
  const auth = useAuth();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const [sheetContent, setSheetContent] = useState<'terms' | 'privacy' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasLetters = /[a-zA-Z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const isPasswordStrongEnough = formData.password.length >= 8 && hasLetters && hasNumbers;
    const isPasswordMatch = formData.password === formData.confirmPassword;
    setStepValid(isPasswordStrongEnough && isPasswordMatch);
  }, [formData.password, formData.confirmPassword, setStepValid]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const passwordsDontMatch = isConfirmTouched && formData.confirmPassword && formData.password !== formData.confirmPassword;

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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const photoURLs = await uploadPhotos(user.uid, formData.photos);

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

   // Override the context's nextStep for this final step
   if (isLastStep) {
     return (
       <div className="flex flex-col h-full">
         <div className="flex-1 space-y-6">
           <div className="space-y-2">
               <Label htmlFor="password">{t('onboarding.credentials.password')}</Label>
               <p className="text-xs text-muted-foreground -mt-1 mb-2">
                   {t('onboarding.credentials.passwordPolicy')}
               </p>
               <div className="relative">
                 <Input 
                 id="password" 
                 name="password"
                 type={showPassword ? 'text' : 'password'}
                 placeholder={t('onboarding.credentials.passwordPlaceholder')}
                 value={formData.password}
                 onChange={handleChange}
                 className="h-14 text-lg pr-12"
                 autoFocus
                 />
                 <div className="absolute inset-y-0 right-0 flex items-center">
                   <Button
                   type="button"
                   variant="ghost"
                   size="icon"
                   className="h-9 w-9 text-muted-foreground"
                   onClick={() => setShowPassword(!showPassword)}
                   >
                   {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                   </Button>
                 </div>
               </div>
               <PasswordStrength password={formData.password} />
           </div>
           <div className="space-y-2">
               <Label htmlFor="confirmPassword">{t('onboarding.credentials.confirmPassword')}</Label>
               <div className="relative">
                 <Input 
                 id="confirmPassword" 
                 name="confirmPassword"
                 type={showConfirmPassword ? 'text' : 'password'}
                 placeholder={t('onboarding.credentials.confirmPasswordPlaceholder')}
                 value={formData.confirmPassword}
                 onChange={handleChange}
                 onBlur={() => setIsConfirmTouched(true)}
                 className={cn('h-14 text-lg pr-12', passwordsDontMatch && 'border-destructive')}
                 />
                 <div className="absolute inset-y-0 right-0 flex items-center">
                   <Button
                   type="button"
                   variant="ghost"
                   size="icon"
                   className="h-9 w-9 text-muted-foreground"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   >
                   {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                   </Button>
                 </div>
               </div>
               {passwordsDontMatch && (
                   <p className="text-xs text-destructive">{t('onboarding.credentials.passwordMismatch')}</p>
               )}
           </div>
         </div>
          <div className="mt-auto">
             <div className="text-center text-xs text-muted-foreground mb-4">
                {t('onboarding.welcome.legal_prefix')}{' '}
                <button onClick={() => setSheetContent('terms')} className="underline hover:text-primary">{t('onboarding.welcome.terms')}</button>
                {' '}{t('onboarding.welcome.legal_and')}{' '}
                <button onClick={() => setSheetContent('privacy')} className="underline hover:text-primary">{t('onboarding.welcome.privacy')}</button>
                {t('onboarding.welcome.legal_suffix')}
            </div>
             <Button onClick={handleConfirm} disabled={isLoading} className="w-full font-bold text-lg py-7 rounded-xl">
                 {isLoading ? <Loader2 className="animate-spin" /> : t('onboarding.createAccount')}
             </Button>
          </div>
          <PolicySheet
            isOpen={!!sheetContent}
            onOpenChange={(open) => !open && setSheetContent(null)}
            initialTab={sheetContent === 'terms' ? 'terms' : 'privacy'}
          />
       </div>
     );
   }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <Label htmlFor="password">{t('onboarding.credentials.password')}</Label>
          <p className="text-xs text-muted-foreground -mt-1 mb-2">
              {t('onboarding.credentials.passwordPolicy')}
          </p>
          <div className="relative">
            <Input 
            id="password" 
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('onboarding.credentials.passwordPlaceholder')}
            value={formData.password}
            onChange={handleChange}
            className="h-14 text-lg pr-12"
            autoFocus
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <PasswordStrength password={formData.password} />
      </div>
      <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('onboarding.credentials.confirmPassword')}</Label>
          <div className="relative">
            <Input 
            id="confirmPassword" 
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('onboarding.credentials.confirmPasswordPlaceholder')}
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => setIsConfirmTouched(true)}
            className={cn('h-14 text-lg pr-12', passwordsDontMatch && 'border-destructive')}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          {passwordsDontMatch && (
              <p className="text-xs text-destructive">{t('onboarding.credentials.passwordMismatch')}</p>
          )}
      </div>
    </div>
  );
}
