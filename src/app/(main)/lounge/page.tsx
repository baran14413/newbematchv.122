'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations, profiles } from "@/lib/data";
import ChatArea from "@/components/lounge/chat-area";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export default function LoungePage() {
  const selectedConversation = conversations[0];
  const matchProfile = profiles.find(p => p.id === selectedConversation.userId);
  const { t } = useLanguage();

  return (
    <div className="h-full md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] bg-background text-foreground">
      {/* Conversation List */}
      <div className="border-r border-border flex flex-col h-full">
          <header className="p-4 border-b">
            <h1 className="text-2xl font-bold text-foreground">{t('lounge.conversations')}</h1>
          </header>
          <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {conversations.map((convo) => (
                    <div key={convo.id} className={cn(
                        "p-3 flex items-center gap-4 cursor-pointer rounded-full border-2 border-transparent",
                        "hover:bg-secondary/50 transition-colors duration-200",
                         convo.id === selectedConversation.id ? 'bg-primary/20 border-primary' : 'bg-secondary'
                    )}>
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={convo.avatarUrl} alt={convo.userName} />
                            <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-md truncate">{convo.userName}</p>
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1.5 text-xs text-muted-foreground ml-2">
                            <span className={cn("whitespace-nowrap", convo.unreadCount > 0 ? "text-primary font-semibold" : "")}>{convo.timestamp}</span>
                            {convo.unreadCount > 0 && (
                                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                                    {convo.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
              </div>
          </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col h-full">
          {matchProfile && <ChatArea conversation={selectedConversation} matchProfile={matchProfile} />}
      </div>
    </div>
  );
}
