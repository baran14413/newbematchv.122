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

  const getCityFromCoordinates = async (latitude: number, longitude: number) => {
    setIsLocating(true);
    // NOTE: This uses a free, public API. For production, use a reliable, authenticated service like Google Maps Geocoding API.
    try {
        const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
        if (!response.ok) throw new Error('Failed to fetch city.');
        const data = await response.json();
        // Try to find a city-level name, fallback to county or other large administrative areas.
        const city = data.address.city || data.address.town || data.address.county || 'Bilinmeyen Konum';
        const countryCode = data.address.country_code.toUpperCase();
        return `${city}, ${countryCode}`;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        toast({ variant: 'destructive', title: 'Konum alınamadı', description: 'Koordinatlar şehir adına çevrilemedi.' });
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
        const newFormData = { ...formData, location: locationString, locationEnabled: true };
        updateFormData(newFormData);
        setStepValid(true);
      }
      setIsLocating(false);
    }, (error) => {
      console.error("Geolocation error: ", error);
      toast({ variant: 'destructive', title: t('locationPage.permissionDenied') });
      setIsLocating(false);
    });
  };

  const handleSliderChange = (value: number[]) => {
    const newFormData = { ...formData, maxDistance: value[0] };
    updateFormData(newFormData);
  };

  useEffect(() => {
    setStepValid(formData.locationEnabled);
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
            <Button onClick={handleLocationRequest} disabled={isLocating}>
                {isLocating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLocating ? t('locationPage.findingLocation') : t('onboarding.location.enableButton')}
            </Button>
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
