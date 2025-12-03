'use client';
import { useEffect } from 'react';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function StepLocation() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();
  
  // Konum isteme ve ayarlama için sahte fonksiyon
  const handleLocationRequest = () => {
    // Gerçek bir uygulamada bu, navigator.geolocation kullanırdı
    const newFormData = { ...formData, location: 'İstanbul, TR', locationEnabled: true };
    updateFormData(newFormData);
    setStepValid(true);
  };

  const handleSliderChange = (value: number[]) => {
    const newFormData = { ...formData, maxDistance: value[0] };
    updateFormData(newFormData);
  };

  // Konum zaten etkinse otomatik olarak doğrula
  useEffect(() => {
    if(formData.locationEnabled){
      setStepValid(true);
    } else {
      setStepValid(false);
    }
  }, [formData.locationEnabled, setStepValid]);


  return (
    <div className="space-y-8 text-center">
      {!formData.locationEnabled ? (
        <div className='space-y-4'>
            <div className='flex justify-center'>
                <div className='w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center'>
                    <MapPin className="w-12 h-12 text-primary" />
                </div>
            </div>
            <p className="text-muted-foreground">
                {t('onboarding.location.info')}
            </p>
            <Button onClick={handleLocationRequest}>{t('onboarding.location.enableButton')}</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
             <Label className='text-muted-foreground'>{t('onboarding.location.currentCity')}</Label>
             <p className='font-bold text-lg'>{formData.location}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>{t('onboarding.location.maxDistance')}</Label>
                <span className="text-sm font-semibold text-primary">{formData.maxDistance} {t('common.km')}</span>
            </div>
            <Slider 
                defaultValue={[formData.maxDistance]} 
                max={150} 
                step={1}
                onValueChange={handleSliderChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
