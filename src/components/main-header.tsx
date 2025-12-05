'use client';
import { Flame, MessagesSquare, UserCircle, Heart, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

const MainHeader = () => {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navLinks = [
        { href: '/discover', icon: Flame, label: t('discover.title') },
        { href: '/likes', icon: Heart, label: t('likes.title') },
        { href: '/lounge', icon: MessagesSquare, label: t('lounge.title') },
        { href: '/profile', icon: UserCircle, label: t('profile.title') },
    ];
    
    return (
        <header className={cn("flex items-center justify-between px-4 py-2 h-14 border-b border-border bg-background z-10", "pt-[env(safe-area-inset-top)]")}>
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
            </div>
        </header>
    )
}

export default MainHeader;
