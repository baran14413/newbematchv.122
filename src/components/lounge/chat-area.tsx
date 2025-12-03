'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Conversation, UserProfile } from "@/lib/data";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import AiIcebreaker from "./ai-icebreaker";
import { useLanguage } from "@/context/language-context";

export default function ChatArea({ conversation, matchProfile }: { conversation: Conversation; matchProfile: UserProfile }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <Avatar>
          <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} />
          <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{conversation.userName}</h2>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'them' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} />
                  <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                  message.sender === 'me'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t border-border">
        <div className="relative">
          <Textarea
            placeholder={t('lounge.chatInputPlaceholder')}
            className="pr-24 min-h-[50px]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <AiIcebreaker matchProfile={matchProfile} />
            <Button size="icon" className="w-9 h-9">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
