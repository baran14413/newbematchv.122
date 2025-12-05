'use client';
import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Star, Heart, Undo2, ChevronUp } from 'lucide-react';
import { profiles, type UserProfile } from '@/lib/data';
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
      setStack(prev => [...stack, lastSwipedProfile]);
    }
  };

  const handleTapOnCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeProfile) return;
    const { clientX, currentTarget } = e;
    const { left, width } = currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;
    
    if (clickPosition < width / 3) {
      setCurrentImageIndex(prev => Math.max(0, prev - 1));
    } else if (clickPosition > (width * 2) / 3) {
      setCurrentImageIndex(prev => Math.min(prev + 1, (activeProfile.imageUrls?.length || 1) - 1));
    }
  };


  return (
    <div className="h-full w-full flex flex-col bg-gray-50 dark:bg-black">
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
                    <Card className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
                      <CardContent className="p-0 h-full relative" onClick={isTop ? handleTapOnCard : undefined}>
                        {profile.imageUrls && profile.imageUrls.length > 0 ?
                        <AnimatePresence initial={false}>
                             <motion.div
                                key={currentImageIndex}
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
                                    className="object-cover"
                                    priority={isTop}
                                />
                            </motion.div>
                        </AnimatePresence>
                        :
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">No Images</div>
                        }

                        {profile.imageUrls && profile.imageUrls.length > 1 &&
                          <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                              {profile.imageUrls.map((_, imgIndex) => (
                                  <div key={imgIndex} className="flex-1 h-1 rounded-full bg-black/30">
                                      <div 
                                          className="h-full rounded-full bg-white transition-all duration-300"
                                          style={{ width: imgIndex === currentImageIndex ? '100%' : '0%' }}
                                      />
                                  </div>
                              ))}
                          </div>
                        }

                        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {profile.name}, {profile.age}
                            </h2>
                            <p className="text-white/80">{t('discover.job')}</p>
                          </div>
                          
                           <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white/80 hover:text-white"
                            onClick={() => setDetailSheetOpen(true)}
                          >
                            <ChevronUp className="w-6 h-6" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
      
      {activeProfile && (
        <Sheet open={isDetailSheetOpen} onOpenChange={setDetailSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl h-[90vh] flex flex-col">
            <SheetHeader className="text-center pt-4">
              <SheetTitle className="text-2xl">{activeProfile.name}, {activeProfile.age}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeProfile.imageUrls && activeProfile.imageUrls.length > 0 &&
                  <div className="grid grid-cols-2 gap-4">
                      {activeProfile.imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                              <Image src={url} alt={`${activeProfile.name} photo ${index + 1}`} fill className="object-cover" />
                          </div>
                      ))}
                  </div>
                }

                <Card>
                    <CardContent className="p-4">
                        <p>{activeProfile.bio}</p>
                    </CardContent>
                </Card>

                {activeProfile.prompts && activeProfile.prompts.length > 0 && (
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

                {activeProfile.zodiac && <Card>
                    <CardContent className="p-4">
                        <p className="font-semibold text-sm text-muted-foreground mb-2">Burç</p>
                        <p className="text-lg">{activeProfile.zodiac}</p>
                    </CardContent>
                </Card>}

            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
