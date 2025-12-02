'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Bot } from 'lucide-react';
import Link from 'next/link';

export default function AuthCard() {
  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-2xl border-white/10 shadow-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold font-headline text-primary">Nexus</CardTitle>
        <CardDescription className="text-foreground/80">
          Sign in to connect with your universe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-2 bg-black/20">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="astronaut@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="phone" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
          <Link href="/discover">Enter the Nexus</Link>
        </Button>
         <Button variant="outline" className="w-full border-accent/50 text-accent hover:bg-accent/10 hover:text-accent">
            <Bot className="mr-2 h-4 w-4" />
            Continue as Guest
          </Button>
      </CardFooter>
    </Card>
  );
}
