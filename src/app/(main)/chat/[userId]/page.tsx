'use client';
import { useState, useMemo } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import type { UserProfile, Message } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';


function formatMessageTimestamp(timestamp: any) {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}


export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const otherUserId = params.userId as string;

    const { user, isUserLoading: isCurrentUserLoading } = useUser();
    const firestore = useFirestore();

    const [newMessage, setNewMessage] = useState('');

    const otherUserDocRef = useMemoFirebase(() => {
        if (!firestore || !otherUserId) return null;
        return doc(firestore, 'users', otherUserId);
    }, [firestore, otherUserId]);
    const { data: otherUser, isLoading: isOtherUserLoading } = useDoc<UserProfile>(otherUserDocRef);

    const matchId = useMemo(() => {
        if (!user || !otherUserId) return null;
        return [user.uid, otherUserId].sort().join('_');
    }, [user, otherUserId]);

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !matchId) return null;
        return query(collection(firestore, 'matches', matchId, 'messages'), orderBy('timestamp', 'asc'));
    }, [firestore, matchId]);
    
    const { data: messages, isLoading: areMessagesLoading } = useCollection<Message>(messagesQuery);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !firestore || !matchId) return;

        const messagesRef = collection(firestore, 'matches', matchId, 'messages');
        
        try {
            await addDoc(messagesRef, {
                senderId: user.uid,
                text: newMessage,
                timestamp: serverTimestamp(),
                isAiGenerated: false,
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };
    
    const isLoading = isCurrentUserLoading || isOtherUserLoading || areMessagesLoading;

    if (isLoading) {
       return (
        <div className="h-full flex flex-col bg-black text-white">
          <header className="flex items-center gap-4 p-3 border-b border-gray-800 sticky top-0 bg-black z-10">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </header>
           <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              <div className="flex justify-end gap-2">
                  <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
               <div className="flex justify-start gap-2">
                   <Skeleton className="h-8 w-8 rounded-full" />
                   <Skeleton className="h-12 w-64 rounded-2xl" />
               </div>
           </div>
           <div className="p-2 border-t border-gray-800 sticky bottom-0 bg-black">
                <Skeleton className="h-12 w-full rounded-full" />
           </div>
        </div>
      )
    }

    if (!otherUser) {
        notFound();
    }


    return (
        <div className="h-full flex flex-col bg-background text-foreground">
            {/* Header */}
            <header className="flex items-center gap-4 p-3 border-b sticky top-0 bg-background z-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{otherUser.name}</h2>
                </div>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages?.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-end gap-2",
                            message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                        )}
                    >
                         {message.senderId !== user?.uid && (
                            <Avatar className="h-8 w-8 self-end">
                                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                                "max-w-md p-3 rounded-2xl flex flex-col",
                                message.senderId === user?.uid
                                    ? 'bg-rose-600 text-primary-foreground rounded-br-none'
                                    : 'bg-gray-800 text-secondary-foreground rounded-bl-none'
                            )}
                        >
                            <p>{message.text}</p>
                             <div className="flex items-center justify-end gap-1.5 self-end mt-1">
                                <span className={cn("text-xs", message.senderId === user?.uid ? "text-primary-foreground/70" : "text-muted-foreground")}>{formatMessageTimestamp(message.timestamp)}</span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <footer className="p-2 border-t sticky bottom-0 bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        placeholder="Bir mesaj yaz..."
                        className="flex-1 bg-gray-900 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 rounded-full px-5 text-base"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" className="bg-primary text-primary-foreground w-10 h-10 rounded-full" disabled={!newMessage.trim()}>
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </footer>
        </div>
    );
}
