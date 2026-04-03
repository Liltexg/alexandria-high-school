import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Users, Compass, ArrowRight, Target, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import farewell1 from '../assets/farewell_1.jpg';

// Blueprint Grid Lines for "Architectural Authority"
const GridLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #8C1515 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 left-0 right-0 h-px bg-primary" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-primary" />
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-primary" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-primary" />
    </div>
);

const Orientation = () => {
    const { t } = useLanguage();
    return (
        <section className="bg-white py-16 md:py-32 lg:py-72 relative overflow-hidden group noise">
            <GridLines />

            <div className="container-wide relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-40 items-center px-4 md:px-6 lg:px-0">

                    {/* The Narrative Manuscript Side */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        >
                            <div className="flex items-center gap-3 md:gap-6 mb-6 md:mb-12">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="h-px w-12 md:w-20 bg-primary origin-left"
                                />
                                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-primary italic">{t.orientation.welcome_tag}</span>
                            </div>

                            <div className="relative mb-8 md:mb-16">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute -top-6 left-0 h-[1px] w-full bg-dark/5 origin-left"
                                />
                                <motion.h2
                                    className="text-dark normal-case tracking-tight md:tracking-[[-0.05em]] leading-[0.85] text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[9.5rem] gpu blur-optimize"
                                    style={{ hyphens: 'none' }}
                                >
                                    <motion.span
                                        initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                                        className="inline-block"
                                    >
                                        {t.orientation.community}
                                    </motion.span>
                                    <br />
                                    <motion.span
                                        initial={{ opacity: 0, filter: 'blur(10px)', x: -10 }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, duration: 1.2 }}
                                        className="text-serif italic text-primary/80 inline-block"
                                    >
                                        {t.orientation.pride}
                                    </motion.span>
                                </motion.h2>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="absolute -right-8 bottom-0 hidden xl:block"
                                >
                                    <span className="text-[8px] font-black uppercase tracking-[1em] text-dark/10 vertical-text">{t.orientation.school_type}</span>
                                </motion.div>
                            </div>

                            <div className="space-y-6 md:space-y-12 mb-12 md:mb-20">
                                <p
                                    className="text-base sm:text-lg md:text-xl lg:text-3xl text-dark/80 md:text-dark/70 font-light leading-relaxed font-sans md:pr-12"
                                    dangerouslySetInnerHTML={{ __html: t.orientation.desc_main }}
                                />
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7, duration: 2 }}
                                    className="text-sm sm:text-base md:text-lg lg:text-xl text-dark/60 md:text-dark/40 font-light leading-relaxed font-sans max-w-xl"
                                >
                                    {t.orientation.desc_sec}
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 border-t border-dark/5 pt-8 md:pt-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.9, duration: 1.5 }}
                                >
                                    <span className="text-xs md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-primary mb-4 md:mb-6 block">{t.orientation.quintile_title}</span>
                                    <p className="text-sm md:text-[13px] text-dark/60 md:text-dark/50 font-medium md:font-bold uppercase tracking-wide md:tracking-widest leading-relaxed md:leading-loose md:pr-8">
                                        {t.orientation.quintile_desc}
                                    </p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.1, duration: 1.5 }}
                                >
                                    <span className="text-xs md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-primary mb-4 md:mb-6 block">{t.orientation.community_title}</span>
                                    <p className="text-sm md:text-[13px] text-dark/60 md:text-dark/50 font-medium md:font-bold uppercase tracking-wide md:tracking-widest leading-relaxed md:leading-loose md:pr-8">
                                        {t.orientation.community_desc}
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* The Cinematic Editorial Visual */}
                    <div className="lg:w-1/2 relative p-4 sm:p-6 md:p-8 lg:p-12">
                        {/* Decorative Geometry */}
                        <div className="absolute top-0 right-0 w-64 h-64 border-r border-t border-primary/10 -z-10" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 border-l border-b border-primary/10 -z-10" />

                        <motion.div
                            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
                            className="relative aspect-[4/5] bg-dark overflow-hidden group/img"
                        >
                            <img
                                src={farewell1}
                                alt="Leadership Vision"
                                className="w-full h-full object-cover grayscale opacity-80 group-hover/img:scale-110 group-hover/img:grayscale-0 transition-all duration-[4000ms] ease-out shadow-huge"
                            />
                            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay group-hover/img:opacity-0 transition-opacity duration-[2000ms]" />

                            {/* The Principal's Signed Quote */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 bg-white/10 backdrop-blur-3xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
                                <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-light italic leading-relaxed mb-6 md:mb-12">
                                    {t.orientation.quote}
                                </p>
                                <div className="flex items-center gap-4 md:gap-8">
                                    <div className="w-8 md:w-12 h-px bg-primary" />
                                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-white">{t.orientation.principal_name}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>

            {/* Tactical Analytics Row (Technical Studio Detail) */}
            <div className="mt-60 grid grid-cols-1 md:grid-cols-3 gap-px bg-dark/5 border border-dark/5 gpu">
                {[
                    { label: t.orientation.stats.pass_rate, value: "75%", meta: t.orientation.stats.pass_meta, icon: Target },
                    { label: t.orientation.stats.school_days, value: t.orientation.stats.school_days_value, meta: t.orientation.stats.days_meta, icon: CheckCircle2 },
                    { label: t.orientation.stats.learners, value: t.orientation.stats.learners_value, meta: t.orientation.stats.learners_meta, icon: Users }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1), duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                        className="p-16 bg-white hover:bg-soft transition-all duration-1000 group/stat relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 text-primary/5">
                            <stat.icon size={120} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-dark/30 mb-12 block group-hover/stat:text-primary transition-colors">{stat.label}</span>
                            <h4 className="text-7xl font-display font-medium text-dark group-hover/stat:text-primary transition-all duration-1000 tracking-[[-0.05em]] mb-6">{stat.value}</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-6 h-px bg-primary/20" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-dark/20">{stat.meta}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Orientation;
