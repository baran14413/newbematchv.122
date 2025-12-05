'use client';
import { useEffect, useState, useRef } from 'react';
import {
  doc,
  onSnapshot,
  DocumentReference,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useDoc<T extends DocumentData>(
  docRef: DocumentReference<T> | undefined,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const db = useFirestore();

  useEffect(() => {
    // Unsubscribe from the previous listener when the docRef changes
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    if (!docRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      },
    );

    unsubscribeRef.current = unsubscribe;
  }, [docRef]);

  return { data, loading, error };
}
