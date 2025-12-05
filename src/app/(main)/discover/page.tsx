'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileCard from '@/components/discover/profile-card';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, where, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/data';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import ProfileDetails from '@/components/discover/profile-details';
import TutorialOverlay from '@/components/discover/tutorial-overlay';

type SwipeDirection = 'left' | 'right' | 'up';

const MAX_VISIBLE_CARDS = 3;

// Haversine formula to calculate distance between two lat/lon points
const getDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance);
};


const SwipeableCard = ({
  profile,
  onSwipe,
  onShowDetails,
  isTop,
}: {
  profile: UserProfile;
  onSwipe: (direction: SwipeDirection) => void;
  onShowDetails: () => void;
  isTop: boolean;
}) => {
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

      <ProfileCard profile={profile} onShowDetails={onShowDetails} isTopCard={isTop}/>
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
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const [detailsProfile, setDetailsProfile] = useState<UserProfile | null>(null);

  const [profileIndex, setProfileIndex] = useState(0);
  const [visibleStack, setVisibleStack] = useState<UserProfile[]>([]);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  // Fetch current user's profile to get their coordinates and preferences
  const currentUserDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: currentUserProfile } = useDoc<UserProfile>(currentUserDocRef);

  const usersQuery = useMemoFirebase(() => {
    // Wait until firestore, the user profile, and the preference are loaded
    if (!firestore || !currentUserProfile || !currentUserProfile.interestedIn) {
      return null;
    }

    const baseQuery = collection(firestore, 'users');
    const interestedIn = currentUserProfile.interestedIn;
    
    if (interestedIn === 'everyone') {
      return query(baseQuery);
    }
    
    return query(baseQuery, where('gender', '==', interestedIn));

  }, [firestore, currentUserProfile]);


  const { data: profiles, isLoading } = useCollection<UserProfile>(usersQuery);

  const filteredAndSortedProfiles = useMemo(() => {
    if (!profiles || !currentUserProfile) return [];

    const {
        ageRange = [18, 55],
        globalMode = true,
        maxDistance = 150,
        latitude: currentLat,
        longitude: currentLon,
    } = currentUserProfile;

    const [minAge, maxAge] = ageRange;
    
    return profiles
      .filter(p => {
        // Exclude self and apply age range filter
        const isNotSelf = p.id !== user?.uid;
        const isInAgeRange = p.age >= minAge && p.age <= maxAge;
        return isNotSelf && isInAgeRange;
      })
      .map(p => {
        const hasCoords = currentLat && currentLon && p.latitude && p.longitude;
        const distance = hasCoords
            ? getDistanceInKm(currentLat, currentLon, p.latitude!, p.longitude!)
            : undefined;
        return { ...p, distance };
      })
      .filter(p => {
          // Apply distance filter only if global mode is off
          if (globalMode || p.distance === undefined) {
              return true;
          }
          return p.distance <= maxDistance;
      })
      .sort((a, b) => {
        // Sort by distance if global mode is on
        if (globalMode) {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        }
        return 0; // No specific sort if global mode is off
      });
  }, [profiles, currentUserProfile, user]);

  
  useEffect(() => {
    if (filteredAndSortedProfiles.length > 0) {
      const initialStack = filteredAndSortedProfiles.slice(profileIndex, profileIndex + MAX_VISIBLE_CARDS).reverse();
      setVisibleStack(initialStack);
    }
  }, [filteredAndSortedProfiles, profileIndex]);

  useEffect(() => {
    // Show tutorial only on mobile, once, when profiles are loaded
    if (isMobile && profiles && profiles.length > 0) {
      const hasSeenTutorial = localStorage.getItem('hasSeenSwipeTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        const timer = setTimeout(() => {
          setShowTutorial(false);
          localStorage.setItem('hasSeenSwipeTutorial', 'true');
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [isMobile, profiles]);


  const handleSwipe = useCallback(() => {
    if (visibleStack.length === 0) return;

    // Add current profile to history
    const swipedProfile = visibleStack[visibleStack.length - 1];
    setHistory(prev => [swipedProfile, ...prev]);

    // Move to the next profile in the main list
    const nextIndex = profileIndex + 1;
    setProfileIndex(nextIndex);

    // Update visible stack: remove swiped, add next one if available
    setVisibleStack(prev => {
        const newStack = prev.slice(0, prev.length - 1);
        const nextProfile = filteredAndSortedProfiles[nextIndex + MAX_VISIBLE_CARDS - 1];
        if (nextProfile) {
            // Add to the "bottom" of the stack (beginning of the array)
            return [nextProfile, ...newStack];
        }
        return newStack;
    });

  }, [visibleStack, profileIndex, filteredAndSortedProfiles]);

  const undoSwipe = () => {
    if (history.length > 0) {
      const lastSwipedProfile = history[0];
      setHistory(prev => prev.slice(1));
      
      const newProfileIndex = profileIndex - 1;
      setProfileIndex(newProfileIndex);

      setVisibleStack(prev => {
        // Add the undone profile to the top of the stack
        const newStack = [...prev];
        if (newStack.length >= MAX_VISIBLE_CARDS) {
            newStack.shift(); // Remove card from the bottom
        }
        newStack.push(lastSwipedProfile);
        return newStack;
      });
    }
  };

  const manualSwipe = (direction: SwipeDirection) => {
    if (visibleStack.length > 0) {
      handleSwipe();
    }
  }


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
                </div>
            }
         </div>
     )
  }

  if (!isMobile) {
    return (
      <div className="w-full flex flex-col items-center p-4 md:p-8 space-y-8">
          <div className="w-full max-w-md space-y-8">
          {filteredAndSortedProfiles.length > 0 ? filteredAndSortedProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} onShowDetails={() => setDetailsProfile(profile)} isTopCard={false}/>
          )) : <p className="text-center text-muted-foreground">{t('discover.noMoreProfiles')}</p>}
           <Sheet open={!!detailsProfile} onOpenChange={(isOpen) => !isOpen && setDetailsProfile(null)}>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                   {detailsProfile && <ProfileDetails profile={detailsProfile} />}
                </SheetContent>
            </Sheet>
          </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm h-[70vh] max-h-[600px] relative flex items-center justify-center">
          {visibleStack.length > 0 ? (
            <>
              {visibleStack.map((profile, index) => {
                const isTop = index === visibleStack.length - 1;
                const stackIndex = visibleStack.length - 1 - index;
                return (
                  <motion.div
                    key={profile.id}
                    initial={{
                      y: 0,
                      scale: 1 - stackIndex * 0.05,
                      opacity: index === visibleStack.length - 1 ? 1 : 0
                    }}
                    animate={{
                      y: stackIndex * -10,
                      scale: 1 - stackIndex * 0.05,
                      opacity: stackIndex < MAX_VISIBLE_CARDS -1 ? 1 : (isTop ? 1 : 0),
                    }}
                    exit={{
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
                      onShowDetails={() => setDetailsProfile(profile)}
                      isTop={isTop}
                    />
                  </motion.div>
                );
              })}
              {showTutorial && <TutorialOverlay />}
            </>
          ) : (
            <p className="text-center text-muted-foreground">{t('discover.noMoreProfiles')}</p>
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" className="p-4 rounded-full bg-white shadow" onClick={undoSwipe} disabled={history.length === 0}>
            <Undo2 className="w-6 h-6 text-yellow-500" />
          </Button>
          <Button variant="outline" className="p-5 rounded-full bg-white shadow" onClick={() => manualSwipe('left')}>
            <X className="w-8 h-8 text-destructive" />
          </Button>
          <Button variant="outline" className="p-4 rounded-full bg-white shadow" onClick={() => manualSwipe('up')}>
            <Star className="w-6 h-6 text-blue-500" />
          </Button>
          <Button variant="outline" className="p-5 rounded-full bg-white shadow" onClick={() => manualSwipe('right')}>
            <Heart className="w-8 h-8 text-green-500" />
          </Button>
        </div>
      </div>
      <Sheet open={!!detailsProfile} onOpenChange={(isOpen) => !isOpen && setDetailsProfile(null)}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col">
            {detailsProfile && <ProfileDetails profile={detailsProfile} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
