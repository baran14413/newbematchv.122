'use client';
import { useLanguage } from "@/context/language-context";
import { likesYouData } from "@/lib/data";
import { Card } from "../ui/card";
import { Star, Heart, Lock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LikesGrid() {
    const { t } = useLanguage();
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {likesYouData.map((like) => (
                <Card key={like.id} className="aspect-[3/4] rounded-lg overflow-hidden relative group">
                   {like.likeType !== 'locked' ? (
                    <Image src={like.avatarUrl} alt={like.name} fill className="object-cover"/>
                   ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center backdrop-blur-sm">
                         <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
                    </div>
                   )}

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

                   {like.likeType === 'locked' && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-yellow-400"/>
                     </div>
                   )}
                </Card>
            ))}
        </div>
    )
}
