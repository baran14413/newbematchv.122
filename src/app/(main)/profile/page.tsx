'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { profiles } from '@/lib/data';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ProfilePage() {
  // const userProfile = profiles[1]; // Using Alex as a sample profile
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleNextImage = () => {
    // if (selectedImageIndex === null || !userProfile) return;
    // setSelectedImageIndex((prevIndex) => 
    //     prevIndex === null ? 0 : (prevIndex + 1) % userProfile.imageUrls.length
    // );
  };

  const handlePrevImage = () => {
    // if (selectedImageIndex === null || !userProfile) return;
    // setSelectedImageIndex((prevIndex) =>
    //   prevIndex === null ? 0 : (prevIndex - 1 + userProfile.imageUrls.length) % userProfile.imageUrls.length
    // );
  };

  // if (!userProfile) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-black">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
            <div className="flex-1" />
            <div className="flex flex-col items-center space-y-4 flex-1">
                <div className="relative w-40 h-40">
                    <div className="absolute inset-0 animate-[spin_5s_linear_infinite]">
                        <svg className="w-full h-full" viewBox="0 0 160 160">
                            <defs>
                                <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.2 }} />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="80"
                                cy="80"
                                r="74"
                                stroke="url(#neon-gradient)"
                                strokeWidth="4"
                                fill="transparent"
                                style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.8))' }}
                                strokeDasharray="300 164"
                                strokeLinecap='round'
                            />
                        </svg>
                    </div>
                    <div className='absolute inset-2'>
                        <Avatar className="w-full h-full border-4 border-background">
                        {/* <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} className="object-cover"/>
                        <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback> */}
                        </Avatar>
                    </div>
                </div>
                <div className="text-center">
                    {/* <h1 className="text-3xl font-bold">{userProfile.name}, {userProfile.age}</h1> */}
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
                {/* {userProfile.imageUrls.map((url, index) => (
                    <button 
                      key={index} 
                      className="relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                        <Image src={url} alt={`${t('profile.profilePhoto')} ${index + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                    </button>
                ))} */}
             </div>
          </CardContent>
        </Card>

        {/* BeMatch Gold Banner */}
        <Link href="/settings/subscriptions" passHref>
            <Card className="overflow-hidden shadow-xl border-0 cursor-pointer transition-transform hover:scale-105">
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
        </Link>
      </div>

      <AnimatePresence>
        {selectedImageIndex !== null && (
          <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
            <DialogContent 
              className="bg-black/90 border-none p-0 w-screen h-screen max-w-none flex items-center justify-center"
            >
              <DialogHeader className="sr-only">
                  <DialogTitle>Enlarged profile photo</DialogTitle>
              </DialogHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X className="w-8 h-8" />
              </Button>
              
              <AnimatePresence mode="wait">
                  <motion.div
                      key={selectedImageIndex}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.5, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="relative w-[90vw] h-[80vh]"
                      onClick={(e) => e.stopPropagation()}
                  >
                      {/* <Image
                          src={userProfile.imageUrls[selectedImageIndex]}
                          alt="Enlarged profile"
                          fill
                          className="object-contain"
                      /> */}
                  </motion.div>
              </AnimatePresence>

              {/* {userProfile.imageUrls.length > 1 && (
                  <>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 z-50"
                          onClick={(e) => {e.stopPropagation(); handlePrevImage();}}
                      >
                          <ChevronLeft className="w-10 h-10" />
                      </Button>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 z-50"
                          onClick={(e) => {e.stopPropagation(); handleNextImage();}}
                      >
                          <ChevronRight className="w-10 h-10" />
                      </Button>
                  </>
              )} */}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
