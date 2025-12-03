'use client';
import AuthScreen from '@/components/auth/auth-screen';
import { placeholderImages } from '@/lib/data';
import Image from 'next/image';

export default function Home() {
  const bgImage = placeholderImages.find((p) => p.id === 'auth-bg');

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col justify-center">
        <AuthScreen />
      </div>
    </main>
  );
}
