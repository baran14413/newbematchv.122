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
    <div className="h-full flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 bg-background text-foreground overflow-hidden">
      {/* Conversation List */}
      <div className="md:col-span-1 lg:col-span-1 border-r border-border flex flex-col h-full">
          <header className="p-4 border-b">
            <h1 className="text-2xl font-bold text-foreground">{t('lounge.conversations')}</h1>
          </header>
          <ScrollArea className="flex-1">
              {conversations.map((convo) => (
                  <div key={convo.id} className={cn(
                      "p-4 flex items-center gap-4 cursor-pointer border-l-4",
                      "hover:bg-secondary/50 transition-colors duration-200",
                      convo.id === selectedConversation.id ? 'bg-secondary border-primary' : 'border-transparent'
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
                              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                                  {convo.unreadCount}
                              </span>
                          )}
                      </div>
                  </div>
              ))}
          </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="md:col-span-2 lg:col-span-3 hidden md:flex flex-col h-full">
          {matchProfile && <ChatArea conversation={selectedConversation} matchProfile={matchProfile} />}
      </div>
    </div>
  );
}
