'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, updateDoc, serverTimestamp, orderBy, query, Timestamp, onSnapshot } from 'firebase/firestore';
import type { UserProfile, Message } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Video, Phone, CheckCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function formatMessageTimestamp(timestamp: any) {
  if (!timestamp) return '';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

const ChatSkeleton = () => (
  <div className="flex flex-col h-full">
    <header className="flex items-center gap-4 p-3 border-b bg-background">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </header>
    <div className="flex-1 p-4 space-y-6">
      <div className="flex items-end gap-2 justify-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </div>
      <div className="flex items-end gap-2 justify-end">
        <Skeleton className="h-16 w-64 rounded-2xl" />
      </div>
      <div className="flex items-end gap-2 justify-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>
    </div>
    <footer className="p-2 border-t bg-background">
      <Skeleton className="h-11 w-full rounded-full" />
    </footer>
  </div>
);

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const chatId = params.chatId as string;

  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const matchDocRef = useMemoFirebase(() => {
      if (!firestore || !chatId) return null;
      return doc(firestore, 'matches', chatId);
  }, [firestore, chatId]);

  const { data: matchData, isLoading: isMatchLoading } = useDoc(matchDocRef);
  
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !chatId) return null;
    return query(collection(firestore, 'matches', chatId, 'messages'), orderBy('timestamp', 'asc'));
  }, [firestore, chatId]);

  const { data: messages, isLoading: areMessagesLoading } = useCollection<Message>(messagesQuery);

  useEffect(() => {
    if (matchData && user && firestore) {
      const otherUserId = matchData.users.find((uid: string) => uid !== user.uid);
      if (otherUserId) {
        const userDocRef = doc(firestore, 'users', otherUserId);
        const unsub = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setOtherUser({ id: doc.id, ...doc.data() } as UserProfile);
          } else {
            // Handle case where other user's profile is not found
            setOtherUser(null);
          }
        });
        return () => unsub();
      }
    }
  }, [matchData, user, firestore]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !matchDocRef) return;

    const messagesRef = collection(firestore, 'matches', chatId, 'messages');
    try {
      await addDoc(messagesRef, {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
        isAiGenerated: false
      });
      
      await updateDoc(matchDocRef, {
        lastMessage: newMessage,
        timestamp: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isLoading = isUserLoading || isMatchLoading || areMessagesLoading || (matchData && !otherUser);

  if (isLoading) {
    return <ChatSkeleton />;
  }

  if (!matchData || !user) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Sohbet bulunamadı veya oturum açmadınız. ID: {chatId}</p>
        </div>
    );
  }
  
  if (!otherUser) {
      return (
         <div className="flex items-center justify-center h-full">
            <p>Sohbet edilecek kullanıcı bulunamadı.</p>
        </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-secondary/20">
      <header className="flex items-center gap-4 p-3 border-b bg-background">
        <div className="flex-1 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{otherUser.name}</h2>
            {/* <p className="text-sm text-green-400">Online</p> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Phone className="w-5 h-5" />
            </Button>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4" viewportRef={viewportRef}>
        <div className="space-y-6">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-end gap-2", message.senderId === user?.uid ? 'justify-end' : 'justify-start')}
            >
              {message.senderId !== user?.uid && (
                <Avatar className="h-8 w-8 self-end">
                  <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                  <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
               <div
                className={cn(
                    "max-w-[70%] p-3 rounded-2xl flex flex-col",
                    message.senderId === user?.uid
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-background text-foreground rounded-bl-none'
                )}
              >
                <p className='break-words'>{message.text}</p>
                 {message.senderId === user?.uid && message.timestamp && (
                    <div className="flex items-center justify-end gap-1.5 self-end mt-1">
                        <span className="text-xs text-primary-foreground/70">{formatMessageTimestamp(message.timestamp)}</span>
                        <CheckCheck className="w-4 h-4 text-blue-400" />
                    </div>
                 )}
                 {message.senderId !== user?.uid && message.timestamp && (
                     <div className="flex items-center justify-end gap-1.5 self-end mt-1">
                        <span className="text-xs text-muted-foreground/70">{formatMessageTimestamp(message.timestamp)}</span>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <footer className="p-2 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
                 <Input
                    placeholder="Mesaj yaz..."
                    className="flex-1 bg-secondary border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11 rounded-full px-4 pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-1 text-primary w-9 h-9" disabled={!newMessage.trim()}>
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </form>
      </footer>
    </div>
  );
}
