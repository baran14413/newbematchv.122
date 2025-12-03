'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { conversations, newMatches, profiles } from "@/lib/data";
import ChatArea from "@/components/lounge/chat-area";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export default function LoungePage() {
  const selectedConversation = conversations[0];
  const matchProfile = profiles.find(p => p.id === selectedConversation.userId);
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-foreground">{t('lounge.title')}</h1>
      </header>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">{t('lounge.newMatches')}</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {newMatches.map((match) => (
              <div key={match.id} className="flex flex-col items-center space-y-2 w-20 cursor-pointer">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={match.avatarUrl} alt={match.name} />
                    <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs text-center truncate w-full text-muted-foreground">{match.name}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator />
      <div className="flex-1 grid md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
        <div className="md:col-span-1 lg:col-span-1 border-r border-border flex flex-col">
            <h2 className="text-lg font-semibold p-4">{t('lounge.conversations')}</h2>
            <ScrollArea className="flex-1">
                {conversations.map((convo) => (
                    <div key={convo.id} className={cn(
                        "p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/50",
                        convo.id === selectedConversation.id ? 'bg-secondary' : ''
                    )}>
                        <div className="relative">
                            <Avatar className="h-14 w-14">
                                <AvatarImage src={convo.avatarUrl} alt={convo.userName} />
                                <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                        </div>
                        <div className="flex-1 truncate">
                            <p className="font-semibold text-foreground">{convo.userName}</p>
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                            <span>{convo.timestamp}</span>
                            {convo.unreadCount > 0 && (
                                <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                                    {convo.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
        <div className="md:col-span-2 lg:col-span-3 hidden md:flex flex-col h-full">
            {matchProfile && <ChatArea conversation={selectedConversation} matchProfile={matchProfile} />}
        </div>
      </div>
    </div>
  );
}
