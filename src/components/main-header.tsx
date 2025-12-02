'use client';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';

export default function MainHeader() {
    return (
        <header className="flex items-center justify-between p-4 h-16 border-b border-border bg-background">
            <div className="w-10"></div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">BeMatch</h1>
            <Button variant="ghost" size="icon">
                <Filter className="w-6 h-6 text-muted-foreground"/>
            </Button>
        </header>
    )
}
