'use client';
import { conversations, profiles } from "@/lib/data";
import ChatArea from "@/components/lounge/chat-area";
import { notFound } from "next/navigation";

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const { conversationId } = params;
  const selectedConversation = conversations.find(c => c.id === conversationId);
  
  if (!selectedConversation) {
    notFound();
  }

  const matchProfile = profiles.find(p => p.id === selectedConversation.userId);

  if (!matchProfile) {
    notFound();
  }

  return (
    <div className="h-full flex flex-col">
      <ChatArea conversation={selectedConversation} matchProfile={matchProfile} />
    </div>
  );
}
