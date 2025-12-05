'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/data";
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

type Match = {
    id: string;
    users: string[];
    timestamp: any;
    lastMessage: string;
};

type ConversationPreview = {
    chatId: string;
    otherUser: UserProfile;
    lastMessage: string;
    timestamp: any;
};

export default function LoungePage() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();

  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const matchesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'matches'), where('users', 'array-contains', user.uid));
  }, [user, firestore]);

  const { data: matches } = useCollection<Match>(matchesQuery);

  useEffect(() => {
    const fetchConversationDetails = async () => {
        if (!matches || !firestore || !user) return;
        
        setIsLoading(true);
        const convPromises = matches.map(async (match) => {
            const otherUserId = match.users.find(uid => uid !== user.uid);
            if (!otherUserId) return null;

            const userDocRef = doc(firestore, 'users', otherUserId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const otherUser = { ...userDoc.data(), id: userDoc.id } as UserProfile;
                return {
                    chatId: match.id,
                    otherUser,
                    lastMessage: match.lastMessage,
                    timestamp: match.timestamp?.toDate()
                };
            }
            return null;
        });

        const resolvedConversations = (await Promise.all(convPromises)).filter(Boolean) as ConversationPreview[];
        resolvedConversations.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setConversations(resolvedConversations);
        setIsLoading(false);
    };

    fetchConversationDetails();
  }, [matches, firestore, user]);

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Conversation List */}
      <div className="flex flex-col h-full">
          <header className="p-4 border-b">
            <h1 className="text-2xl font-bold text-foreground">{t('lounge.conversations')}</h1>
          </header>
          <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2 p-2">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {Array.from({length: 3}).map((_, i) => (
                             <div key={i} className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                                <div className="space-y-2 flex-1">
                                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"/>
                                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : conversations.length > 0 ? conversations.map((convo) => (
                    <Link href={`/chat/${convo.chatId}`} key={convo.chatId}>
                        <div className={cn(
                            "px-3 py-2 flex items-center gap-3 cursor-pointer rounded-lg border-2 border-transparent",
                            "hover:bg-secondary/50 transition-colors duration-200"
                        )}>
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={convo.otherUser.avatarUrl} alt={convo.otherUser.name} />
                                <AvatarFallback>{convo.otherUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground text-md truncate">{convo.otherUser.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage || 'Sohbeti başlat...'}</p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1.5 text-xs text-muted-foreground ml-2">
                                {convo.timestamp && (
                                   <span className="whitespace-nowrap">
                                        {formatDistanceToNow(convo.timestamp, { addSuffix: true, locale: tr })}
                                   </span>
                                )}
                            </div>
                        </div>
                    </Link>
                )) : (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-8">
                        <p className="text-muted-foreground">{t('lounge.noConversations')}</p>
                    </div>
                )}
              </div>
          </ScrollArea>
      </div>
    </div>
  );
}

    