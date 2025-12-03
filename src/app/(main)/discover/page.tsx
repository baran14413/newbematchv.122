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
  const [history, setHistory] = useState<UserProfile[]>([]);
  const { t } = useLanguage();

  const popCard = (profile: UserProfile, direction: 'left' | 'right' | 'up') => {
    setHistory(prev => [...prev, profile]);
    setStack((prev) => prev.slice(0, -1));
  };
  
  const undoSwipe = () => {
    if (history.length > 0) {
      const lastSwiped = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setStack(prev => [...prev, lastSwiped]);
    }
  }

  const handleAction = (direction: 'left' | 'right' | 'up') => {
    if (stack.length > 0) {
      const topCard = stack[stack.length - 1];
      // Animate the card out
      // A more robust implementation would use a state to trigger exit animation
      // For now, we just pop it. The AnimatePresence will handle the exit.
      popCard(topCard, direction);
    }
  };

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipeThreshold = 50;
    const swipePower = (offset: number, velocity: number) => {
      return Math.abs(offset) * velocity;
    };

    if (swipePower(info.offset.x, info.velocity.x) < -10000) {
      popCard(stack[stack.length - 1], 'left');
    } else if (swipePower(info.offset.x, info.velocity.x) > 10000) {
      popCard(stack[stack.length - 1], 'right');
    } else if (swipePower(info.offset.y, info.velocity.y) < -10000) {
      popCard(stack[stack.length - 1], 'up');
    }
  };

  const variants = {
    enter: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    center: (index: number) => ({
      x: 0,
      y: index * -10,
      scale: 1 - index * 0.05,
      zIndex: profiles.length - index,
    }),
    exit: (direction: 'left' | 'right' | 'up') => {
      return {
        x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
        y: direction === 'up' ? -300 : 0,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 }
      };
    },
  };


  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-sm h-[60vh] max-h-[500px] relative flex items-center justify-center">
            <AnimatePresence initial={false}>
                {stack.map((profile, index) => {
                const isTop = index === stack.length - 1;
                
                return (
                    <motion.div
                      key={profile.id}
                      drag={isTop}
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.2}
                      onDragEnd={onDragEnd}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      custom={index}
                      className="absolute w-full h-full"
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
                              <p className="text-white/80 text-lg">{profile.bio.split('. ')[0]}</p>
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
            <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={undoSwipe} disabled={history.length === 0}>
              <Undo2 className="w-6 h-6 text-yellow-500" />
            </Button>
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleAction('left')} disabled={stack.length === 0}>
              <X className="w-8 h-8 text-red-500" />
            </Button>
            <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleAction('up')} disabled={stack.length === 0}>
              <Star className="w-6 h-6 text-blue-500" fill="currentColor" />
            </Button>
            <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleAction('right')} disabled={stack.length === 0}>
              <Heart className="w-8 h-8 text-primary" fill="currentColor"/>
            </Button>
        </div>
      </div>
    </div>
  );
}
