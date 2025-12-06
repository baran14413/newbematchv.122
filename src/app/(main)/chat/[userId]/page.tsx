'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, Timestamp, onSnapshot, runTransaction } from 'firebase/firestore';
import type { UserProfile, Message } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Check, CheckCheck, Mic, Phone, Plus, Send, Video, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/language-context';
import EmojiPicker from 'emoji-picker-react';

function formatMessageTimestamp(timestamp: any) {
  if (!timestamp) return '';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function formatLastSeen(timestamp: any, locale: Locale) {
    if (!timestamp) return null;
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffSeconds = (now.getTime() - date.getTime()) / 1000;

    if (diffSeconds < 5) {
        return "çevrimiçi";
    }
    
    const timeFormat = format(date, 'HH:mm');

    if (isToday(date)) {
        return `son görülme bugün ${timeFormat}`;
    }

    if (isYesterday(date)) {
        return `son görülme dün ${timeFormat}`;
    }

    return formatDistanceToNow(date, { addSuffix: true, locale });
}

const ReactionTooltip = ({ children, onReaction }: { children: React.ReactNode, onReaction: (emoji: string) => void }) => {
    const popularEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    const handleEmojiSelect = (emojiData: { emoji: string; }) => {
        onReaction(emojiData.emoji);
        setEmojiPickerOpen(false);
    }
    
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent className="p-1 rounded-full bg-zinc-800 border-zinc-700">
                    <div className="flex items-center gap-1">
                        {popularEmojis.map(emoji => (
                            <Button key={emoji} variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-zinc-700" onClick={() => onReaction(emoji)}>
                                <span className="text-lg">{emoji}</span>
                            </Button>
                        ))}
                         <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-zinc-700 hover:bg-zinc-600">
                                    <Plus className="w-4 h-4 text-zinc-400"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side='bottom' className="p-0 border-0">
                                <EmojiPicker onEmojiClick={handleEmojiSelect} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const MessageOptions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void; }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <MoreHorizontal className="w-5 h-5"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1">
                 <div className="flex flex-col">
                    <Button variant="ghost" onClick={onEdit} className="justify-start px-2 py-1 h-auto">
                        <Pencil className="w-4 h-4 mr-2"/>
                        Düzenle
                    </Button>
                    <Button variant="ghost" onClick={onDelete} className="justify-start px-2 py-1 h-auto text-red-500 hover:text-red-500 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2"/>
                        Sil
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
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


export default function ChatPage() {
  const params = useParams();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { locale } = useLanguage();

  const chatId = params.userId as string;

  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  
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
  
  const lastSeenLocale = locale === 'tr' ? tr : enUS;

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
    
   const handleReaction = async (messageId: string, emoji: string) => {
    if (!firestore || !chatId || !user) return;
    const messageRef = doc(firestore, 'matches', chatId, 'messages', messageId);

    await runTransaction(firestore, async (transaction) => {
        const messageDoc = await transaction.get(messageRef);
        if (!messageDoc.exists()) return;

        const data = messageDoc.data();
        const reactions = data.reactions || {};
        
        let userHasReacted = false;
        let previousEmoji: string | null = null;
        for (const key in reactions) {
             if (reactions[key].includes(user.uid)) {
                 userHasReacted = true;
                 previousEmoji = key;
                 break;
             }
        }
        
        if (userHasReacted && previousEmoji) {
            // User is changing their reaction or removing it
            const previousEmojiUsers = reactions[previousEmoji].filter((uid: string) => uid !== user.uid);
            if (previousEmojiUsers.length > 0) {
                 reactions[previousEmoji] = previousEmojiUsers;
            } else {
                delete reactions[previousEmoji];
            }
             if (previousEmoji === emoji) {
                // User clicked the same emoji again, so we just removed it.
                transaction.update(messageRef, { reactions });
                return;
            }
        }
        
        if (!reactions[emoji]) {
            reactions[emoji] = [];
        }
        if (!reactions[emoji].includes(user.uid)) {
            reactions[emoji].push(user.uid);
        }

        transaction.update(messageRef, { reactions });
    });
};

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !firestore || !matchDocRef) return;

    if (editingMessage) {
        // Handle editing
        const messageDocRef = doc(firestore, 'matches', chatId, 'messages', editingMessage.id);
        await updateDoc(messageDocRef, {
            text: newMessage,
            isEdited: true,
            updatedAt: serverTimestamp()
        });
        setEditingMessage(null);

    } else {
        // Handle sending new message
        const messagesRef = collection(firestore, 'matches', chatId, 'messages');
        await addDoc(messagesRef, {
            senderId: user.uid,
            text: newMessage,
            timestamp: serverTimestamp(),
            isAiGenerated: false,
            isRead: false,
        });
    }
      
    await updateDoc(matchDocRef, {
        lastMessage: newMessage,
        timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  const handleEditMessage = (message: Message) => {
      setEditingMessage(message);
      setNewMessage(message.text);
  }

  const handleDeleteMessage = async (messageId: string) => {
      if (!firestore || !chatId) return;
      const messageDocRef = doc(firestore, 'matches', chatId, 'messages', messageId);
      await deleteDoc(messageDocRef);
  }
  
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const isLoading = isUserLoading || isMatchLoading || areMessagesLoading || (matchData && !otherUser);

  if (isLoading) {
    return <ChatSkeleton />;
  }
  
  if (!user) {
     return (
        <div className="flex items-center justify-center h-full bg-zinc-900 text-white">
            <p>Yükleniyor... ID: {chatId}</p>
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
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
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
                     {formatLastSeen(otherUser.lastSeen, lastSeenLocale) === 'çevrimiçi' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                     )}
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold">{otherUser.name}</h2>
                    <p className={cn("text-xs font-medium", formatLastSeen(otherUser.lastSeen, lastSeenLocale) === 'çevrimiçi' ? 'text-green-400' : 'text-zinc-400')}>
                        {formatLastSeen(otherUser.lastSeen, lastSeenLocale)}
                    </p>
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
                <div className="space-y-1">
                {messages?.map((message) => (
                    <div
                        key={message.id}
                        className={cn("flex items-center w-full group py-1", message.senderId === user?.uid ? 'justify-end' : 'justify-start')}
                    >
                        <div className={cn("flex items-end gap-2", message.senderId === user?.uid ? 'flex-row-reverse' : 'flex-row')}>
                            <ReactionTooltip onReaction={(emoji) => handleReaction(message.id, emoji)}>
                                <div
                                    className={cn(
                                        "max-w-[70%] p-3 rounded-2xl flex flex-col relative",
                                        message.senderId === user?.uid
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-zinc-800 text-white rounded-bl-sm'
                                    )}
                                >
                                    <p className='break-words pr-12'>{message.text}</p>
                                    <div className="flex items-center justify-end gap-1.5 self-end mt-1 -mb-1">
                                        {message.isEdited && (
                                             <span className="text-xs text-primary-foreground/70 dark:text-zinc-400 italic mr-1">(düzenlendi)</span>
                                        )}
                                        <span className={cn("text-xs", message.senderId === user?.uid ? "text-primary-foreground/70" : "text-zinc-400")}>
                                            {formatMessageTimestamp(message.timestamp)}
                                        </span>
                                        {message.senderId === user?.uid && (
                                            <CheckCheck className={cn("w-4 h-4", message.isRead ? "text-blue-400" : "text-primary-foreground/70")} />
                                        )}
                                    </div>
                                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                                        <div className="absolute -bottom-4 right-0 flex items-center gap-1">
                                            {Object.entries(message.reactions).map(([emoji, users]) => (
                                                (users as string[]).length > 0 && (
                                                    <div key={emoji} className="flex items-center bg-zinc-700/80 backdrop-blur-sm rounded-full p-0.5 pr-1.5 border border-zinc-600">
                                                        <span className="text-xs">{emoji}</span>
                                                        {(users as string[]).length > 1 && <span className="text-xs font-bold text-zinc-300 ml-1">{(users as string[]).length}</span>}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ReactionTooltip>
                             {message.senderId === user?.uid && (
                                <MessageOptions onEdit={() => handleEditMessage(message)} onDelete={() => handleDeleteMessage(message.id)} />
                             )}
                        </div>
                    </div>
                ))}
                </div>
            </ScrollArea>

            <footer className="p-3 border-t border-white/10 bg-zinc-900/80 backdrop-blur-sm">
                {editingMessage && (
                     <div className="px-4 pb-2 text-sm flex justify-between items-center text-muted-foreground">
                        <span>
                            <span className="font-semibold text-primary">Düzenleniyor: </span>
                            <span className="italic">"{editingMessage.text.substring(0, 30)}..."</span>
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => { setEditingMessage(null); setNewMessage(''); }}>İptal</Button>
                    </div>
                )}
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
