'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Heart, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

type AuthView = 'login' | 'register';

interface LoginProps {
  onSwitchView: (view: AuthView) => void;
  onLoginSuccess: () => void;
}

export default function Login({ onSwitchView, onLoginSuccess }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Giriş başarılı!",
        description: "Tekrar hoş geldin.",
      });
      onLoginSuccess();
    } catch (error: any) {
      console.error("Login error: ", error);
      toast({
        variant: "destructive",
        title: "Giriş yapılamadı",
        description: "E-posta veya şifreniz yanlış.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Input id="email" type="email" placeholder={t('login.emailPlaceholder')} className="h-14 text-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="password">{t('login.password')}</Label>
          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('login.passwordPlaceholder')} className="h-14 text-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
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
        <Button onClick={handleLogin} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-7 rounded-xl">
          {isLoading ? <Loader2 className="animate-spin" /> : t('login.button')}
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
