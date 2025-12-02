'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from '@/components/ui/button';

export default function PreferencesPage() {
    const [distance, setDistance] = useState(25);
    const [ageRange, setAgeRange] = useState([22, 35]);

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8">
                <h1 className="text-3xl font-bold text-primary">Tercihler</h1>
                <p className="text-muted-foreground">Keşfet sayfasında kimleri görmek istediğini ayarla.</p>
            </header>

            <div className="md:p-8 md:pt-0 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Mesafe Tercihi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <Label>Maksimum Mesafe</Label>
                                <span className="text-lg font-semibold text-primary">{distance} km</span>
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
                        <CardTitle>Yaş Aralığı</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <Label>Yaş Aralığı</Label>
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

                <Button className="w-full md:w-auto">Tercihleri Kaydet</Button>
            </div>
        </div>
    );
}
