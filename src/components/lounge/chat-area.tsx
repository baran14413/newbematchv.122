'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import type { Conversation, UserProfile } from "@/lib/data";
import { Button } from "../ui/button";
import { Send, Plus, Mic, Video, Phone, CheckCheck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import VoiceNotePlayer from "./voice-note-player";


export default function ChatArea({ conversation, matchProfile }: { conversation: Conversation; matchProfile: UserProfile }) {
  const isTyping = true; // Dummy data for typing indicator

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-3 border-b bg-card">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} />
          <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">{conversation.userName}</h2>
          <p className="text-sm text-green-400">{isTyping ? "Typing..." : "Online"}</p>
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

      {/* Message Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex items-end gap-2", message.sender === 'me' ? 'justify-end' : 'justify-start')}
            >
              {message.sender === 'them' && (
                <Avatar className="h-8 w-8 self-end">
                  <AvatarImage src={conversation.avatarUrl} alt={conversation.userName} />
                  <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
               <div
                className={cn(
                    "max-w-md p-3 rounded-2xl flex flex-col",
                    message.sender === 'me'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                )}
              >
                {message.type === 'image' && message.imageUrl && (
                    <div className="relative w-64 h-40 mb-2 rounded-lg overflow-hidden">
                        <Image src={message.imageUrl} alt="photo message" fill className="object-cover" />
                    </div>
                )}
                 {message.type === 'voice' && message.audioUrl && (
                    <VoiceNotePlayer src={message.audioUrl} />
                )}
                <p>{message.text}</p>
                 {message.sender === 'me' && (
                    <div className="flex items-center justify-end gap-1.5 self-end mt-1">
                        <span className="text-xs text-primary-foreground/70">{message.timestamp}</span>
                        <CheckCheck className="w-4 h-4 text-blue-400" />
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <footer className="p-2 border-t bg-card">
        <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-muted-foreground">
                <Plus className="w-6 h-6" />
            </Button>
            <Input
                placeholder="Message..."
                className="flex-1 bg-secondary border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
            />
            <Button size="icon" variant="ghost" className="text-muted-foreground">
                <Mic className="w-6 h-6" />
            </Button>
        </div>
      </footer>
    </div>
  );
}
