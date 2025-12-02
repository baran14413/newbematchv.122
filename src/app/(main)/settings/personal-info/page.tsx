'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Monitor, MapPin } from "lucide-react";

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
    // Örnek veriler
    const userInfo = {
        firstName: "Alex",
        lastName: "Doe",
        age: 31,
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8">
                <h1 className="text-3xl font-bold text-primary">Kişisel Bilgiler</h1>
                <p className="text-muted-foreground">Bu bilgiler profilinde görünür ve düzenlenemez.</p>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <InfoItem label="Ad" value={userInfo.firstName} />
                        <InfoItem label="Soyad" value={userInfo.lastName} />
                        <InfoItem label="Yaş" value={userInfo.age.toString()} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Oturum Hareketleri</CardTitle>
                        <CardDescription>Aktif oturumlarını ve giriş yaptığın cihazları gör.</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y">
                        <SessionItem icon={Smartphone} device="iPhone 15 Pro" location="İstanbul, TR" time="Şimdi aktif" />
                        <SessionItem icon={Monitor} device="Chrome - macOS" location="Ankara, TR" time="2 gün önce" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
