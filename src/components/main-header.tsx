'use client';
import { Flame, MessagesSquare, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function MainHeader() {
    return (
        <header className="flex items-center justify-between p-4 h-16 border-b border-border bg-background z-10">
            <Link href="/discover">
                <h1 className="text-2xl font-bold text-primary tracking-tight">BeMatch</h1>
            </Link>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/likes">
                        <Flame className="w-6 h-6 text-muted-foreground"/>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/lounge">
                        <MessagesSquare className="w-6 h-6 text-muted-foreground"/>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/profile">
                        <UserCircle className="w-6 h-6 text-muted-foreground"/>
                    </Link>
                </Button>
            </div>
        </header>
    )
}
