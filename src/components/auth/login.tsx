'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Heart } from 'lucide-react';
import Link from 'next/link';

type AuthView = 'login' | 'register';

interface LoginProps {
  onSwitchView: (view: AuthView) => void;
}

export default function Login({ onSwitchView }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-4xl font-extrabold text-primary tracking-tight">BeMatch</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to find your perfect match.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2 relative">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Your password" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-6 rounded-xl">
          <Link href="/discover">Log In</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button onClick={() => onSwitchView('register')} className="font-semibold text-primary hover:underline">
            Create New Account
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
