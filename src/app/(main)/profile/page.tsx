'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { profiles } from '@/lib/data';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ProfilePage() {
  const profileCompletion = 75;
  const userProfile = profiles[1]; // Using Alex as a sample profile
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-black">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
            <div className="flex-1" />
            <div className="flex flex-col items-center space-y-4 flex-1">
                <div className="relative">
                    <Progress
                    value={profileCompletion}
                    className="absolute -inset-2 w-[148px] h-[148px] [&>div]:bg-primary"
                    style={
                        {
                        clipPath: 'circle(50% at 50% 50%)',
                        transform: 'rotate(-90deg)',
                        '--tw-shadow': '0 0 15px hsl(var(--primary) / 0.5)',
                        filter: 'drop-shadow(var(--tw-shadow))',
                        } as React.CSSProperties
                    }
                    />
                    <Avatar className="w-36 h-36 border-4 border-background">
                    <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{userProfile.name}, {userProfile.age}</h1>
                </div>
            </div>
             <div className="flex-1 flex justify-end">
                <Link href="/settings" passHref>
                    <Button variant="ghost" size="icon" aria-label={t('settings.title')}>
                        <Settings className="w-6 h-6 text-muted-foreground" />
                    </Button>
                </Link>
            </div>
        </div>

        {/* Photo Gallery */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t('profile.myPhotos')}</h3>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {userProfile.imageUrls.map((url, index) => (
                    <button 
                      key={index} 
                      className="relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => setSelectedImage(url)}
                    >
                        <Image src={url} alt={`${t('profile.profilePhoto')} ${index + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                    </button>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* BeMatch Gold Banner */}
        <Card className="overflow-hidden shadow-xl border-0">
            <div className="p-4 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600 text-black">
                 <CardContent className="p-0 flex items-center gap-3">
                    <Crown className="w-6 h-6" />
                    <div>
                        <h2 className="text-lg font-bold">{t('profile.getGold')}</h2>
                        <p className="text-xs font-medium">{t('profile.goldDescription')}</p>
                    </div>
                </CardContent>
            </div>
        </Card>
      </div>

       {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
          <DialogContent className="p-0 border-0 bg-transparent max-w-none w-auto h-auto shadow-none">
            <DialogHeader>
              <DialogTitle className="sr-only">Enlarged profile photo</DialogTitle>
            </DialogHeader>
            <div className="relative w-[90vw] h-[80vh]">
              <Image 
                src={selectedImage} 
                alt="Enlarged profile" 
                fill 
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
