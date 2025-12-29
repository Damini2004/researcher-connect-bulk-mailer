"use client";

import { useState, useEffect, useMemo } from "react";
import {
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { useFirestore } from "../provider";

export function useCollection<T>(path: string) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firestore) {
      const collectionRef = collection(firestore, path);
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const data: T[] = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );
        setData(data);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [firestore, path]);

  return { data, loading };
}
