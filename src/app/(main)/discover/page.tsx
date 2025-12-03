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

const SWIPE_THRESHOLD = 80;

type SwipeDirection = 'left' | 'right' | 'up' | 'none';

export default function DiscoverPage() {
  const [stack, setStack] = useState<UserProfile[]>(profiles);
  const [history, setHistory] = useState<{profile: UserProfile, direction: SwipeDirection}[]>([]);
  const { t } = useLanguage();
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>('none');

  const handleSwipe = (profile: UserProfile, direction: SwipeDirection) => {
    setSwipeDirection(direction);
    setHistory(prev => [{ profile, direction }, ...prev]);
    setStack(prev => prev.filter(p => p.id !== profile.id));
  };

  const undoSwipe = () => {
    if (history.length > 0) {
      const lastAction = history[0];
      setHistory(prev => prev.slice(1));
      setStack(prev => [lastAction.profile, ...prev]);
      setSwipeDirection('none'); // Reset swipe direction on undo
    }
  };

  const onDragEnd = (info: PanInfo, profile: UserProfile) => {
    const { offset, velocity } = info;
    let direction: SwipeDirection = 'none';

    if (offset.x > SWIPE_THRESHOLD || velocity.x > 500) {
      direction = 'right';
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -500) {
      direction = 'left';
    } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -500) {
      direction = 'up';
    }
    
    if (direction !== 'none') {
        handleSwipe(profile, direction);
    }
  };
  
  const getExitVariant = () => {
    if (swipeDirection === 'right') return { x: 300, opacity: 0, scale: 0.8 };
    if (swipeDirection === 'left') return { x: -300, opacity: 0, scale: 0.8 };
    if (swipeDirection === 'up') return { y: -500, opacity: 0, scale: 0.8 };
    return { opacity: 1 };
  };

  const activeIndex = stack.length - 1;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-sm h-[60vh] max-h-[500px] relative flex items-center justify-center">
          <AnimatePresence 
            initial={false}
            onExitComplete={() => setSwipeDirection('none')}
          >
            {stack.length > 0 ? (
              stack.map((profile, index) => {
                const isTop = index === activeIndex;
                return (
                  <motion.div
                    key={profile.id}
                    drag={isTop}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => onDragEnd(info, profile)}
                    initial={{
                      scale: 1 - (stack.length - 1 - index) * 0.05,
                      y: (stack.length - 1 - index) * 10,
                      opacity: index === activeIndex ? 1 : 0.8,
                    }}
                    animate={{
                      scale: 1,
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                    exit={getExitVariant()}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      zIndex: index,
                    }}
                    className={isTop ? "cursor-grab active:cursor-grabbing" : ""}
                  >
                    <Card className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <CardContent className="p-0 h-full relative">
                        <Image
                          src={profile.imageUrls[0]}
                          alt={profile.name}
                          fill
                          className="object-cover pointer-events-none"
                          priority={isTop}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                          <h2 className="text-3xl font-bold text-white">
                            {profile.name}, {profile.age}
                          </h2>
                          <p className="text-white/80 text-lg">{profile.bio.split('. ')[0]}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground">
                <p>{t('discover.noMoreProfiles')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={undoSwipe} disabled={history.length === 0}>
            <Undo2 className="w-6 h-6 text-yellow-500" />
          </Button>
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => stack.length > 0 && handleSwipe(stack[activeIndex], 'left')} disabled={stack.length === 0}>
            <X className="w-8 h-8 text-red-500" />
          </Button>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={() => stack.length > 0 && handleSwipe(stack[activeIndex], 'up')} disabled={stack.length === 0}>
            <Star className="w-6 h-6 text-blue-500" fill="currentColor" />
          </Button>
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => stack.length > 0 && handleSwipe(stack[activeIndex], 'right')} disabled={stack.length === 0}>
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
}
