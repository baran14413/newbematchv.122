'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
        <span className="text-muted-foreground">{children}</span>
    </li>
);

export default function SubscriptionsPage() {
    const { t } = useLanguage();

    const packages = [
        {
            name: "Plus",
            price: "₺49.99",
            period: t('subscriptionsPage.weekly'),
            features: [
                t('subscriptionsPage.features.unlimitedLikes'),
                t('subscriptionsPage.features.hideAds'),
                `5 ${t('subscriptionsPage.features.superLikes')}`
            ],
            isPopular: false,
        },
        {
            name: "Gold",
            price: "₺149.99",
            period: t('subscriptionsPage.monthly'),
            features: [
                t('subscriptionsPage.features.plusFeatures'),
                t('subscriptionsPage.features.seeWhoLikesYou'),
                `1 ${t('subscriptionsPage.features.boostPerWeek')}`
            ],
            isPopular: true,
        },
        {
            name: "Platinum",
            price: "₺899.99",
            period: t('subscriptionsPage.yearly'),
            features: [
                t('subscriptionsPage.features.goldFeatures'),
                t('subscriptionsPage.features.topMessages'),
                t('subscriptionsPage.features.unlimitedRewinds')
            ],
            isPopular: false,
        }
    ];

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
            <header className="p-4 py-6 md:p-8 flex items-center gap-4">
                <Link href="/settings" passHref>
                     <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('subscriptionsPage.title')}</h1>
                    <p className="text-muted-foreground">{t('subscriptionsPage.description')}</p>
                </div>
            </header>

            <div className="md:p-8 md:pt-0 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
                {packages.map((pkg, index) => (
                    <Card key={index} className={cn("flex flex-col", pkg.isPopular && "border-primary ring-2 ring-primary shadow-lg")}>
                        {pkg.isPopular && (
                            <Badge className="absolute -top-3 self-center bg-primary">{t('subscriptionsPage.mostPopular')}</Badge>
                        )}
                        <CardHeader className="items-center text-center">
                            <CardTitle className="text-4xl font-bold text-primary">{pkg.name}</CardTitle>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">{pkg.price}</span>
                                <span className="text-muted-foreground">/ {pkg.period}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-4">
                                {pkg.features.map((feature, i) => (
                                    <FeatureListItem key={i}>{feature}</FeatureListItem>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant={pkg.isPopular ? "default" : "secondary"}>
                                {t('subscriptionsPage.choosePlan')}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
