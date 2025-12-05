'use client';
import { useState } from 'react';
import Login from '@/components/auth/login';
import OnboardingWizard from '@/components/auth/onboarding-wizard';

type AuthView = 'login' | 'register';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [view, setView] = useState<AuthView>('login');

  const onSwitchView = (newView: AuthView) => {
    setView(newView);
  };

  return (
    <>
      {view === 'login' && <Login onSwitchView={onSwitchView} onLoginSuccess={onAuthSuccess} />}
      {view === 'register' && <OnboardingWizard onSwitchView={onSwitchView} onRegisterSuccess={onAuthSuccess} />}
    </>
  );
}
