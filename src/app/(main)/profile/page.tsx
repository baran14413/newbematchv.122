'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { profiles } from '@/lib/data';
import Image from 'next/image';

export default function ProfilePage() {
  const profileCompletion = 75;
  const userProfile = profiles[1]; // Using Alex as a sample profile

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
                    <Button variant="outline" className="mt-4 rounded-full border-primary/50 text-primary hover:bg-primary/5 hover:text-primary">
                    Profili Düzenle
                    </Button>
                </div>
            </div>
             <div className="flex-1 flex justify-end">
                <Link href="/settings" passHref>
                    <Button variant="ghost" size="icon" aria-label="Ayarlar">
                        <Settings className="w-6 h-6 text-muted-foreground" />
                    </Button>
                </Link>
            </div>
        </div>

        {/* BeMatch Gold Banner */}
        <Card className="overflow-hidden shadow-xl border-0">
            <div className="p-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600 text-black">
                 <CardContent className="p-0 flex items-center gap-6">
                    <Crown className="w-12 h-12" />
                    <div>
                        <h2 className="text-2xl font-bold">BeMatch Gold Alın</h2>
                        <p className="font-medium">Sizi kimlerin beğendiğini görün ve sınırsız kaydırın!</p>
                    </div>
                </CardContent>
            </div>
        </Card>

        {/* Photo Gallery */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
             <h3 className="text-lg font-semibold mb-4">Fotoğraflarım</h3>
             <div className="grid grid-cols-3 gap-2">
                {userProfile.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image src={url} alt={`Profil fotoğrafı ${index + 1}`} fill className="object-cover" />
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  );
}
