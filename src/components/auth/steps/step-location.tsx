'use client';
import { useEffect, useState } from 'react';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';

export default function StepLocation() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [distance, setDistance] = useState(formData.maxDistance || 25);

  const getCityFromCoordinates = async (latitude: number, longitude: number) => {
    setIsLocating(true);
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch city.');
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.county || 'Bilinmeyen Konum';
        const countryCode = data.address.country_code.toUpperCase();
        return `${city}, ${countryCode}`;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        toast({ variant: 'destructive', title: 'Konum alınamadı', description: 'Konum bilgisi alınamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.' });
        return null;
    } finally {
        setIsLocating(false);
    }
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
        toast({ variant: 'destructive', title: t('locationPage.noSupport') });
        return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const locationString = await getCityFromCoordinates(latitude, longitude);
      if (locationString) {
        updateFormData({ 
            location: locationString, 
            latitude,
            longitude,
            locationEnabled: true 
        });
      }
    }, (error) => {
      console.error("Geolocation error: ", error);
      toast({ variant: 'destructive', title: t('locationPage.permissionDenied') });
      setIsLocating(false);
    });
  };

  const handleSliderChange = (value: number[]) => {
    const newDistance = value[0];
    setDistance(newDistance);
    updateFormData({ maxDistance: newDistance });
  };

  useEffect(() => {
    setStepValid(formData.locationEnabled);
  }, [formData.locationEnabled, setStepValid]);

  return (
    <div className="w-full">
      {!formData.locationEnabled ? (
        <div className='space-y-4 text-center'>
            <div className='flex justify-center'>
                <div className='w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center'>
                    <MapPin className="w-12 h-12 text-primary" />
                </div>
            </div>
            <p className="text-muted-foreground">
                {t('onboarding.location.info')}
            </p>
            <Button onClick={handleLocationRequest} disabled={isLocating}>
                {isLocating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLocating ? t('locationPage.findingLocation') : t('onboarding.location.enableButton')}
            </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
             <Label className='text-muted-foreground'>{t('onboarding.location.currentCity')}</Label>
             <p className='font-bold text-lg'>{formData.location}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>{t('onboarding.location.maxDistance')}</Label>
                <span className="text-sm font-semibold text-primary">{distance} {t('common.km')}</span>
            </div>
            <Slider 
                value={[distance]} 
                max={150} 
                min={1}
                step={1}
                onValueChange={handleSliderChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
