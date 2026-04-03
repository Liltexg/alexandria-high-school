import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Laptop, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AcademicPaths = () => {
    const { t } = useLanguage();
    const paths = t.academic_paths.phases.map((phase, idx) => ({
        ...phase,
        icon: idx === 0 ? BookOpen : idx === 1 ? GraduationCap : Laptop,
        href: idx === 2 ? "/high-school" : "/primary-school",
        align: idx === 0 ? "start" : idx === 1 ? "center" : "end"
    }));

    return (
        <section className="bg-white py-72 relative overflow-hidden group">
            {/* The Studio Structural Underlay */}
            <div className="absolute inset-x-0 h-px bg-dark/5 top-1/4" />
            <div className="absolute inset-x-0 h-px bg-dark/5 top-3/4" />
            <div className="container-wide absolute inset-y-0 left-1/2 -translate-x-1/2 border-x border-dark/5 pointer-events-none" />

            <div className="container-wide relative z-10">
                <div className="max-w-6xl mb-60">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="flex items-center gap-8 mb-16"
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="h-px w-20 bg-primary origin-left"
                        />
                        <span className="text-[12px] font-black uppercase tracking-[0.8em] text-primary italic">{t.academic_paths.tag}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="text-dark leading-[0.85] tracking-tight md:tracking-[[-0.05em]] text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] 2xl:text-[11rem] mb-12 md:mb-16"
                        style={{ hyphens: 'none', wordBreak: 'normal' }}
                        dangerouslySetInnerHTML={{ __html: t.academic_paths.title }}
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 2 }}
                        className="max-w-3xl text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-dark/30 leading-relaxed italic border-l border-dark/10 pl-6 md:pl-12"
                    >
                        {t.academic_paths.desc}
                    </motion.p>
                </div>

                <div className="flex flex-col gap-16 md:gap-24 lg:gap-0">
                    {paths.map((path, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                            className={`w-full lg:w-3/5 flex flex-col ${path.align === 'start' ? 'lg:self-start' :
                                path.align === 'center' ? 'lg:self-center' : 'lg:self-end'
                                }`}
                        >
                            <div className="group/card relative bg-white p-8 sm:p-12 md:p-16 lg:p-24 border border-dark/5 hover:border-primary/20 transition-all duration-1000 shadow-[0_40px_100px_rgba(0,0,0,0.02)] hover:shadow-[0_80px_150px_rgba(0,0,0,0.05)]">
                                {/* Cinematic Icon Background */}
                                <div className="absolute -top-8 -left-8 md:-top-12 md:-left-12 w-16 h-16 md:w-24 md:h-24 bg-dark text-white flex items-center justify-center group-hover/card:bg-primary transition-all duration-1000 shadow-2xl">
                                    <path.icon size={24} className="md:w-9 md:h-9 group-hover/card:scale-110 transition-transform duration-1000" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 md:items-center justify-between mb-8 md:mb-12">
                                    <span className="text-[10px] md:text-[12px] font-black text-primary uppercase tracking-[0.4em] md:tracking-[0.6em] italic">{path.grades}</span>
                                    <div className="h-px flex-grow bg-dark/5 hidden md:block" />
                                    <span className="text-[9px] md:text-[10px] font-bold text-dark/20 uppercase tracking-[0.3em] md:tracking-[0.4em]">{t.academic_paths.school_label}</span>
                                </div>

                                <h3
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-medium text-dark mb-8 md:mb-12 tracking-tight md:tracking-tighter leading-none group-hover/card:text-primary transition-colors duration-1000"
                                    style={{ hyphens: 'none', wordBreak: 'normal' }}
                                >
                                    {path.title}
                                </h3>

                                <p className="mb-20 text-dark/40 font-light text-2xl leading-relaxed max-w-xl group-hover/card:text-dark/60 transition-colors duration-1000">
                                    {path.desc}
                                </p>

                                <div className="flex items-center justify-end">
                                    <Link
                                        to={path.href}
                                        className="group/link flex items-center gap-12 text-[12px] font-black uppercase tracking-[0.6em] text-dark/30 hover:text-primary transition-all duration-1000"
                                    >
                                        {t.academic_paths.learn_more}
                                        <div className="w-16 h-16 rounded-none border border-dark/10 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-white group-hover/link:border-primary transition-all duration-[1200ms] group-hover/link:rotate-[360deg]">
                                            <ArrowRight size={24} />
                                        </div>
                                    </Link>
                                </div>

                                {/* Studio Structural Corners */}
                                <div className="absolute top-0 right-0 w-32 h-px bg-dark/5" />
                                <div className="absolute top-0 right-0 w-px h-32 bg-dark/5" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cinematic Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none text-[30vw] font-display font-bold text-dark tracking-[[-0.1em]] leading-none">
                {t.academic_paths.background_text}
            </div>
        </section>
    );
};

export default AcademicPaths;
