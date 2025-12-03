'use client';
import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profiles } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2, ChevronUp } from 'lucide-react';
import type { UserProfile } from '@/lib/data';
import { useLanguage } from '@/context/language-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

type SwipeDirection = 'left' | 'right' | 'up';

export default function DiscoverPage() {
  const [stack, setStack] = useState<UserProfile[]>(profiles);
  const [history, setHistory] = useState<UserProfile[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDetailSheetOpen, setDetailSheetOpen] = useState(false);

  const { t } = useLanguage();

  const activeProfile = useMemo(() => stack[stack.length - 1], [stack]);

  useEffect(() => {
    // Reset image index when the active profile changes
    setCurrentImageIndex(0);
  }, [activeProfile]);

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

  const handleImageNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeProfile) return;
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 2) {
      // Clicked on the left side
      setCurrentImageIndex(prev => Math.max(0, prev - 1));
    } else {
      // Clicked on the right side
      setCurrentImageIndex(prev => {
        if (prev === activeProfile.imageUrls.length - 1) {
          // If on the last image, swipe right
          handleSwipe('right');
          return prev;
        }
        return prev + 1;
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
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
                    onDragEnd={(e, info) => {
                        const { offset, velocity } = info;
                        let direction: SwipeDirection | null = null;
                        const SWIPE_THRESHOLD = 80;

                        if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > 500) {
                            direction = offset.x > 0 ? 'right' : 'left';
                        } else if (offset.y < -SWIPE_THRESHOLD || velocity.y < -500) {
                            direction = 'up';
                        }
                        
                        if (direction) {
                            handleSwipe(direction);
                        }
                    }}
                    initial={{
                        y: 0,
                        scale: 1 - (stack.length - 1 - index) * 0.05,
                        opacity: isTop ? 1 : 0.5
                    }}
                    animate={{
                        y: (stack.length - 1 - index) * -10,
                        scale: 1 - (stack.length - 1 - index) * 0.05,
                        opacity: isTop ? 1 : (index === stack.length - 2 ? 1 : 0)
                    }}
                    exit={{
                        x: 300,
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
                    className={isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}
                  >
                    <Card className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <CardContent className="p-0 h-full relative">
                        {/* Image Gallery */}
                        <AnimatePresence initial={false}>
                             <motion.div
                                key={`${profile.id}-${currentImageIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full h-full"
                            >
                                <Image
                                    src={profile.imageUrls[isTop ? currentImageIndex : 0]}
                                    alt={profile.name}
                                    fill
                                    className="object-cover pointer-events-none"
                                    priority={isTop}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Top Progress Bars */}
                        <div className="absolute top-2 left-2 right-2 flex gap-1 z-20">
                            {profile.imageUrls.map((_, imgIndex) => (
                                <div key={imgIndex} className="flex-1 h-1 rounded-full bg-white/50">
                                    <div 
                                        className="h-full rounded-full bg-white" 
                                        style={{ width: imgIndex < currentImageIndex ? '100%' : (imgIndex === currentImageIndex ? '100%' : '0%'), transition: 'width 0.3s' }} 
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Overlay */}
                        {isTop && <div className="absolute inset-0 z-10" onClick={handleImageNavigation} />}

                        {/* Gradient & Info */}
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end pointer-events-none z-10">
                          <h2 className="text-3xl font-bold text-white">
                            {profile.name}, {profile.age}
                          </h2>
                          <p className="text-white/80 text-lg">{profile.bio.split('. ')[0]}</p>
                        </div>

                        {/* Detail Sheet Trigger */}
                        {isTop && (
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute bottom-4 right-4 z-20 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                                onClick={() => setDetailSheetOpen(true)}
                            >
                                <ChevronUp className="w-6 h-6" />
                            </Button>
                        )}
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
      
      {activeProfile && (
        <Sheet open={isDetailSheetOpen} onOpenChange={setDetailSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col">
            <SheetHeader className="text-center pt-4">
              <SheetTitle className="text-2xl">{activeProfile.name}, {activeProfile.age}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {activeProfile.imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                            <Image src={url} alt={`${activeProfile.name} photo ${index + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-4">
                        <p>{activeProfile.bio}</p>
                    </CardContent>
                </Card>

                {activeProfile.prompts.length > 0 && (
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            {activeProfile.prompts.map((p, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm text-muted-foreground">{p.question}</p>
                                    <p className="text-lg">{p.answer}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-4">
                        <p className="font-semibold text-sm text-muted-foreground mb-2">Burç</p>
                        <p className="text-lg">{activeProfile.zodiac}</p>
                    </CardContent>
                </Card>

            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

    