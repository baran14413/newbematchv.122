'use client';
import { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2, Clapperboard } from 'lucide-react';
import { UserProfile, profiles as staticProfiles } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileCard from '@/components/discover/profile-card';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


type SwipeDirection = 'left' | 'right' | 'up';

const SwipeableCard = ({ profile, onSwipe, isTop }: { profile: UserProfile, onSwipe: (direction: SwipeDirection) => void, isTop: boolean }) => {
  const x = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -10], [1, 0]);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    if (Math.abs(offset.y) > Math.abs(offset.x)) {
      if (offset.y < -100) onSwipe('up');
      return;
    }

    if (offset.x > 100) {
      onSwipe('right');
    } else if (offset.x < -100) {
      onSwipe('left');
    }
  };
  
  return (
    <motion.div
      className="absolute w-full h-full"
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, cursor: isTop ? 'grab' : 'auto' }}
      whileDrag={{ cursor: 'grabbing' }}
    >
        <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-12 right-6 z-10 p-4 bg-black/30 rounded-full"
        >
            <Heart className="w-12 h-12 text-green-400" fill="currentColor" />
        </motion.div>

        <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-12 left-6 z-10 p-4 bg-black/30 rounded-full"
        >
            <X className="w-12 h-12 text-red-500" strokeWidth={3} />
        </motion.div>
        
        <ProfileCard profile={profile} />

    </motion.div>
  );
};

const DesktopProfileSkeleton = () => (
    <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-[500px] w-full rounded-2xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    </div>
)


export default function DiscoverPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'users')) : null),
    [firestore]
  );
  
  const { data: profiles, isLoading } = useCollection<UserProfile>(usersQuery);

  const filteredProfiles = useMemo(() => {
    if (!profiles || !user) return [];
    return profiles.filter(p => p.id !== user.uid);
  }, [profiles, user]);

  const [stack, setStack] = useState<UserProfile[]>([]);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Populate stack when profiles are loaded
  useMemo(() => {
    if (filteredProfiles.length > 0) {
        setStack(filteredProfiles)
    } else {
        setStack([])
    }
  }, [filteredProfiles]);

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

  if (isLoading) {
     return (
         <div className="h-full w-full flex justify-center bg-gray-50 dark:bg-black p-4 md:p-8">
            {isMobile ? 
                <div className="w-full max-w-sm h-[65vh] max-h-[550px] relative flex items-center justify-center">
                     <Skeleton className="w-full h-full rounded-2xl" />
                </div>
                : 
                <div className='flex flex-col gap-8'>
                    <DesktopProfileSkeleton />
                    <DesktopProfileSkeleton />
                </div>
            }
         </div>
     )
  }

  if (!isMobile) {
    return (
      <div className="w-full flex flex-col items-center bg-gray-50 dark:bg-black p-4 md:p-8 space-y-8">
        <div className="w-full max-w-md space-y-8">
          {filteredProfiles.length > 0 ? filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          )) : <p className="text-center text-muted-foreground">{t('discover.noMoreProfiles')}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm h-[65vh] max-h-[550px] relative flex items-center justify-center">
          {stack.length > 0 ? (
            stack.map((profile, index) => {
              const isTop = index === stack.length - 1;
              return (
                <motion.div
                  key={profile.id}
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
                    x: (info) => (info.offset.x > 0 ? 300 : -300),
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
                >
                  <SwipeableCard
                    profile={profile}
                    onSwipe={handleSwipe}
                    isTop={isTop}
                  />
                </motion.div>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground">{t('discover.noMoreProfiles')}</p>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" className="p-4 rounded-full bg-white shadow" onClick={undoSwipe} disabled={history.length === 0}>
            <Undo2 className="w-6 h-6 text-yellow-500" />
          </Button>
          <Button variant="outline" className="p-5 rounded-full bg-white shadow" onClick={() => handleSwipe('left')}>
            <X className="w-8 h-8 text-destructive" />
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
