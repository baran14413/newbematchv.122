'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dummy data for demonstration purposes
const dummyMessages = [
    { id: 1, text: "Selam! Profilin gerçekten ilgimi çekti.", sender: 'them' },
    { id: 2, text: "Merhaba! Teşekkür ederim, senin de öyle.", sender: 'me' },
    { id: 3, text: "Hafta sonu ne yapıyorsun? Belki bir kahve içeriz?", sender: 'them' },
    { id: 4, text: "Harika fikir! Cumartesi günü uygunum.", sender: 'me' },
];

const dummyUser = {
    name: 'Elif',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHNtaWxpbmd8ZW58MHx8fHwxNzY0NzA1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
};

export default function ChatPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const [messages, setMessages] = useState(dummyMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'me' }]);
            setNewMessage('');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-black text-white">
            {/* Header */}
            <header className="flex items-center gap-4 p-3 border-b border-gray-800 sticky top-0 bg-black z-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <Avatar className="h-10 w-10">
                    <AvatarImage src={dummyUser.avatarUrl} alt={dummyUser.name} />
                    <AvatarFallback>{dummyUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{dummyUser.name}</h2>
                </div>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-end gap-2",
                            message.sender === 'me' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-md p-3 rounded-2xl flex flex-col",
                                message.sender === 'me'
                                    ? 'bg-rose-600 text-white rounded-br-none'
                                    : 'bg-gray-800 text-white rounded-bl-none'
                            )}
                        >
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <footer className="p-2 border-t border-gray-800 sticky bottom-0 bg-black">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        placeholder="Bir mesaj yaz..."
                        className="flex-1 bg-gray-900 border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 rounded-full px-5 text-base"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" variant="ghost" className="text-rose-500 w-10 h-10 rounded-full">
                        <Send className="w-6 h-6" />
                    </Button>
                </form>
            </footer>
        </div>
    );
}
