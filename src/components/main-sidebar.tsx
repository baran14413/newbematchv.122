'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Flame, MessagesSquare, UserCircle, Settings, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { placeholderImages } from '@/lib/data';

const navItems = [
  { href: '/discover', icon: Flame, label: 'Discover' },
  { href: '/lounge', icon: MessagesSquare, label: 'Lounge' },
  { href: '/profile', icon: UserCircle, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function MainSidebar() {
  const pathname = usePathname();
  const userAvatar = placeholderImages.find(p => p.id === 'user-2-avatar');


  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="items-center justify-center p-4">
        <Heart className="w-8 h-8 text-primary group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6 transition-all" />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label, side:"right" }}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-primary/10"
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 items-center justify-center">
         <Avatar className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 transition-all">
          {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </SidebarFooter>
    </Sidebar>
  );
}
