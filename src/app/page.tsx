'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthScreen from '@/components/auth/auth-screen';
import MainLayout from './(main)/layout';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        router.push('/discover');
    };

    if (isAuthenticated) {
        return <MainLayout><div /></MainLayout>;
    }

    return (
        <main className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
            <AnimatePresence>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md h-[90vh] max-h-[800px] bg-card rounded-2xl shadow-2xl overflow-hidden"
                >
                    <AuthScreen />
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
