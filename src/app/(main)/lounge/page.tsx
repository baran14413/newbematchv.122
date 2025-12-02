import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { conversations, newMatches, profiles } from "@/lib/data";
import ChatArea from "@/components/lounge/chat-area";

export default function LoungePage() {
  const selectedConversation = conversations[0];
  const matchProfile = profiles.find(p => p.id === selectedConversation.userId);

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Sohbet</h1>
      </header>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Yeni Eşleşmeler</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {newMatches.map((match) => (
              <div key={match.id} className="flex flex-col items-center space-y-2 w-20">
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                  <AvatarImage src={match.avatarUrl} alt={match.name} />
                  <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-center truncate w-full">{match.name}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator />
      <div className="flex-1 grid md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
        <div className="md:col-span-1 lg:col-span-1 border-r border-border flex flex-col">
            <h2 className="text-lg font-semibold p-4">Sohbetler</h2>
            <ScrollArea className="flex-1">
                {conversations.map((convo) => (
                    <div key={convo.id} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary ${convo.id === selectedConversation.id ? 'bg-secondary' : ''}`}>
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={convo.avatarUrl} alt={convo.userName} />
                            <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 truncate">
                            <p className="font-semibold">{convo.userName}</p>
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">{convo.timestamp}</div>
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
