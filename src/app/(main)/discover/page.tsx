'use client';
import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2 } from 'lucide-react';
import { profiles, type UserProfile } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileCard from '@/components/discover/profile-card';
import { ScrollArea } from '@/components/ui/scroll-area';

type SwipeDirection = 'left' | 'right' | 'up';

export default function DiscoverPage() {
  const [stack, setStack] = useState<UserProfile[]>(profiles);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

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
      setStack(prev => [...stack, lastSwipedProfile]);
    }
  };

  if (isMobile === undefined) {
    return null; // or a loading skeleton
  }

  if (!isMobile) {
    return (
      <div className="h-full w-full flex justify-center bg-gray-50 dark:bg-black">
        <ScrollArea className="w-full max-w-md">
           <div className="flex flex-col items-center gap-8 p-4 md:p-8">
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm h-[65vh] max-h-[550px] relative flex items-center justify-center">
          <AnimatePresence>
            {stack.length > 0 ? (
              stack.map((profile, index) => {
                const isTop = index === stack.length - 1;
                
                return (
                  <motion.div
                    key={profile.id}
                    drag={isTop}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onDragEnd={(e, info: PanInfo) => {
                      const { offset } = info;
                      if (offset.x > 100) {
                        handleSwipe('right');
                      } else if (offset.x < -100) {
                        handleSwipe('left');
                      } else if (offset.y < -100) {
                        handleSwipe('up');
                      }
                    }}
                    initial={{
                        y: 0,
                        scale: 1 - (stack.length - 1 - index) * 0.05,
                        opacity: index === stack.length - 1 ? 1 : 0
                    }}
                    animate={{
                        y: (stack.length - 1 - index) * -10,
                        scale: 1 - (stack.length - 1 - index) * 0.05,
                        opacity: index >= stack.length - 2 ? 1 : 0
                    }}
                    exit={{
                      x: info => (info.offset.x > 0 ? 300 : -300),
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      zIndex: index,
                    }}
                    className={isTop ? "cursor-grab active:cursor-grabbing" : ""}
                  >
                     <ProfileCard profile={profile} />
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground">{t('discover.noMoreProfiles')}</p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" className="p-4 rounded-full bg-white shadow" onClick={undoSwipe} disabled={history.length === 0}>
            <Undo2 className="w-6 h-6 text-yellow-500" />
          </Button>
          <Button variant="outline" className="p-5 rounded-full bg-white shadow" onClick={() => handleSwipe('left')}>
            <X className="w-8 h-8 text-red-500" />
          </Button>
          <Button variant="outline" className="p-4 rounded-full bg-white shadow" onClick={() => handleSwipe('up')}>
            <Star className="w-6 h-6 text-blue-500" />
          </Button>
          <Button variant="outline" className="p-5 rounded-full bg-white shadow" onClick={() => handleSwipe('right')}>
            <Heart className="w-8 h-8 text-green-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}