'use client';

import { useEffect, useState, useRef } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
  endAt,
  type DocumentData,
  type Query,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type CollectionOptions = {
  where?: (string | any[])[];
  orderBy?: (string | 'asc' | 'desc')[];
  limit?: number;
  startAfter?: any;
  endBefore?: any;
  startAt?: any;
  endAt?: any;
  limitToLast?: number;
};

// Add a generic parameter for the document data type
export function useCollection<T extends DocumentData>(
  collectionName: string,
  options?: CollectionOptions,
) {
  const db = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    // Unsubscribe from the previous listener when the query changes
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      const collRef = collection(db, collectionName);
      let q: Query<DocumentData> = query(collRef);

      if (options) {
        if (options.where) {
          q = query(q, where.apply(null, options.where as any));
        }
        if (options.orderBy) {
          q = query(q, orderBy.apply(null, options.orderBy as any));
        }
        if (options.startAt) {
          q = query(q, startAt(options.startAt));
        }
        if (options.endAt) {
          q = query(q, endAt(options.endAt));
        }
        if (options.startAfter) {
          q = query(q, startAfter(options.startAfter));
        }
        if (options.endBefore) {
          q = query(q, endBefore(options.endBefore));
        }
        if (options.limit) {
          q = query(q, limit(options.limit));
        }
        if (options.limitToLast) {
          q = query(q, limitToLast(options.limitToLast));
        }
      }
      
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedData: T[] = [];
          querySnapshot.forEach((doc) => {
            fetchedData.push({ id: doc.id, ...doc.data() } as T);
          });
          setData(fetchedData);
          setLoading(false);
        },
        async (err) => {
          const permissionError = new FirestorePermissionError({
            path: q.toString(),
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(err);
          setLoading(false);
        },
      );
      unsubscribeRef.current = unsubscribe;
    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  }, [collectionName, db, options]);

  return { data, loading, error };
}
