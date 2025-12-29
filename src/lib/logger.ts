"use server";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

type LogEntry = {
    status: 'Sent' | 'Failed';
    recipient: string;
    subject: string;
    error?: string;
};

export async function logEmailActivity(entry: LogEntry) {
    try {
        const { firestore } = initializeFirebase();
        if (!firestore) {
            throw new Error("Firestore is not initialized.");
        }
        const logCollection = collection(firestore, 'email-logs');
        await addDoc(logCollection, {
            ...entry,
            sentAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Failed to log email activity:", error);
        // We log the error to the console but don't re-throw,
        // as failing to log shouldn't prevent the app from functioning.
    }
}
