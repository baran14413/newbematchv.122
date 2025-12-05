'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations } from "@/lib/data";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LoungePage() {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Conversation List */}
      <div className="flex flex-col h-full">
          <header className="p-4 border-b">
            <h1 className="text-2xl font-bold text-foreground">{t('lounge.conversations')}</h1>
          </header>
          <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2 p-2">
                {conversations.map((convo) => (
                    <Link href={`/lounge/${convo.id}`} key={convo.id}>
                        <div className={cn(
                            "px-3 py-2 flex items-center gap-3 cursor-pointer rounded-lg border-2 border-transparent",
                            "hover:bg-secondary/50 transition-colors duration-200"
                        )}>
                            <Avatar className="h-12 w-12">
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
                    </Link>
                ))}
              </div>
          </ScrollArea>
      </div>
    </div>
  );
}
