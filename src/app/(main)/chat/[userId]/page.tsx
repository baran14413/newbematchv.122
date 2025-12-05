'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, updateDoc, serverTimestamp, orderBy, query, Timestamp, onSnapshot } from 'firebase/firestore';
import type { UserProfile, Message } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCheck, Mic, Phone, Plus, Send, Video, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

function formatMessageTimestamp(timestamp: any) {
  if (!timestamp) return '';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

const ChatSkeleton = () => (
    <div className="flex flex-col h-screen bg-zinc-900">
      <header className="flex items-center gap-4 p-3 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
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
      <footer className="p-3 border-t border-zinc-800 bg-zinc-900">
        <Skeleton className="h-12 w-full rounded-full" />
      </footer>
    </div>
);

const VoiceNotePlayer = () => (
    <div className="flex items-center gap-2 text-white">
        <Play className="w-5 h-5"/>
        <div className="w-32 h-1 bg-white/30 rounded-full">
            <div className="w-1/4 h-full bg-white rounded-full"></div>
        </div>
        <span className="text-xs">0:07</span>
    </div>
);

export default function ChatPage() {
  const params = useParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const chatId = params.userId as string;

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

  const { data: realMessages, isLoading: areMessagesLoading } = useCollection<Message>(messagesQuery);
  
  const dummyMessages: Message[] = [
    { id: '101', senderId: 'dummy-user-id', text: "Selam! Profilindeki seyahat fotoğrafların harika, özellikle o sahil fotoğrafı. Neredeydi orası?", timestamp: new Timestamp(1672522500, 0), isAiGenerated: false },
    { id: '102', senderId: user?.uid || 'current-user-id', text: "Teşekkür ederim! Orası geçen yaz gittiğim Fethiye'ydi. Senin de müzik zevkin çok iyiymiş.", timestamp: new Timestamp(1672522800, 0), isAiGenerated: false },
    { id: '103', senderId: 'dummy-user-id', text: "", timestamp: new Timestamp(1672522900, 0), isAiGenerated: false, type: 'image', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop' },
    { id: '104', senderId: user?.uid || 'current-user-id', text: "", timestamp: new Timestamp(1672523100, 0), isAiGenerated: false, type: 'voice' },
  ];

  const messages = [...dummyMessages, ...(realMessages || [])];


  useEffect(() => {
    if (matchData && user && firestore) {
      const otherUserId = matchData.users.find((uid: string) => uid !== user.uid);
      if (otherUserId) {
        const userDocRef = doc(firestore, 'users', otherUserId);
        const unsub = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setOtherUser({ id: doc.id, ...doc.data() } as UserProfile);
          } else {
            setOtherUser(null);
          }
        });
        return () => unsub();
      }
    }
  }, [matchData, user, firestore]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !firestore || !matchDocRef) return;

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
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll on initial load and when messages change
    scrollToBottom();
  }, [messages]);

  const isLoading = isUserLoading || isMatchLoading || areMessagesLoading || (matchData && !otherUser);

  if (isLoading) {
    return <ChatSkeleton />;
  }
  
  if (!user) {
     return (
        <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
            <p>Sisteme giriş yapmanız gerekiyor. ID: {chatId}</p>
        </div>
    );
  }

  if (!otherUser) {
      return (
         <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
            <p>Sohbet edilecek kullanıcı bulunamadı.</p>
        </div>
      )
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white" style={{ backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px 300px', backgroundRepeat: 'repeat' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative flex flex-col h-full">
            <header className="flex items-center gap-3 p-3 border-b border-white/10 bg-black/60 backdrop-blur-md">
                <Link href="/lounge" passHref>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-zinc-700">
                        <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                        <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold">{otherUser.name}</h2>
                    <p className="text-xs text-green-400 font-medium">Şu an aktif</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white">
                        <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white">
                        <Phone className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <ScrollArea className="flex-1 p-4" viewportRef={viewportRef}>
                <div className="space-y-4">
                {messages?.map((message) => (
                    <div
                    key={message.id}
                    className={cn("flex items-end gap-2 w-full", message.senderId === user?.uid ? 'justify-end' : 'justify-start')}
                    >
                    <div
                        className={cn(
                            "max-w-[70%] p-3 rounded-2xl flex flex-col",
                            message.senderId === user?.uid
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-zinc-800 text-white rounded-bl-sm'
                        )}
                    >
                        {message.type === 'image' && message.imageUrl && (
                            <div className="relative w-64 h-auto aspect-square mb-2 rounded-lg overflow-hidden">
                                <Image src={message.imageUrl} alt="photo message" fill className="object-cover" />
                            </div>
                        )}
                        {message.type === 'voice' && (
                            <VoiceNotePlayer />
                        )}
                        {message.text && <p className='break-words'>{message.text}</p>}
                        {message.senderId === user?.uid && (
                            <div className="flex items-center justify-end gap-1.5 self-end mt-1 -mb-1">
                                <span className="text-xs text-primary-foreground/70">{formatMessageTimestamp(message.timestamp)}</span>
                                <CheckCheck className="w-4 h-4 text-blue-300" />
                            </div>
                        )}
                         {message.senderId !== user?.uid && message.text && (
                             <div className="flex items-center justify-end gap-1.5 self-end mt-1 -mb-1">
                                <span className="text-xs text-zinc-400">{formatMessageTimestamp(message.timestamp)}</span>
                            </div>
                         )}
                    </div>
                    </div>
                ))}
                </div>
            </ScrollArea>

            <footer className="p-3 border-t border-white/10 bg-zinc-900/80 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <Button type="button" size="icon" variant="ghost" className="w-10 h-10 rounded-full flex-shrink-0">
                        <Plus className="w-6 h-6" />
                    </Button>
                    <textarea
                        placeholder="Mesaj..."
                        className="flex-1 bg-zinc-800 rounded-2xl px-4 py-2.5 text-white focus:outline-none placeholder-zinc-500 resize-none max-h-24"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e as any);
                            }
                        }}
                    />
                    <Button type={newMessage.trim() ? "submit" : "button"} size="icon" variant={newMessage.trim() ? "default" : "ghost"} className="w-10 h-10 rounded-full flex-shrink-0 bg-primary hover:bg-primary/90">
                       {newMessage.trim() ? <Send className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                </form>
            </footer>
        </div>
    </div>
  );
}
