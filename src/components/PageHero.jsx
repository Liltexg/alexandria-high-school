import React from 'react';
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, image, align = 'center' }) => {
    return (
        <div className="relative min-h-[70vh] w-full overflow-hidden flex items-center bg-dark gpu pt-32 md:pt-40">
            <motion.div
                initial={{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }}
                whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 z-0"
            >
                <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover brightness-[0.5] grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-90" />
            </motion.div>

            <div className="absolute inset-0 noise pointer-events-none opacity-5 z-[5]" />

            <div className="relative z-10 container-wide text-white">
                <div className={`max-w-6xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    >
                        <div className={`flex items-center gap-4 mb-10 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
                            <div className="h-px w-10 bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30 italic">High School Protocol</span>
                        </div>

                        <h1
                            className={`font-display font-bold text-5xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[9rem] tracking-tighter leading-[0.85] mb-8 gpu blur-optimize ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
                            style={{ hyphens: 'none', wordBreak: 'normal' }}
                            dangerouslySetInnerHTML={{ __html: title }}
                        />

                        {subtitle && (
                            <p className={`text-lg sm:text-xl md:text-2xl font-light text-white/50 max-w-3xl leading-[1.6] ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                                {subtitle}
                            </p>
                        )}
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 100 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1, duration: 2 }}
                            className={`h-1 bg-primary mt-12 origin-left ${align === 'center' ? 'mx-auto' : 'mx-0'}`}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PageHero;
