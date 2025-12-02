'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";

export default function DeleteAccountPage() {

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4">
                 <Link href="/settings" passHref>
                     <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-destructive">Hesabı Sil</h1>
                    <p className="text-muted-foreground">Bu işlem geri alınamaz. Lütfen dikkatli ol.</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card className="border-destructive">
                    <CardHeader>
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertTriangle className="w-6 h-6" />
                            <CardTitle>DİKKAT</CardTitle>
                        </div>
                        <CardDescription className="text-destructive/80">
                            Hesabını silmek üzeresin. Bu işlem tüm eşleşmelerini, sohbetlerini ve profil bilgilerini kalıcı olarak yok edecektir. Devam etmek istediğine eminsen, lütfen şifreni girerek onayla.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input id="password" type="password" placeholder="Onaylamak için şifrenizi girin" />
                        </div>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">Hesabımı Kalıcı Olarak Sil</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Emin misin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bu işlem kesinlikle geri alınamaz. Hesabın, eşleşmelerin ve tüm verilerin kalıcı olarak silinecek.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Evet, Hesabımı Sil</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
