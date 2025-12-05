'use client';
import { useState } from 'react';
import type { UserProfile } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import VoiceNote from './voice-note';
import { Heart } from 'lucide-react';

type ProfileCardProps = {
  profile: UserProfile;
};

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [showLike, setShowLike] = useState<{ id: string; x: number; y: number } | null>(null);

  const handleDoubleClick = (e: React.MouseEvent, id: string) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(id)) {
      newLikedItems.delete(id);
    } else {
      newLikedItems.add(id);
    }
    setLikedItems(newLikedItems);

    const rect = e.currentTarget.getBoundingClientRect();
    setShowLike({ id, x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setShowLike(null), 600);
  };

  const renderMedia = (url: string, index: number) => {
    const id = `media-${index}`;
    return (
      <div
        key={id}
        className="relative w-full aspect-[3/4] rounded-lg overflow-hidden snap-start"
        onDoubleClick={(e) => handleDoubleClick(e, id)}
      >
        <Image src={url} alt={`${profile.name}'s photo ${index + 1}`} fill className="object-cover" />
        {likedItems.has(id) && (
          <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
          </div>
        )}
        {showLike?.id === id && (
          <div
            className="absolute animate-in fade-in zoom-in-50"
            style={{ left: showLike.x - 24, top: showLike.y - 24, pointerEvents: 'none' }}
          >
            <Heart className="w-12 h-12 text-white/90 fill-red-500/80" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full h-full overflow-hidden shadow-2xl bg-card/80 backdrop-blur-md border-white/10">
      <CardContent className="p-0 h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {profile.videoUrl && (
          <div className="relative w-full aspect-[3/4] snap-start">
            <video
              src={profile.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {profile.imageUrls.map(renderMedia)}
        
        <div className="p-4 space-y-4 snap-start bg-card/90">
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
              <h2 className="text-3xl font-bold text-white">{profile.name}, {profile.age}</h2>
              <p className="text-white/80">{profile.bio}</p>
            </div>
        </div>

        {profile.voiceNoteUrl && (
          <div className="p-4 snap-start">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">My voice intro</h3>
            <VoiceNote audioSrc={profile.voiceNoteUrl} />
          </div>
        )}

        {profile.prompts.map((prompt, index) => {
          const id = `prompt-${index}`;
          return (
            <div
              key={id}
              className="p-4 snap-start relative"
              onDoubleClick={(e) => handleDoubleClick(e, id)}
            >
              <h3 className="text-sm font-semibold text-muted-foreground">{prompt.question}</h3>
              <p className="text-lg text-foreground mt-1">{prompt.answer}</p>
              {likedItems.has(id) && (
                <div className="absolute top-5 right-5 bg-black/50 p-2 rounded-full">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </div>
              )}
               {showLike?.id === id && (
                  <div
                    className="absolute animate-in fade-in zoom-in-50"
                    style={{ left: showLike.x - 24, top: showLike.y - 24, pointerEvents: 'none' }}
                  >
                    <Heart className="w-12 h-12 text-foreground/80 fill-red-500/80" />
                  </div>
                )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}