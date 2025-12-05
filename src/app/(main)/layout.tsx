'use client';

import MainHeader from '@/components/main-header';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Chat page is now full-screen and won't have the main header.
  // We determine this by checking if the path starts with /chat
  const isChatPage = pathname.startsWith('/chat');

  return (
    <div className="flex flex-col h-screen bg-background">
      {!isChatPage && <MainHeader />}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
