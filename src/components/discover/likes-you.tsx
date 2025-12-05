'use client';
import { useLanguage } from "@/context/language-context";
import { likesYouData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Star, Heart, Lock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function LikesYou() {
    const { t } = useLanguage();
    
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">{t('discover.likesYou.title')}</h2>
                <Button variant="link" className="pr-0">{t('discover.likesYou.seeAll')}</Button>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2">
                {likesYouData.map((like) => (
                    <Card key={like.id} className="min-w-[100px] aspect-[3/4] rounded-lg overflow-hidden relative group">
                       {like.likeType !== 'locked' ? (
                        <Image src={like.avatarUrl} alt={like.name} fill className="object-cover"/>
                       ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center backdrop-blur-sm">
                             <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
                        </div>
                       )}

                       <div className={cn("absolute top-1.5 right-1.5 p-1 rounded-full",
                         like.likeType === 'superlike' && "bg-blue-500/80",
                         like.likeType === 'like' && "bg-red-500/80",
                       )}>
                        {like.likeType === 'superlike' && <Star className="w-3 h-3 text-white fill-white"/>}
                        {like.likeType === 'like' && <Heart className="w-3 h-3 text-white fill-white"/>}
                       </div>

                       {like.likeType === 'locked' && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-yellow-400"/>
                         </div>
                       )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
