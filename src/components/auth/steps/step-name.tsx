'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepName() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();

  const validateStep = (data: typeof formData) => {
    setStepValid(data.firstName.trim() !== '' && data.lastName.trim() !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    updateFormData(newFormData);
    validateStep(newFormData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="firstName">Adın</Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Adınız"
          value={formData.firstName}
          onChange={handleChange}
          className="h-14 text-lg"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Soyadın</Label>
        <Input
          id="lastName"
          name="lastName"
          placeholder="Soyadınız"
          value={formData.lastName}
          onChange={handleChange}
          className="h-14 text-lg"
        />
      </div>
    </div>
  );
}
