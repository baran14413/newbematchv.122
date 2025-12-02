'use client';
import { Flame, MessagesSquare, UserCircle, Settings, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
    { href: '/discover', icon: Flame, label: 'Keşfet' },
    { href: '/lounge', icon: MessagesSquare, label: 'Sohbet' },
    { href: '/profile', icon: UserCircle, label: 'Profil' },
]

export default function MainHeader() {
    const pathname = usePathname();
    
    return (
        <header className="flex items-center justify-between p-4 h-16 border-b border-border bg-background z-10">
            <Link href="/discover">
                <h1 className="text-2xl font-bold text-primary tracking-tight">BeMatch</h1>
            </Link>
            <div className="flex items-center gap-4">
                {navLinks.map(link => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Button key={link.href} variant="ghost" size="icon" asChild>
                            <Link href={link.href} aria-label={link.label}>
                                <link.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-muted-foreground")} />
                            </Link>
                        </Button>
                    )
                })}
                <Link href="/settings" passHref>
                    <Button variant="ghost" size="icon" aria-label="Ayarlar">
                        <Settings className={cn("w-6 h-6", pathname === '/settings' ? "text-primary" : "text-muted-foreground")} />
                    </Button>
                </Link>
            </div>
        </header>
    )
}
