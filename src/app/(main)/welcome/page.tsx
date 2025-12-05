'use client';

import { Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Rule = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-1">
    <h3 className="font-bold text-xl">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/discover');
    }, 10000); // 10 seconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white p-8">
      <div className="w-full max-w-md space-y-10">
        <div className="space-y-4">
          <Flame className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">BeMatch'e hoş geldin.</h1>
          <p className="text-muted-foreground text-lg">Lütfen aşağıdaki kurallara uymayı unutma.</p>
        </div>
        <div className="space-y-6">
          <Rule
            title="Kendin ol."
            description="Fotoğraflarının, yaşının ve biyografinin gerçeği yansıttığından emin ol."
          />
          <Rule
            title="Dikkatli ol."
            description="Kişisel bilgilerini paylaşmadan önce iyi düşün."
          />
          <Rule
            title="Nazik ol."
            description="Diğer kullanıcılara saygı göster ve sana nasıl davranılmasını istiyorsan onlara da öyle davran."
          />
          <Rule
            title="Proaktif ol."
            description="Kötü davranışları mutlaka bize bildir."
          />
        </div>
      </div>
    </div>
  );
}
