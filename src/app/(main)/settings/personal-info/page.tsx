'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, MapPin, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center py-3">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
    </div>
);

const SessionItem = ({ icon: Icon, device, location, time }: { icon: React.ElementType, device: string, location: string, time: string }) => (
    <div className="flex items-center gap-4 py-3">
        <Icon className="w-8 h-8 text-primary" />
        <div className="flex-1">
            <p className="font-semibold">{device}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <p className="text-sm text-muted-foreground">{time}</p>
    </div>
);

export default function PersonalInfoPage() {
    const { t } = useLanguage();
    // Örnek veriler
    const userInfo = {
        firstName: "Alex",
        lastName: "Doe",
        age: 31,
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
                    <h1 className="text-3xl font-bold text-primary">{t('personalInfoPage.title')}</h1>
                    <p className="text-muted-foreground">{t('personalInfoPage.description')}</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('personalInfoPage.profileDetails')}</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <InfoItem label={t('personalInfoPage.firstName')} value={userInfo.firstName} />
                        <InfoItem label={t('personalInfoPage.lastName')} value={userInfo.lastName} />
                        <InfoItem label={t('personalInfoPage.age')} value={userInfo.age.toString()} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('personalInfoPage.sessionActivity')}</CardTitle>
                        <CardDescription>{t('personalInfoPage.sessionDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <SessionItem icon={Smartphone} device="iPhone 15 Pro" location="İstanbul, TR" time={t('personalInfoPage.activeNow')} />
                        <SessionItem icon={Monitor} device="Chrome - macOS" location="Ankara, TR" time={`2 ${t('common.daysAgo')}`} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
