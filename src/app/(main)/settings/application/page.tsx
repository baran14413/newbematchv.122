'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Monitor, Sun, Moon, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function ApplicationSettingsPage() {
    const { toast } = useToast();
    const { setTheme, theme } = useTheme();

    const handleClearCache = () => {
        toast({
            title: "Önbellek Temizlendi",
            description: "Uygulama verileri ve önbellek başarıyla temizlendi.",
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
                    <h1 className="text-3xl font-bold text-primary">Uygulama Ayarları</h1>
                    <p className="text-muted-foreground">Uygulama verilerini ve ayarlarını yönet.</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Görünüm</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 pr-4">
                                <p className="font-medium">Tema</p>
                                <p className="text-sm text-muted-foreground">Uygulama genelinde kullanılacak temayı seçin.</p>
                            </div>
                            <Select onValueChange={setTheme} defaultValue={theme}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Tema Seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">
                                        <div className="flex items-center gap-2">
                                            <Sun className="w-4 h-4" /> Aydınlık
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="dark">
                                        <div className="flex items-center gap-2">
                                            <Moon className="w-4 h-4" /> Karanlık
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="system">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-4 h-4" /> Sistem
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                         <div className="flex items-center justify-between">
                            <div className="flex-1 pr-4">
                                <p className="font-medium">Dil</p>
                                <p className="text-sm text-muted-foreground">Uygulamanın dilini seçin.</p>
                            </div>
                            <Select defaultValue="tr">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Dil Seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tr">
                                        <div className="flex items-center gap-2">
                                            🇹🇷 Türkçe
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="en">
                                        <div className="flex items-center gap-2">
                                            🇬🇧 English
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Veri Yönetimi</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                                <p className="font-medium">Önbelleği Temizle</p>
                                <p className="text-sm text-muted-foreground">Uygulama performansını artırmak için geçici verileri sil.</p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={handleClearCache} className="mt-1">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Temizle
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
