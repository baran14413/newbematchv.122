'use client';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const interestsList = [
  'Müzik', 'Seyahat', 'Oyun', 'Filmler', 'Okuma', 'Yemek yapmak',
  'Spor', 'Fitness', 'Sanat', 'Fotoğrafçılık', 'Yürüyüş', 'Dans',
  'Teknoloji', 'Moda', 'Yoga', 'Kamp', 'Tiyatro', 'Gönüllülük'
];

const initialUserInterests = ['Müzik', 'Seyahat', 'Spor'];

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialUserInterests);

  const handleToggle = (interest: string) => {
    const newInterests = new Set(selectedInterests);
    if (newInterests.has(interest)) {
      newInterests.delete(interest);
    } else {
      if(newInterests.size < 7) {
        newInterests.add(interest);
      }
    }
    setSelectedInterests(Array.from(newInterests));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
        <header className="p-4 py-6 md:p-8 flex items-center gap-4">
             <Link href="/settings" passHref>
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-primary">İlgi Alanlarını Düzenle</h1>
                <p className="text-muted-foreground">Profilinde göstereceğin en fazla 7 ilgi alanı seç.</p>
            </div>
        </header>

        <div className="md:p-8 md:pt-0 space-y-8">
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                    {interestsList.map((interest) => (
                        <Badge
                        key={interest}
                        onClick={() => handleToggle(interest)}
                        variant={selectedInterests.includes(interest) ? 'default' : 'secondary'}
                        className={cn(
                            'px-4 py-2 text-sm font-semibold cursor-pointer transition-all rounded-full',
                            selectedInterests.includes(interest)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        )}
                        >
                        {interest}
                        </Badge>
                    ))}
                    </div>
                </CardContent>
            </Card>
             <Button className="w-full md:w-auto">Değişiklikleri Kaydet</Button>
        </div>
    </div>
  );
}
