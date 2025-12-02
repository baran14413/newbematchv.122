'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApplicationSettingsPage() {
    const { toast } = useToast();

    const handleClearCache = () => {
        toast({
            title: "Önbellek Temizlendi",
            description: "Uygulama verileri ve önbellek başarıyla temizlendi.",
        });
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8">
                <h1 className="text-3xl font-bold text-primary">Uygulama Ayarları</h1>
                <p className="text-muted-foreground">Uygulama verilerini ve ayarlarını yönet.</p>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Veri Yönetimi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Önbelleği Temizle</p>
                                <p className="text-sm text-muted-foreground">Uygulama performansını artırmak için geçici verileri sil.</p>
                            </div>
                            <Button variant="destructive" onClick={handleClearCache}>
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
