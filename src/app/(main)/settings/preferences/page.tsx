'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';

export default function PreferencesPage() {
    const [distance, setDistance] = useState(25);
    const [ageRange, setAgeRange] = useState([22, 35]);
    const { t } = useLanguage();

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4">
                <Link href="/settings" passHref>
                     <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('preferencesPage.title')}</h1>
                    <p className="text-muted-foreground">{t('preferencesPage.description')}</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('preferencesPage.distance')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <Label>{t('preferencesPage.maxDistance')}</Label>
                                <span className="text-lg font-semibold text-primary">{distance} {t('common.km')}</span>
                            </div>
                            <Slider
                                value={[distance]}
                                max={150}
                                step={1}
                                onValueChange={(value) => setDistance(value[0])}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('preferencesPage.ageRange')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <Label>{t('preferencesPage.ageRange')}</Label>
                                <span className="text-lg font-semibold text-primary">{ageRange[0]} - {ageRange[1]}</span>
                            </div>
                             <Slider
                                value={ageRange}
                                max={65}
                                min={18}
                                step={1}
                                onValueChange={setAgeRange}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button className="w-full md:w-auto">{t('preferencesPage.save')}</Button>
            </div>
        </div>
    );
}
