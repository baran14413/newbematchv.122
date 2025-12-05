'use client';
import { conversations, profiles } from "@/lib/data";
import ChatArea from "@/components/lounge/chat-area";
import { notFound } from "next/navigation";
import { useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { UserProfile, Conversation } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const { conversationId } = params;
  const firestore = useFirestore();

  // This is a placeholder for how you might fetch conversation and match data.
  // In a real app, you'd fetch the conversation doc, get the other user's ID,
  // and then fetch that user's profile.
  const matchId = conversationId; // Assuming conversationId is the matchId for now

  // Let's assume the match document contains the user IDs.
  // This is a simplified example. You'd need a proper data model.
  const DUMMY_OTHER_USER_ID = "user-1"; // Replace with actual logic to get other user's ID from the match doc

  const matchProfileRef = useMemoFirebase(() => {
      if (!firestore || !DUMMY_OTHER_USER_ID) return null;
      return doc(firestore, 'users', DUMMY_OTHER_USER_ID);
  }, [firestore, DUMMY_OTHER_USER_ID]);

  const {data: matchProfile, isLoading: isProfileLoading} = useDoc<UserProfile>(matchProfileRef);
  
  // Dummy conversation data for layout purposes.
  // Replace with real message fetching from `/matches/{matchId}/messages`
  const selectedConversation: Conversation | undefined = undefined;

  if (isProfileLoading) {
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

  // You will replace this dummy conversation with real data from Firestore
  const dummyConversation: Conversation = {
    id: conversationId,
    userId: matchProfile.id,
    userName: matchProfile.name,
    avatarUrl: matchProfile.avatarUrl,
    lastMessage: '...',
    timestamp: '',
    unreadCount: 0,
    messages: [] // Fetch messages from the subcollection
  }

  return (
    <div className="h-full flex flex-col">
      <ChatArea conversation={dummyConversation} matchProfile={matchProfile} />
    </div>
  );
}
