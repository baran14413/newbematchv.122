'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = initializeFirebase();

  return <FirebaseProvider value={value}>{children}</FirebaseProvider>;
}
