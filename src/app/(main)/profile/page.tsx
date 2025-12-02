'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  ChevronRight,
  Crown,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  SlidersHorizontal,
} from 'lucide-react';

export default function ProfilePage() {
  const profileCompletion = 75;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-black">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Progress
              value={profileCompletion}
              className="absolute -inset-2 w-[148px] h-[148px] [&>div]:bg-primary"
              style={
                {
                  clipPath: 'circle(50% at 50% 50%)',
                  transform: 'rotate(-90deg)',
                  '--tw-shadow': '0 0 15px hsl(var(--primary) / 0.5)',
                  filter: 'drop-shadow(var(--tw-shadow))',
                } as React.CSSProperties
              }
            />
            <Avatar className="w-36 h-36 border-4 border-background">
              <AvatarImage src="https://images.unsplash.com/photo-1607031542107-f6f46b5d54e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ2Njg4OTF8MA" alt="Alex" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <h1 className="text-3xl font-bold">Alex, 31</h1>
              <CheckCircle className="w-6 h-6 text-blue-500 fill-current" />
            </div>
            <Button variant="outline" className="mt-4 rounded-full border-primary/50 text-primary hover:bg-primary/5 hover:text-primary">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* BeMatch Gold Banner */}
        <Card className="overflow-hidden shadow-xl border-0">
            <div className="p-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600 text-black">
                 <CardContent className="p-0 flex items-center gap-6">
                    <Crown className="w-12 h-12" />
                    <div>
                        <h2 className="text-2xl font-bold">Get BeMatch Gold</h2>
                        <p className="font-medium">See who likes you & unlimited swipes!</p>
                    </div>
                </CardContent>
            </div>
        </Card>


        {/* Action Menu */}
        <Card className="shadow-lg">
          <CardContent className="p-2">
             <div className="flow-root">
              <div className="-my-2 divide-y divide-border">
                <MenuItem icon={Settings} text="Account Settings" />
                <MenuItem icon={SlidersHorizontal} text="Discovery Settings" />
                <MenuItem icon={Shield} text="Safety Center" />
                <MenuItem icon={HelpCircle} text="Help & Support" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

const MenuItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
  <button className="flex items-center justify-between w-full p-4 text-left hover:bg-secondary/50 rounded-lg">
    <div className="flex items-center gap-4">
      <Icon className="w-6 h-6 text-primary" />
      <span className="font-semibold text-lg">{text}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-muted-foreground" />
  </button>
);
