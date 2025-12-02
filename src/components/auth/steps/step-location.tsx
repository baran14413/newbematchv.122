'use client';
import { useEffect } from 'react';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export default function StepLocation() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();
  
  // Mock function to ask for location and set it
  const handleLocationRequest = () => {
    // In a real app, this would use navigator.geolocation
    const newFormData = { ...formData, location: 'New York, NY', locationEnabled: true };
    updateFormData(newFormData);
    setStepValid(true);
  };

  const handleSliderChange = (value: number[]) => {
    const newFormData = { ...formData, maxDistance: value[0] };
    updateFormData(newFormData);
  };

  // Automatically validate if location is already enabled
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
                Please enable location services to find matches near you.
            </p>
            <Button onClick={handleLocationRequest}>Enable Location</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
             <Label className='text-muted-foreground'>Your current city</Label>
             <p className='font-bold text-lg'>{formData.location}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>Maximum Distance</Label>
                <span className="text-sm font-semibold text-primary">{formData.maxDistance} mi</span>
            </div>
            <Slider 
                defaultValue={[formData.maxDistance]} 
                max={100} 
                step={1}
                onValueChange={handleSliderChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
