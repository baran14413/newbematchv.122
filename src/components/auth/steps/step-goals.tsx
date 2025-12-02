'use client';
import { useOnboardingContext } from '@/context/onboarding-context';
import { Card } from '@/components/ui/card';
import { Heart, Coffee, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const goals = [
  { id: 'long-term', label: 'Uzun süreli ilişki', icon: Heart },
  { id: 'casual', label: 'Sıradan bir şeyler', icon: Coffee },
  { id: 'chat', label: 'Sohbet etmek için yeni arkadaşlar', icon: MessageSquare },
];

export default function StepGoals() {
  const { formData, updateFormData, setStepValid } = useOnboardingContext();

  const handleSelect = (goalId: string) => {
    const newFormData = { ...formData, goal: goalId };
    updateFormData(newFormData);
    setStepValid(true);
  };

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <Card
          key={goal.id}
          onClick={() => handleSelect(goal.id)}
          className={cn(
            'p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 border-2',
            formData.goal === goal.id
              ? 'border-primary bg-primary/5 shadow-md'
              : 'hover:border-primary/50 hover:bg-accent'
          )}
        >
          <goal.icon className={cn('w-6 h-6', formData.goal === goal.id ? 'text-primary' : 'text-muted-foreground')} />
          <span className="font-semibold">{goal.label}</span>
        </Card>
      ))}
    </div>
  );
}
