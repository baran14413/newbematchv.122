'use client';
import { useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * A client component that listens for Firebase permission errors and displays a toast notification.
 * This is useful for debugging Firestore security rules.
 *
 * This can be used in a layout component to catch errors from any page.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error) => {
      console.error('Caught permission error:', error);
      toast({
        title: 'Firestore Permission Error',
        description: error.message,
        variant: 'destructive',
        duration: 20000,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return null;
}
