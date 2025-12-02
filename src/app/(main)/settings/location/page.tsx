'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LocationPage() {
    const [currentLocation, setCurrentLocation] = useState("İstanbul, TR");
    const { toast } = useToast();

    const handleUpdateLocation = () => {
        // Mock function for location update
        toast({
            title: "Konum Güncellendi!",
            description: "Yeni konumun başarıyla ayarlandı.",
        });
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4">
                <Link href="/settings" passHref>
                     <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">Konum</h1>
                    <p className="text-muted-foreground">Eşleşme önerileri için konumunu yönet.</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Mevcut Konum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                            <MapPin className="w-6 h-6 text-primary" />
                            <p className="text-lg font-semibold">{currentLocation}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            BeMatch, sana daha iyi öneriler sunmak için cihazının konumunu kullanır. Konumunu sadece eşleşme potansiyeli olan kişilere yaklaşık bir mesafede göstermek için kullanırız.
                        </p>
                        <Button onClick={handleUpdateLocation} className="w-full md:w-auto">
                            Konumu Güncelle
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
