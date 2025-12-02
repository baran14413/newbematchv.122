'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Heart, LogOut, MapPin, ShieldCheck, SlidersHorizontal, Smartphone, User, Wallet, KeyRound, Trash2 } from "lucide-react";
import Link from "next/link";

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h2 className="px-4 text-lg font-semibold text-muted-foreground">{title}</h2>
        <Card className="shadow-none border-0 md:border md:shadow-sm">
            <CardContent className="p-0">
                <ul className="divide-y">
                    {children}
                </ul>
            </CardContent>
        </Card>
    </div>
);

const SettingsItem = ({ icon: Icon, label, href = "#" }: { icon: React.ElementType, label: string, href?: string }) => (
    <li className="list-none">
        <Link href={href} passHref>
            <div className="flex items-center p-4 hover:bg-secondary cursor-pointer">
                <div className="w-10 h-10 mr-4 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="flex-1 font-medium">{label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
        </Link>
    </li>
);

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
        <header className="p-4 py-6 md:p-8">
            <h1 className="text-3xl font-bold text-primary">Ayarlar</h1>
            <p className="text-muted-foreground">Hesabını ve tercihlerini yönet.</p>
        </header>

        <div className="md:p-8 md:pt-0 space-y-8">
            <SettingsSection title="Hesap Ayarları">
                <SettingsItem icon={User} label="Kişisel Bilgiler" href="/settings/personal-info" />
                <SettingsItem icon={Wallet} label="Cüzdanım" href="/settings/wallet"/>
                <SettingsItem icon={Heart} label="İlgi Alanlarını Düzenle" href="/settings/interests" />
            </SettingsSection>

            <SettingsSection title="Keşfet Ayarları">
                <SettingsItem icon={MapPin} label="Konum" href="/settings/location"/>
                <SettingsItem icon={SlidersHorizontal} label="Tercihler" href="/settings/preferences"/>
            </SettingsSection>

             <SettingsSection title="Uygulama Ayarları">
                <SettingsItem icon={Smartphone} label="Uygulama" href="/settings/application"/>
            </SettingsSection>

            <SettingsSection title="Gizlilik ve Güvenlik">
                <SettingsItem icon={KeyRound} label="Şifre Değiştir" href="/settings/change-password" />
                <SettingsItem icon={Trash2} label="Hesabı Sil" href="/settings/delete-account" />
            </SettingsSection>

            <SettingsSection title="Oturum">
                <SettingsItem icon={LogOut} label="Çıkış Yap" />
            </SettingsSection>
        </div>
    </div>
  );
}
