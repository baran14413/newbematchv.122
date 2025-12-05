'use client';
import { useState } from 'react';
import type { UserProfile } from '@/lib/data';
import Image from 'next/image';
import { MapPin, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type ProfileCardProps = {
  profile: UserProfile;
  onShowDetails: () => void;
};

export default function ProfileCard({ profile, onShowDetails }: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = profile.imageUrls?.length || 1;

  const navigateImages = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => Math.min(prev + 1, totalImages - 1));
    } else {
      setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="w-full h-full bg-card rounded-2xl shadow-lg overflow-hidden relative group">
      {/* Progress Bars */}
      {totalImages > 1 && (
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
            src={profile.imageUrls[currentImageIndex]} 
            alt={`${profile.name}'s photo ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
        />
        {/* Navigation Overlays */}
        {totalImages > 1 && (
          <>
            <div className="absolute top-0 left-0 h-full w-1/2 z-10" onClick={() => navigateImages('prev')}></div>
            <div className="absolute top-0 right-0 h-full w-1/2 z-10" onClick={() => navigateImages('next')}></div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h2 className="text-4xl font-bold">{profile.name}, {profile.age}</h2>
            <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-5 h-5" />
                <p>{profile.location}</p>
            </div>
            {profile.distance && (
                 <p className="text-sm mt-1">{profile.distance} km uzaklıkta</p>
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
      </div>
    </div>
  );
}
