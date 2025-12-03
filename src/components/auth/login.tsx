'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Heart } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

type AuthView = 'login' | 'register';

interface LoginProps {
  onSwitchView: (view: AuthView) => void;
}

export default function Login({ onSwitchView }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="w-full px-6 py-8 flex flex-col h-full">
      <div className="text-center mb-10">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">{t('login.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('login.description')}
        </p>
      </div >

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <Label htmlFor="email">{t('login.email')}</Label>
          <Input id="email" type="email" placeholder={t('login.emailPlaceholder')} className="h-14 text-lg" />
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="password">{t('login.password')}</Label>
          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('login.passwordPlaceholder')} className="h-14 text-lg" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2.5 top-8 h-9 w-9 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col gap-4">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-7 rounded-xl">
          <Link href="/discover">{t('login.button')}</Link>
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          {t('login.noAccount')}{' '}
          <button onClick={() => onSwitchView('register')} className="font-semibold text-primary hover:underline">
            {t('login.createAccount')}
          </button>
        </p>
      </div>
    </div>
  );
}
