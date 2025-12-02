'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const interestsList = [
  'Music', 'Travel', 'Gaming', 'Movies', 'Reading', 'Cooking',
  'Sports', 'Fitness', 'Art', 'Photography', 'Hiking', 'Dancing'
];

export default function StepInterests() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();

  const handleToggle = (interest: string) => {
    const newInterests = new Set(formData.interests);
    if (newInterests.has(interest)) {
      newInterests.delete(interest);
    } else {
      newInterests.add(interest);
    }
    const newFormData = { ...formData, interests: Array.from(newInterests) };
    updateFormData(newFormData);
    setStepValid(newInterests.size > 0);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {interestsList.map((interest) => (
        <Badge
          key={interest}
          onClick={() => handleToggle(interest)}
          variant={formData.interests.includes(interest) ? 'default' : 'secondary'}
          className={cn(
            'px-4 py-2 text-sm font-semibold cursor-pointer transition-all rounded-full',
            formData.interests.includes(interest)
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {interest}
        </Badge>
      ))}
    </div>
  );
}
