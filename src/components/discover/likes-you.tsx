'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from "@/context/language-context";
import { Card } from "../ui/card";
import { Star, Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { UserProfile } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import ProfileDetails from './profile-details';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

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

     const handleStartChat = async (profile: LikedByProfile) => {
        if (!user || !firestore) return;

        const currentUserId = user.uid;
        const targetUserId = profile.id;
        const chatId = [currentUserId, targetUserId].sort().join('_');
        
        const matchesRef = collection(firestore, 'matches');
        
        const q = query(matchesRef, where('users', 'array-contains', currentUserId));
        
        const querySnapshot = await getDocs(q);
        let existingMatchId: string | null = null;

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.users.includes(targetUserId)) {
                existingMatchId = doc.id;
            }
        });

        if (existingMatchId) {
            router.push(`/chat/${existingMatchId}`);
        } else {
            try {
                const batch = writeBatch(firestore);
                const matchRef = doc(matchesRef, chatId);

                batch.set(matchRef, {
                    users: [currentUserId, targetUserId],
                    timestamp: serverTimestamp(),
                    lastMessage: ''
                });

                // Remove the 'like' notification
                const likedByRef = doc(firestore, 'users', currentUserId, 'likedBy', targetUserId);
                batch.delete(likedByRef);

                await batch.commit();
                router.push(`/chat/${chatId}`);
            } catch (error) {
                console.error("Error creating chat and removing like:", error);
            }
        }
    };


    useEffect(() => {
        const fetchProfiles = async () => {
            if (!likes || !firestore) return;

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

    
    if (isLoading || isUserLoading || isLoadingLikes) {
        return <LikesGridSkeleton />;
    }

    if (likedByProfiles.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-8">
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
                        className="aspect-[3/4] rounded-lg overflow-hidden relative group"
                    >
                       <div onClick={() => setSelectedProfile(like)} className="cursor-pointer w-full h-full">
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
                       </div>
                       <Button onClick={() => handleStartChat(like)} className="absolute bottom-4 right-4 rounded-full h-12 w-12 bg-green-500 hover:bg-green-600">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </Button>
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
                       </>
                   )}
                </SheetContent>
            </Sheet>
        </>
    )
}

    