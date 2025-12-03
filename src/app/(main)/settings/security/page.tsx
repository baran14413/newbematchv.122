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
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/context/language-context';

export default function SecurityPage() {
    const { t } = useLanguage();

    const deletionReasons = [
        { id: 'privacy', label: t('securityPage.deletionReasons.privacy') },
        { id: 'matches', label: t('securityPage.deletionReasons.matches') },
        { id: 'break', label: t('securityPage.deletionReasons.break') },
        { id: 'met_someone', label: t('securityPage.deletionReasons.met_someone') },
        { id: 'technical', label: t('securityPage.deletionReasons.technical') },
        { id: 'other', label: t('securityPage.deletionReasons.other') },
    ];

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [deleteStep, setDeleteStep] = useState(0);
    const [selectedReason, setSelectedReason] = useState('');


    const resetDeleteFlow = () => {
        setDeleteStep(0);
        setSelectedReason('');
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4 border-b mb-8">
                <Link href="/settings" passHref>
                     <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('securityPage.title')}</h1>
                    <p className="text-muted-foreground">{t('securityPage.description')}</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-12">
                {/* Şifre Değiştirme Bölümü */}
                <div className="space-y-4">
                    <Card>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-b-0">
                          <AccordionTrigger className="p-6 hover:no-underline">
                              <div className="text-left">
                                <h3 className="text-lg font-semibold">{t('securityPage.changePassword')}</h3>
                                <p className="text-sm text-muted-foreground">{t('securityPage.changePasswordDescription')}</p>
                              </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0">
                            <div className="space-y-6">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="currentPassword">{t('securityPage.currentPassword')}</Label>
                                    <Input id="currentPassword" type={showCurrent ? 'text' : 'password'} placeholder={t('securityPage.passwordHintCurrent')} />
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <div className="space-y-2 relative">
                                    <Label htmlFor="newPassword">{t('securityPage.newPassword')}</Label>
                                    <Input id="newPassword" type={showNew ? 'text' : 'password'} placeholder={t('securityPage.passwordHintNew')} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                     <Button type="button" variant="ghost" size="icon" className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowNew(!showNew)}>
                                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <PasswordStrength password={newPassword} />
                                </div>
                                <div className="space-y-2 relative">
                                    <Label htmlFor="confirmPassword">{t('securityPage.confirmNewPassword')}</Label>
                                    <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder={t('securityPage.passwordHintConfirm')} />
                                     <Button type="button" variant="ghost" size="icon" className="absolute right-2.5 top-8 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <Button>{t('securityPage.savePassword')}</Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                </div>
                
                {/* Hesabı Silme Bölümü */}
                <div className="space-y-4">
                    <Card className="border-destructive">
                        <CardHeader>
                            <div className="flex items-center gap-3 text-destructive">
                                <AlertTriangle className="w-6 h-6" />
                                <CardTitle>{t('securityPage.deleteAccountTitle')}</CardTitle>
                            </div>
                            <CardDescription className="text-destructive/80">
                                {t('securityPage.deleteAccountWarning')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{t('securityPage.deleteAccountInfo')}</p>
                             <AlertDialog onOpenChange={(open) => !open && resetDeleteFlow()}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">{t('securityPage.startDeletion')}</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    {deleteStep === 0 && (
                                        <>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('securityPage.deleteModal.step0Title')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                   {t('securityPage.deleteModal.step0Description')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="py-4 space-y-4">
                                                <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                                                    {deletionReasons.map((reason) => (
                                                        <div key={reason.id} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={reason.id} id={reason.id} />
                                                            <Label htmlFor={reason.id} className="cursor-pointer">{reason.label}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('securityPage.deleteModal.cancel')}</AlertDialogCancel>
                                                <Button onClick={() => setDeleteStep(1)} disabled={!selectedReason}>
                                                    {t('securityPage.deleteModal.continue')}
                                                </Button>
                                            </AlertDialogFooter>
                                        </>
                                    )}
                                    {deleteStep === 1 && (
                                        <>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('securityPage.deleteModal.step1Title')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('securityPage.deleteModal.step1Description')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="space-y-2 py-4">
                                                <Label htmlFor="password-confirm" className="sr-only">{t('securityPage.deleteModal.passwordLabel')}</Label>
                                                <Input id="password-confirm" type="password" placeholder={t('securityPage.deleteModal.passwordPlaceholder')} />
                                            </div>
                                            <AlertDialogFooter>
                                                <Button variant="ghost" onClick={() => setDeleteStep(0)}>{t('securityPage.deleteModal.goBack')}</Button>
                                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">{t('securityPage.deleteModal.confirmDelete')}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </>
                                    )}
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
