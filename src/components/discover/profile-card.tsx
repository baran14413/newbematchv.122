'use client';
import type { UserProfile } from '@/lib/data';
import Image from 'next/image';
import { MapPin, Info } from 'lucide-react';
import { Button } from '../ui/button';

type ProfileCardProps = {
  profile: UserProfile;
  onShowDetails: () => void;
};

export default function ProfileCard({ profile, onShowDetails }: ProfileCardProps) {
  
  return (
    <div className="w-full h-full bg-card rounded-2xl shadow-lg overflow-hidden relative">
      <div className="relative w-full h-full">
        <Image 
            src={profile.imageUrls[0]} 
            alt={`${profile.name}'s main photo`}
            fill
            className="object-cover"
            priority
        />
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
            className="absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50 hover:text-white"
        >
            <Info className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
