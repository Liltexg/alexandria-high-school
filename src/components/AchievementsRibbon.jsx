import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const AchievementsRibbon = () => {
    const { t } = useLanguage();
    const achievements = t.achievements;

    return (
        <section className="bg-primary py-8 md:py-12 overflow-hidden relative shadow-glow">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="inline-flex gap-24 items-center px-12 whitespace-nowrap"
            >
                {[...achievements, ...achievements].map((text, i) => (
                    <div key={i} className="flex items-center gap-8 group">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs md:text-sm font-black uppercase tracking-[0.5em] text-white">
                            {text}
                        </span>
                    </div>
                ))}
            </motion.div>

            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary via-primary/50 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary via-primary/50 to-transparent z-10" />

            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none noise opacity-10" />
        </section>
    );
};

export default AchievementsRibbon;
