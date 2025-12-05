'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import LikesGrid from "@/components/discover/likes-you";

export default function LikesPage() {
    const { t } = useLanguage();
    return (
        <div className="h-full flex flex-col">
            <header className="p-4 border-b">
                 <h1 className="text-2xl font-bold text-foreground">{t('likes.title')}</h1>
            </header>
             <Tabs defaultValue="likes" className="flex-1 flex flex-col">
                <div className="px-4 py-2 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="likes">{t('likes.likesYou')}</TabsTrigger>
                        <TabsTrigger value="superlikes">{t('likes.superLikes')}</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="likes" className="flex-1 overflow-y-auto">
                    <LikesGrid />
                </TabsContent>
                <TabsContent value="superlikes" className="flex-1 overflow-y-auto">
                    <LikesGrid />
                </TabsContent>
            </Tabs>
        </div>
    )
}
