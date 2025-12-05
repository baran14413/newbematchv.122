'use client';
import { useLanguage } from "@/context/language-context";
import LikesGrid from "@/components/discover/likes-you";

export default function LikesPage() {
    const { t } = useLanguage();
    return (
        <div className="h-full flex flex-col">
            <LikesGrid />
        </div>
    )
}
