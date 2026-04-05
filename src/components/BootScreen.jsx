import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URI } from '../utils/logo';

const BootScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState('black'); // black, orbs, crest, text

    useEffect(() => {
        // Phase 1: Deep Black
        const t1 = setTimeout(() => setPhase('orbs'), 800);
        // Phase 2: Orbs converging (Windows 7 icon fly-in)
        const t2 = setTimeout(() => setPhase('crest'), 3000);
        // Phase 3: Main Branding
        const t3 = setTimeout(() => setPhase('text'), 4500);
        // Phase 4: Finalize
        const t4 = setTimeout(() => {
            if (onComplete) onComplete();
        }, 7000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [onComplete]);

    const orbs = [
        { color: 'bg-[#ff3b30]', delay: 0, x: [-120, 0], y: [-120, 0] },
        { color: 'bg-[#4cd964]', delay: 0.1, x: [120, 0], y: [-120, 0] },
        { color: 'bg-[#007aff]', delay: 0.2, x: [-120, 0], y: [120, 0] },
        { color: 'bg-[#ffcc00]', delay: 0.3, x: [120, 0], y: [120, 0] }
    ];

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-['Segoe_UI',_sans-serif]">
            <AnimatePresence mode="wait">
                {phase === 'orbs' && (
                    <div className="relative w-32 h-32">
                        {orbs.map((orb, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: orb.x[0], y: orb.y[0], scale: 0.5 }}
                                animate={{
                                    opacity: [0, 1, 0.8],
                                    x: orb.x[1],
                                    y: orb.y[1],
                                    scale: [0.5, 1.2, 1],
                                    filter: ['blur(8px)', 'blur(12px)', 'blur(16px)']
                                }}
                                transition={{
                                    duration: 2,
                                    delay: orb.delay,
                                    ease: "circOut"
                                }}
                                className={`absolute inset-0 m-auto w-4 h-4 rounded-full ${orb.color} shadow-[0_0_30px_rgba(255,255,255,0.8)]`}
                            />
                        ))}
                    </div>
                )}

                {phase === 'crest' && (
                    <motion.div
                        key="crest"
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        transition={{ duration: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="w-24 h-24 relative">
                            {/* Glowing background for logo */}
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                            <img src={LOGO_URI} alt="" className="w-full h-full object-contain relative z-10 brightness-200" />
                        </div>
                    </motion.div>
                )}

                {phase === 'text' && (
                    <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-light text-white tracking-[0.2em] mb-2 uppercase">Starting Apex OS</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.4em]">Initializing Apex OS Core Protocols...</p>

                        <div className="mt-12 flex justify-center gap-2">
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        opacity: [0.2, 1, 0.2],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Branding */}
            <div className="absolute bottom-12 left-0 w-full text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="text-[9px] text-white uppercase tracking-[0.5em]"
                >
                    &copy; School Management Portal | Powered by Apex OS · Dev. Senzo Dube
                </motion.p>
            </div>
        </div>
    );
};

export default BootScreen;
