'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from "@/context/language-context";
import { Card } from "../ui/card";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import ProfileDetails from './profile-details';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type LikeInfo = {
    id: string; // liker's ID
    type: 'like' | 'superlike';
};

type LikedByProfile = UserProfile & {
    likeType: 'like' | 'superlike';
};

const LikesGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-lg" />
        ))}
    </div>
);

export default function LikesGrid() {
    const { t } = useLanguage();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const [likedByProfiles, setLikedByProfiles] = useState<LikedByProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState<LikedByProfile | null>(null);

    const likedByQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, 'users', user.uid, 'likedBy');
    }, [user, firestore]);

    const { data: likes, isLoading: isLoadingLikes } = useCollection<LikeInfo>(likedByQuery);

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!likes || !firestore) return;

            // Prevent re-fetching if data is already loaded
            if (likes.length === likedByProfiles.length && likedByProfiles.every(p => likes.some(l => l.id === p.id))) {
                 setIsLoading(false);
                 return;
            }

            try {
                const profilePromises = likes.map(async (like) => {
                    const userDocRef = doc(firestore, 'users', like.id);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        return { 
                            ...(userDoc.data() as UserProfile), 
                            id: userDoc.id, 
                            likeType: like.type 
                        };
                    }
                    return null;
                });

                const profiles = (await Promise.all(profilePromises)).filter(p => p !== null) as LikedByProfile[];
                setLikedByProfiles(profiles);
            } catch (error) {
                console.error("Error fetching liked by profiles: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        if (!isLoadingLikes) {
            fetchProfiles();
        }

    }, [likes, firestore, isLoadingLikes, likedByProfiles]);

    const handleStartChat = async (profile: LikedByProfile) => {
        if (!user || !firestore) return;
        
        const matchId = [user.uid, profile.id].sort().join('_');
        const matchRef = doc(firestore, 'matches', matchId);

        try {
            // Create a match document so the chat page can load
            const batch = writeBatch(firestore);

            batch.set(matchRef, {
                id: matchId,
                users: [user.uid, profile.id],
                user1Id: user.uid,
                user2Id: profile.id,
                matchDate: serverTimestamp(),
                lastMessage: null,
            });

            // Also record that the current user "liked" back
            const currentUserSwipeRef = doc(firestore, 'users', user.uid, 'swipes', profile.id);
             batch.set(currentUserSwipeRef, {
                type: 'like',
                timestamp: serverTimestamp()
            });

            await batch.commit();
            
            // Now navigate to the chat
            router.push(`/lounge/${matchId}`);

        } catch (error) {
            console.error("Error creating match and starting chat: ", error);
            // Optionally show an error toast
        }
    }
    
    if (isLoading || isUserLoading || isLoadingLikes) {
        return <LikesGridSkeleton />;
    }

    if (likedByProfiles.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <p className="text-muted-foreground">Seni henüz beğenen kimse yok.</p>
            </div>
        )
    }
    
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {likedByProfiles.map((like) => (
                    <Card 
                        key={like.id} 
                        className="aspect-[3/4] rounded-lg overflow-hidden relative group cursor-pointer"
                        onClick={() => setSelectedProfile(like)}
                    >
                       <Image src={like.avatarUrl} alt={like.name} fill className="object-cover"/>
                       
                       <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white font-bold truncate">{like.name}</p>
                       </div>

                       <div className={cn("absolute top-1.5 right-1.5 p-1.5 rounded-full",
                         like.likeType === 'superlike' && "bg-blue-500/80",
                         like.likeType === 'like' && "bg-red-500/80",
                       )}>
                        {like.likeType === 'superlike' && <Star className="w-4 h-4 text-white fill-white"/>}
                        {like.likeType === 'like' && <Heart className="w-4 h-4 text-white fill-white"/>}
                       </div>
                    </Card>
                ))}
            </div>

            <Sheet open={!!selectedProfile} onOpenChange={(isOpen) => !isOpen && setSelectedProfile(null)}>
                <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl flex flex-col p-0">
                   {selectedProfile && (
                       <>
                         <SheetHeader className="sr-only">
                           <SheetTitle>Profil Detayları</SheetTitle>
                           <SheetDescription>{selectedProfile.name} kullanıcısının profil detayları</SheetDescription>
                         </SheetHeader>
                         <div className="flex-1 overflow-hidden">
                           <ProfileDetails profile={selectedProfile} />
                         </div>
                         <div className="p-4 border-t bg-background">
                            <Button className="w-full h-14 text-lg" onClick={() => handleStartChat(selectedProfile)}>Hadi İlk Adımı At!</Button>
                         </div>
                       </>
                   )}
                </SheetContent>
            </Sheet>
        </>
    )
}
