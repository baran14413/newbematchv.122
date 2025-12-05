'use client';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';

const RuleItem = ({ title, description }: { title: string; description: string }) => (
    <div className="space-y-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </div>
);

export default function StepWelcome() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleConfirm = () => {
    router.replace('/discover');
  };

  const rules = [
    { title: t('onboarding.welcome.rule1Title'), description: t('onboarding.welcome.rule1Desc') },
    { title: t('onboarding.welcome.rule2Title'), description: t('onboarding.welcome.rule2Desc') },
    { title: t('onboarding.welcome.rule3Title'), description: t('onboarding.welcome.rule3Desc') },
    { title: t('onboarding.welcome.rule4Title'), description: t('onboarding.welcome.rule4Desc') },
  ];

  return (
    <div className="flex flex-col h-full items-start px-4">
        <div className="mb-8">
            <Flame className="w-12 h-12 text-primary" />
        </div>
        
        <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold">{t('onboarding.welcome.title')}</h1>
            <p className="text-muted-foreground">{t('onboarding.welcome.subtitle')}</p>
            
            <div className="space-y-5">
                {rules.map(rule => <RuleItem key={rule.title} {...rule} />)}
            </div>
        </div>

        <Button onClick={handleConfirm} className="w-full font-bold text-lg py-7 rounded-xl mt-8">
            {t('onboarding.welcome.confirm')}
        </Button>
    </div>
  );
}
