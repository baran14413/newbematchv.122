'use client';
import { useState } from 'react';
import ProfileCard from '@/components/discover/profile-card';
import { profiles } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { X, Heart } from 'lucide-react';

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleInteraction = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 md:p-8 relative overflow-hidden">
      {currentProfile && (
        <div className="w-full max-w-sm h-[80vh] max-h-[700px] relative">
            <ProfileCard key={currentProfile.id} profile={currentProfile} />
        </div>
      )}
      <div className="flex gap-8 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="w-20 h-20 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={handleInteraction}
        >
          <X className="w-10 h-10" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-20 h-20 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-500"
          onClick={handleInteraction}
        >
          <Heart className="w-9 h-9" />
        </Button>
      </div>
    </div>
  );
}
