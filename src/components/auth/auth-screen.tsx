'use client';
import { useState } from 'react';
import Login from '@/components/auth/login';
import OnboardingWizard from '@/components/auth/onboarding-wizard';

type AuthView = 'login' | 'register';

export default function AuthScreen() {
  const [view, setView] = useState<AuthView>('login');

  const onSwitchView = (newView: AuthView) => {
    setView(newView);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {view === 'login' && <Login onSwitchView={onSwitchView} />}
      {view === 'register' && <OnboardingWizard onSwitchView={onSwitchView} />}
    </div>
  );
}
