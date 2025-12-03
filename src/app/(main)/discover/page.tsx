'use client';
import { useState, useMemo } from 'react';
import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { profiles } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2 } from 'lucide-react';
import { UserProfile } from '@/lib/data';
import { useLanguage } from '@/context/language-context';

const SWIPE_THRESHOLD = 80;

type SwipeDirection = 'left' | 'right' | 'up';

export default function DiscoverPage() {
  const [stack, setStack] = useState<UserProfile[]>(profiles);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const { t } = useLanguage();

  const activeProfile = useMemo(() => stack[stack.length - 1], [stack]);

  const handleSwipe = (direction: SwipeDirection) => {
    if (!activeProfile) return;
    setHistory(prev => [activeProfile, ...prev]);
    setStack(prev => prev.slice(0, prev.length - 1));
  };

  const undoSwipe = () => {
    if (history.length > 0) {
      const lastSwipedProfile = history[0];
      setHistory(prev => prev.slice(1));
      setStack(prev => [...prev, lastSwipedProfile]);
    }
  };

  const onDragEnd = (info: PanInfo) => {
    const { offset, velocity } = info;
    let direction: SwipeDirection | null = null;

    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
      direction = offset.x > 0 ? 'right' : 'left';
    } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -500) {
      direction = 'up';
    }
    
    if (direction) {
        handleSwipe(direction);
    }
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const dislikeOpacity = useTransform(x, [-100, -10], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="w-full max-w-sm h-[60vh] max-h-[500px] relative flex items-center justify-center">
          <AnimatePresence>
            {stack.map((profile, index) => {
                const isTop = index === stack.length - 1;
                
                if (!isTop) {
                   return (
                     <motion.div
                        key={profile.id}
                        initial={{
                            scale: 1 - (stack.length - 1 - index) * 0.05,
                            y: (stack.length - 1 - index) * 10,
                        }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: index,
                        }}
                        className="pointer-events-none"
                    >
                         <Card className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={profile.imageUrls[0]}
                                alt={profile.name}
                                fill
                                className="object-cover"
                            />
                         </Card>
                    </motion.div>
                   )
                }

                return (
                  <motion.div
                    key={profile.id}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => onDragEnd(info)}
                    initial={{ scale: 1, y: 0 }}
                    animate={{ scale: 1, y: 0 }}
                    exit="exit"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      zIndex: index,
                      x,
                      y,
                      rotate,
                    }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <Card className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <CardContent className="p-0 h-full relative">
                        <motion.div style={{ opacity: dislikeOpacity }} className="absolute top-4 left-4 z-10">
                            <X className="w-16 h-16 text-red-500/80" strokeWidth={3} />
                        </motion.div>
                         <motion.div style={{ opacity: likeOpacity }} className="absolute top-4 right-4 z-10">
                            <Heart className="w-16 h-16 text-primary/80" fill="currentColor" strokeWidth={0} />
                        </motion.div>
                         <motion.div style={{ opacity: superLikeOpacity }} className="absolute inset-0 flex items-center justify-center z-10">
                            <Star className="w-24 h-24 text-blue-500/90" fill="currentColor" />
                        </motion.from>
                        
                        <Image
                          src={profile.imageUrls[0]}
                          alt={profile.name}
                          fill
                          className="object-cover pointer-events-none"
                          priority
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
              {stack.length === 0 && (
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
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleSwipe('left')} disabled={stack.length === 0}>
            <X className="w-8 h-8 text-red-500" />
          </Button>
          <Button variant="outline" size="icon" className="w-12 h-12 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleSwipe('up')} disabled={stack.length === 0}>
            <Star className="w-6 h-6 text-blue-500" fill="currentColor" />
          </Button>
          <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white shadow-lg border-gray-200" onClick={() => handleSwipe('right')} disabled={stack.length === 0}>
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
}
