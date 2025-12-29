"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface EmailLog {
    id: string;
    status: 'Sent' | 'Failed';
    recipient: string;
    subject: string;
    error?: string;
    sentAt: Timestamp;
}

export default function LogsPage() {
    const firestore = useFirestore();
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!firestore) return;

            setLoading(true);
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startOfToday = Timestamp.fromDate(today);

                const logsCollection = collection(firestore, 'email-logs');
                const q = query(
                    logsCollection,
                    where('sentAt', '>=', startOfToday),
                    orderBy('sentAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const fetchedLogs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as EmailLog));
                setLogs(fetchedLogs);
            } catch (error) {
                console.error("Error fetching logs: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [firestore]);

    return (
        <main className="min-h-screen w-full flex flex-col items-center bg-background p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-4xl">
                 <Link href="/" className="mb-4 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Email Activity</CardTitle>
                        <CardDescription>A log of all emails sent or attempted today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.length > 0 ? logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Badge variant={log.status === 'Sent' ? 'default' : 'destructive'}>
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="truncate max-w-[200px]">{log.recipient}</TableCell>
                                            <TableCell className="truncate max-w-[250px]">{log.subject}</TableCell>
                                            <TableCell>
                                                {log.sentAt ? format(log.sentAt.toDate(), 'h:mm:ss a') : 'N/A'}
                                            </TableCell>
                                            <TableCell className="truncate max-w-[300px]">{log.error || '-'}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                No email activity recorded today.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
