'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, AlertTriangle } from 'lucide-react';
import PasswordStrength from '@/components/auth/password-strength';
import Link from 'next/link';
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

export default function SecurityPage() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4 border-b mb-8">
                <Link href="/settings" passHref>
                     <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">Gizlilik ve Güvenlik</h1>
                    <p className="text-muted-foreground">Şifreni değiştir veya hesabını yönet.</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-12">
                {/* Şifre Değiştirme Bölümü */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Şifre Değiştir</CardTitle>
                            <CardDescription>Güvenliğin için yeni bir şifre belirle.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 relative">
                                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                                <Input id="currentPassword" type={showCurrent ? 'text' : 'password'} placeholder="Mevcut şifreniz" />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="newPassword">Yeni Şifre</Label>
                                <Input id="newPassword" type={showNew ? 'text' : 'password'} placeholder="Yeni bir şifre oluşturun" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                 <Button type="button" variant="ghost" size="icon" className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowNew(!showNew)}>
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <PasswordStrength password={newPassword} />
                            </div>
                            <div className="space-y-2 relative">
                                <Label htmlFor="confirmPassword">Yeni Şifreyi Onayla</Label>
                                <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Yeni şifrenizi doğrulayın" />
                                 <Button type="button" variant="ghost" size="icon" className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Button>Şifreyi Değiştir</Button>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Hesabı Silme Bölümü */}
                <div className="space-y-4">
                    <Card className="border-destructive">
                        <CardHeader>
                            <div className="flex items-center gap-3 text-destructive">
                                <AlertTriangle className="w-6 h-6" />
                                <CardTitle>Hesabı Kalıcı Olarak Sil</CardTitle>
                            </div>
                            <CardDescription className="text-destructive/80">
                                Bu işlem geri alınamaz. Hesabını silmek tüm eşleşmelerini, sohbetlerini ve profil bilgilerini kalıcı olarak yok edecektir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Devam etmek istediğine eminsen, lütfen aşağıdaki butona tıkla.</p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">Hesabımı Silme İşlemini Başlat</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Hesabını Silmek Üzeresin. Emin misin?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bu işlem kesinlikle geri alınamaz. Onaylamak için lütfen şifreni gir.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-2 py-4">
                                        <Label htmlFor="password-confirm" className="sr-only">Şifre</Label>
                                        <Input id="password-confirm" type="password" placeholder="Onaylamak için şifrenizi girin" />
                                    </div>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Evet, Hesabımı Kalıcı Olarak Sil</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
