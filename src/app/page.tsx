import Image from 'next/image';
import AuthCard from '@/components/auth-card';
import { placeholderImages } from '@/lib/data';

export default function Home() {
  const authBg = placeholderImages.find(p => p.id === 'auth-bg');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      {authBg && (
        <Image
          src={authBg.imageUrl}
          alt={authBg.description}
          data-ai-hint={authBg.imageHint}
          fill
          className="object-cover -z-10"
        />
      )}
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <AuthCard />
    </main>
  );
}
