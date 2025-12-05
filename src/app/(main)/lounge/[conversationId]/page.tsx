'use client';
import { useUser, useDoc, useMemoFirebase, useFirestore, useCollection } from "@/firebase";
import ChatArea from "@/components/lounge/chat-area";
import { notFound, useParams } from "next/navigation";
import { collection, doc, query } from "firebase/firestore";
import type { UserProfile, Conversation, Message } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ConversationPage() {
  const { user } = useUser();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const firestore = useFirestore();
  
  // Extract the other user's ID from the conversationId
  const otherUserId = conversationId.split('_').find(id => id !== user?.uid);

  // Fetch the other user's profile
  const matchProfileRef = useMemoFirebase(() => {
      if (!firestore || !otherUserId) return null;
      return doc(firestore, 'users', otherUserId);
  }, [firestore, otherUserId]);
  const { data: matchProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(matchProfileRef);

  // Fetch messages for this conversation
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'matches', conversationId, 'messages'));
  }, [firestore, conversationId]);
  const { data: messages, isLoading: areMessagesLoading } = useCollection<Message>(messagesQuery);


  if (isProfileLoading || areMessagesLoading) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-4 p-3 border-b bg-background">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
           <div className="flex-1 p-4 space-y-6">
              <div className="flex justify-end gap-2">
                  <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
               <div className="flex justify-start gap-2">
                   <Skeleton className="h-8 w-8 rounded-full" />
                   <Skeleton className="h-12 w-64 rounded-2xl" />
               </div>
           </div>
           <div className="p-2 border-t bg-background">
                <Skeleton className="h-11 w-full rounded-full" />
           </div>
        </div>
      )
  }

  if (!matchProfile) {
    notFound();
  }

  // Combine data into the Conversation format expected by ChatArea
  const selectedConversation: Conversation = {
    id: conversationId,
    userId: matchProfile.id,
    userName: matchProfile.name,
    avatarUrl: matchProfile.avatarUrl,
    lastMessage: messages?.[messages.length - 1]?.text || '...',
    timestamp: '', // You can format the last message's timestamp here
    unreadCount: 0,
    messages: messages || [], // Pass the fetched messages
  };

  return (
    <div className="h-full flex flex-col">
      <ChatArea conversation={selectedConversation} matchProfile={matchProfile} />
    </div>
  );
}
