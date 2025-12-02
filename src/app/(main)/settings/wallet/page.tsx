'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Star, Gem, ArrowLeft } from "lucide-react";
import Link from 'next/link';

const InfoCard = ({ icon: Icon, title, value, actionText, onActionClick }: { icon: React.ElementType, title: string, value: string, actionText: string, onActionClick?: () => void }) => (
    <Card className="text-center">
        <CardHeader className="items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Icon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-4xl font-bold">{value}</p>
            <Button onClick={onActionClick} variant="secondary" className="w-full">{actionText}</Button>
        </CardContent>
    </Card>
);

export default function WalletPage() {
    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4">
                <Link href="/settings" passHref>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">Cüzdanım</h1>
                    <p className="text-muted-foreground">Aboneliklerini ve jetonlarını yönet.</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card className="overflow-hidden shadow-lg border-0">
                    <div className="p-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 dark:from-yellow-500 dark:via-amber-500 dark:to-orange-600 text-black">
                        <CardHeader className="p-0 mb-4">
                            <div className="flex items-center gap-3">
                                <Crown className="w-8 h-8" />
                                <CardTitle className="text-2xl text-black">BeMatch Gold</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="font-medium">Bir sonraki fatura tarihiniz: <span className="font-bold">24 Temmuz 2024</span></p>
                            <Button variant="outline" className="mt-4 bg-transparent border-black text-black hover:bg-black/10">Aboneliği Yönet</Button>
                        </CardContent>
                    </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard
                        icon={Star}
                        title="Süper Beğeni"
                        value="3"
                        actionText="Daha Fazla Al"
                    />
                    <InfoCard
                        icon={Gem}
                        title="Jetonlar"
                        value="150"
                        actionText="Jeton Yükle"
                    />
                </div>
            </div>
        </div>
    );
}
