'use client';
import { motion } from 'framer-motion';
import AuthScreen from '@/components/auth/auth-screen';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function Home() {
    const authBg = PlaceHolderImages.find(p => p.id === 'auth-bg');

    return (
        <main className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
            {authBg && (
                <Image 
                    src={authBg.imageUrl}
                    alt={authBg.description}
                    fill
                    className="object-cover opacity-30"
                />
            )}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md h-[90vh] max-h-[800px] bg-card/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            >
                <AuthScreen />
            </motion.div>
        </main>
    );
}
