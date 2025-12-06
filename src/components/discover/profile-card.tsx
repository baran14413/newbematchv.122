'use client';
import { useState } from 'react';
import type { UserProfile } from '@/lib/data';
import Image from 'next/image';
import { MapPin, Info, Music, Dumbbell, Plane, Clapperboard, Gamepad2, BookOpen, Utensils, Camera, Mountain, PartyPopper, Mars, Venus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

type ProfileCardProps = {
  profile: UserProfile;
  onShowDetails: () => void;
  isTopCard: boolean;
};

const interestIcons: { [key: string]: React.ElementType } = {
  music: Music,
  sports: Dumbbell,
  travel: Plane,
  movies: Clapperboard,
  gaming: Gamepad2,
  reading: BookOpen,
  cooking: Utensils,
  photography: Camera,
  hiking: Mountain,
  dancing: PartyPopper,
  // Add other interests with their icons here
};

const getCountryFlag = (location: string | undefined): string => {
    if (!location) return '';
    const parts = location.split(',');
    const countryCode = parts[parts.length - 1]?.trim().toUpperCase();
    if (countryCode && countryCode.length === 2) {
        try {
            return String.fromCodePoint(...[...countryCode].map(c => c.charCodeAt(0) + 127397));
        } catch (e) {
            return '';
        }
    }
    return '';
}

export default function ProfileCard({ profile, onShowDetails, isTopCard }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useLanguage();
  const totalImages = profile.imageUrls?.length || 1;
  const flag = getCountryFlag(profile.location);

  const navigateImages = (e: React.MouseEvent, direction: 'next' | 'prev') => {
    // Prevent swipe gesture from triggering when changing images
    e.stopPropagation();
    if (!isTopCard) return;

    if (direction === 'next') {
      setCurrentImageIndex((prev) => Math.min(prev + 1, totalImages - 1));
    } else {
      setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const displayedInterests = profile.interests?.slice(0, 2) || [];

  return (
    <div className="w-full h-full bg-card rounded-2xl shadow-lg overflow-hidden relative group">
      {/* Progress Bars */}
      {totalImages > 1 && isTopCard && (
        <div className="absolute top-2 left-2 right-2 z-20 flex items-center gap-1">
          {Array.from({ length: totalImages }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-1 flex-1 rounded-full',
                idx === currentImageIndex ? 'bg-white' : 'bg-white/40'
              )}
            />
          ))}
        </div>
      )}

      <div className="relative w-full h-full">
        <Image 
            src={profile.imageUrls?.[currentImageIndex] || profile.avatarUrl} 
            alt={`${profile.name}'s photo ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority={isTopCard}
        />
        {/* Navigation Overlays */}
        {totalImages > 1 && isTopCard && (
          <>
            <div className="absolute top-0 left-0 h-full w-1/2 z-10" onClick={(e) => navigateImages(e, 'prev')}></div>
            <div className="absolute top-0 right-0 h-full w-1/2 z-10" onClick={(e) => navigateImages(e, 'next')}></div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h2 className="text-4xl font-bold">{profile.name}, {profile.age}</h2>
            <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-5 h-5" />
                <p>{profile.location}</p>
            </div>
            {profile.distance !== undefined && (
                 <p className="text-sm mt-1">{profile.distance} km uzaklıkta</p>
            )}

            {displayedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {displayedInterests.map((interest) => {
                  const Icon = interestIcons[interest] || null;
                  return (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-black/40 text-white border-white/30 backdrop-blur-sm"
                    >
                      {Icon && <Icon className="w-4 h-4 mr-1.5" />}
                      {t(`interests.${interest}`)}
                    </Badge>
                  );
                })}
              </div>
            )}
        </div>
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
                e.stopPropagation(); // prevent card drag
                onShowDetails();
            }}
            className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50 hover:text-white z-20"
        >
            <Info className="w-6 h-6" />
        </Button>
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 text-2xl rounded-full px-3 py-1 backdrop-blur-sm z-20">
            {flag && (
                <span className="text-xl">{flag}</span>
            )}
            {profile.gender === 'man' && <Mars className="w-5 h-5 text-blue-400" />}
            {profile.gender === 'woman' && <Venus className="w-5 h-5 text-pink-400" />}
        </div>
      </div>
    </div>
  );
}