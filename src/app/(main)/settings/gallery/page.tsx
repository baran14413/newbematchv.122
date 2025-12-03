'use client';
import React, { useRef, useState } from 'react';
import { Plus, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { profiles } from '@/lib/data';
import Link from 'next/link';

const MAX_PHOTOS = 6;

export default function GallerySettingsPage() {
  const { t } = useLanguage();
  const [userPhotos, setUserPhotos] = useState(profiles[1].imageUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && userPhotos.length < MAX_PHOTOS) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhotos(prevPhotos => [...prevPhotos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUserPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-black">
      <header className="p-4 py-6 md:p-8 flex items-center gap-4 border-b mb-8">
          <Link href="/settings" passHref>
              <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-6 h-6" />
              </Button>
          </Link>
          <div>
              <h1 className="text-3xl font-bold text-primary">{t('settings.editGallery')}</h1>
              <p className="text-muted-foreground">{t('galleryPage.description')}</p>
          </div>
      </header>

      <div className="md:p-8 md:pt-0 space-y-4">
        <p className="text-center text-muted-foreground text-sm">
          {t('onboarding.photos.info', { maxPhotos: MAX_PHOTOS })}
        </p>
        <p className="text-center text-muted-foreground text-xs italic">
          {t('onboarding.photos.profilePhotoHint')}
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
            const photo = userPhotos[index];
            if (photo) {
              return (
                <div key={index} className="relative aspect-square">
                   {index === 0 && (
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">{t('profile.title')}</div>
                  )}
                  <Image
                    src={photo}
                    alt={`${t('onboarding.photos.previewAlt')} ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            }
            if (index === userPhotos.length) {
              return (
                <button
                  key={index}
                  onClick={triggerFileInput}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-xs font-semibold">{t('onboarding.photos.addButton')}</span>
                </button>
              );
            }
            return (
              <div
                key={index}
                className="aspect-square flex items-center justify-center rounded-lg bg-gray-100 border-2 border-dashed border-gray-200"
              />
            );
          })}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        <div className="flex justify-center pt-4">
             <Button>{t('common.save')}</Button>
        </div>
      </div>
    </div>
  );
}
