import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

const MissionRed = () => {
    const { t } = useLanguage();
    return (
        <section className="bg-primary py-72 noise relative overflow-hidden group">
            {/* Architectural Grid Overlay */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
            <div className="container-wide absolute inset-y-0 left-1/2 -translate-x-1/2 border-x border-white/5 pointer-events-none" />

            <div className="container-wide relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-32">

                    {/* The Narrative Side */}
                    <div className="lg:w-3/5">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        >
                            <div className="flex items-center gap-8 mb-16 overflow-hidden">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="h-px w-20 bg-accent origin-left"
                                />
                                <div className="flex items-center gap-4">
                                    <span className="text-[12px] font-black uppercase tracking-[0.8em] text-white/40 italic">{t.mission.tag}</span>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-1.5 h-4 bg-accent"
                                    />
                                </div>
                            </div>

                            <div className="relative mb-20">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute -top-8 left-0 h-[2px] bg-white/5 overflow-hidden"
                                >
                                    <div className="text-[8px] font-black uppercase tracking-[1em] text-white/20 py-1 pl-4">Alexandria High School</div>
                                </motion.div>

                                <motion.h2
                                    className="text-white leading-[0.85] tracking-[[-0.04em]] text-8xl md:text-[11rem] lg:text-[12rem] gpu blur-optimize"
                                >
                                    <motion.span
                                        initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                                        className="inline-block"
                                    >
                                        {t.mission.quality}
                                    </motion.span>
                                    <br />
                                    <motion.span
                                        initial={{ opacity: 0, filter: 'blur(10px)', x: -10 }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.8, duration: 1.2 }}
                                        className="text-serif italic text-accent/90 inline-block"
                                    >
                                        {t.mission.education}
                                    </motion.span>
                                    <br />
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.2, duration: 1.2 }}
                                        className="inline-block"
                                    >
                                        {t.mission.for_all}
                                    </motion.span>
                                </motion.h2>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, duration: 2 }}
                                className="max-w-xl pl-16 border-l border-white/10"
                            >
                                <p className="text-2xl text-white/60 font-light leading-relaxed mb-16">
                                    {t.mission.desc}
                                </p>

                                <Link
                                    to="/admission"
                                    className="inline-flex items-center gap-16 group/btn"
                                >
                                    <span className="text-[13px] font-black uppercase tracking-[0.6em] text-white group-hover/btn:text-accent transition-colors duration-1000">{t.mission.button}</span>
                                    <div className="w-24 h-24 rounded-none border border-white/20 flex items-center justify-center text-white group-hover/btn:bg-accent group-hover/btn:text-dark group-hover/btn:border-accent transition-all duration-[1500ms] cubic-bezier">
                                        <ArrowRight size={32} className="transition-transform group-hover/btn:translate-x-2" />
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* The Aesthetic Object */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 2, ease: [0.19, 1, 0.22, 1] }}
                        className="lg:w-2/5 pt-20"
                    >
                        <div className="p-20 bg-dark/20 backdrop-blur-3xl border border-white/5 relative overflow-hidden group/card shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                            <div className="relative z-10">
                                <ScrollText className="text-accent mb-12 opacity-50" size={40} />
                                <h3 className="text-4xl font-display font-medium text-white mb-10 tracking-tighter">{t.mission.dignity_first}</h3>
                                <p className="text-sm text-white/30 uppercase font-black tracking-[0.4em] leading-loose mb-16 border-t border-white/5 pt-12">
                                    {t.mission.card_desc}
                                </p>
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-px bg-accent/30" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent/60">{t.mission.founded}</span>
                                </div>
                            </div>

                            {/* Internal Watermark Parallax */}
                            <motion.img
                                style={{ y: 20 }}
                                whileHover={{ y: -20, rotate: 5, scale: 1.1 }}
                                src={logo}
                                alt=""
                                className="absolute -bottom-16 -right-16 h-64 w-auto opacity-[0.07] grayscale transition-all duration-[3000ms]"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Narrative Parallax */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.04 }}
                transition={{ duration: 3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none w-full flex justify-center"
            >
                <img
                    src={logo}
                    alt=""
                    className="w-[90vw] max-w-[1400px] h-auto grayscale"
                />
            </motion.div>
        </section>
    );
};

export default MissionRed;
