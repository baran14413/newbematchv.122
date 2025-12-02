'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from 'lucide-react';
import PasswordStrength from '@/components/auth/password-strength';

export default function ChangePasswordPage() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8">
                <h1 className="text-3xl font-bold text-primary">Şifre Değiştir</h1>
                <p className="text-muted-foreground">Güvenliğin için yeni bir şifre belirle.</p>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardContent className="p-6 space-y-6">
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
                    </CardContent>
                </Card>
                <Button className="w-full md:w-auto">Şifreyi Değiştir</Button>
            </div>
        </div>
    );
}
