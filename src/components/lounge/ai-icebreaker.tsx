'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/data';
import { generateAiIcebreaker } from '@/app/actions';

export default function AiIcebreaker({ matchProfile }: { matchProfile: UserProfile }) {
  const [isPending, startTransition] = useTransition();
  const [icebreaker, setIcebreaker] = useState<string>('');
  const { toast } = useToast();

  const handleGenerate = () => {
    startTransition(async () => {
      const profileString = `Name: ${matchProfile.name}, Age: ${matchProfile.age}, Bio: ${matchProfile.bio}, Prompts: ${matchProfile.prompts.map(p => `${p.question} ${p.answer}`).join(', ')}`;

      try {
        const result = await generateAiIcebreaker({ matchProfile: profileString });
        if (result.icebreaker) {
          setIcebreaker(result.icebreaker);
        } else {
            throw new Error("Couldn't generate an icebreaker.");
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate an AI icebreaker. Please try again.',
        });
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 text-primary hover:text-primary">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
          <span className="sr-only">Generate AI Icebreaker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Icebreaker</h4>
            <p className="text-sm text-muted-foreground">
              Let AI help you start the conversation.
            </p>
          </div>
          {icebreaker && (
            <div className="p-2 bg-secondary rounded-md">
              <p className="text-sm">{icebreaker}</p>
            </div>
          )}
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate new idea'
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
