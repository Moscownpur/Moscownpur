import React from 'react';
import { motion } from 'framer-motion';

const PublicPageBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-orange-500/5 dark:from-background dark:via-background dark:to-orange-500/10 transition-colors duration-500" />
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent dark:from-orange-500/10 blur-3xl" />

            {/* Animated Orbs - Firey Theme */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
            />
        </div>
    );
};

export default PublicPageBackground;
