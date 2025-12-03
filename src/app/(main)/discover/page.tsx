'use client';
import { useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { profiles } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2 } from 'lucide-react';
import { UserProfile } from '@/lib/data';
import { useLanguage } from '@/context/language-context';

export default function DiscoverPage() {
  const [stack, setStack] = useState<UserProfile[]>(profiles);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();
  const [history, setHistory] = useState<UserProfile[]>([]);

  const popCard = (swipedProfile: UserProfile) => {
    setHistory(prev => [...prev, swipedProfile]);
    setStack((prev) => prev.slice(0, -1));
  };
  
  const undoSwipe = () => {
    if (history.length > 0) {
      const lastSwiped = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setStack(prev => [...prev, lastSwiped]);
    }
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (isAnimating || stack.length === 0) return;
    setIsAnimating(true);
    // Burada kaydırma mantığını yönetirsiniz (beğenme, beğenmeme, süper beğenme)
    console.log(`Kaydırıldı: ${direction}`);
    const swipedCard = stack[stack.length - 1];
    popCard(swipedCard);
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    const threshold = 100;

    if (Math.abs(offset.x) > threshold) {
      handleSwipe(offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-sm h-[60vh] max-h-[500px] relative flex items-center justify-center">
            <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
                {stack.map((profile, index) => {
                const isTop = index === stack.length - 1;
                return (
                    <motion.div
                    key={profile.id}
                    drag={isTop}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.7}
                    onDragEnd={onDragEnd}
                    initial={{ scale: 1 - (stack.length - 1 - index) * 0.05, y: (stack.length - 1 - index) * -10, opacity: 1 }}
                    animate={{ scale: 1 - (stack.length - 1 - index) * 0.05, y: (stack.length - 1 - index) * -10, opacity: 1 }}
                    exit={{ x: stack[index].id % 2 === 0 ? 300 : -300, opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                    className="absolute w-full h-full"
                    style={{ zIndex: index }}
                    >
                    <Card className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                        <CardContent className="p-0 h-full relative">
                        <Image
                            src={profile.imageUrls[0]}
                            alt={profile.name}
                            fill
                            className="object-cover"
                            priority={isTop}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                            <h2 className="text-3xl font-bold text-white">
                            {profile.name}, {profile.age}
                            </h2>
                            <p className="text-white/80 text-lg">{t('discover.job')}</p>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                );
                })}
            </AnimatePresence>
            {stack.length === 0 && (
                <div className="text-center text-muted-foreground">
                    <p>{t('discover.noMoreProfiles')}</p>
                </div>
            )}
        </div>
        
        <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={undoSwipe}>
              <Undo2 className="w-6 h-6 text-yellow-500" />
            </Button>
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleSwipe('left')}>
              <X className="w-8 h-8 text-red-500" />
            </Button>
            <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleSwipe('up')}>
              <Star className="w-6 h-6 text-blue-500" fill="currentColor" />
            </Button>
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleSwipe('right')}>
              <Heart className="w-8 h-8 text-primary" fill="currentColor"/>
            </Button>
        </div>
      </div>
    </div>
  );
}
