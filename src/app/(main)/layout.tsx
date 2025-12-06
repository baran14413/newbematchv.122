'use client';

import MainHeader from '@/components/main-header';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  // Update user's lastSeen timestamp on activity
  useEffect(() => {
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      const updateLastSeen = () => {
        updateDoc(userRef, { lastSeen: serverTimestamp() });
      };

      // Update on initial load
      updateLastSeen();

      // Update when window gains focus
      window.addEventListener('focus', updateLastSeen);

      return () => {
        window.removeEventListener('focus', updateLastSeen);
      };
    }
  }, [user, firestore]);

  const isChatPage = pathname.startsWith('/chat');

  return (
    <div className="flex flex-col h-screen bg-background">
      {!isChatPage && <MainHeader />}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
