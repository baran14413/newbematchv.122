'use client';
import AuthScreen from '@/components/auth/auth-screen';
import { placeholderImages } from '@/lib/data';
import Image from 'next/image';

export default function Home() {
  const bgImage = placeholderImages.find((p) => p.id === 'auth-bg');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover -z-10 brightness-[0.2]"
          priority
        />
      )}
      <AuthScreen />
    </main>
  );
}
