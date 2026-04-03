import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import prefectCampImg from '../assets/prefect-camp-2026.jpg';
import staffGroup from '../assets/staff_group.jpg';
import schoolWall from '../assets/school_wall.jpg';
import { supabase } from '../lib/supabaseClient';

const Hero = () => {
    const { t, lang } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEntered, setIsEntered] = useState(false);

    const defaultSlides = [
        {
            image: schoolWall,
            tag: t.hero.admissions_tag,
            title: t.hero.dignity,
            styledtitle: t.hero.first,
            desc: t.hero.admissions_desc
        },
        {
            image: prefectCampImg,
            tag: t.hero.leadership_tag,
            title: t.hero.student,
            styledtitle: t.hero.leaders,
            desc: t.hero.leadership_desc
        },
        {
            image: staffGroup,
            tag: t.hero.staff_tag,
            title: t.hero.dedicated,
            styledtitle: t.hero.teachers,
            desc: t.hero.staff_desc
        }
    ];

    const [slides, setSlides] = useState(defaultSlides);

    useEffect(() => {
        setSlides(defaultSlides);
    }, [lang]); // Re-sync slides when language changes

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data, error } = await supabase
                    .from('hero_slides')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (!error && data && data.length > 0) {
                    // Note: This logic assumes the database has localized content or we prefer DB over defaults
                    // For now, we prefer DB if available, but be aware of i18n implications
                    setSlides(data);
                }
            } catch (err) {
                console.error("Failed to fetch dynamic slides:", err);
            }
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsEntered(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 12000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Cinematic Animation Variants
    const letterVariants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                delay: 0.5 + i * 0.03,
                duration: 1.5,
                ease: [0.19, 1, 0.22, 1]
            }
        })
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    return (
        <section className={`relative h-screen min-h-[500px] md:min-h-[900px] w-full bg-dark overflow-hidden cinematic-reveal ${isEntered ? 'is-active' : ''}`}>
            {/* The Background Layer with Depth of Field Parallax */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }}
                    animate={{ scale: 1, opacity: 0.7, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute inset-0"
                >
                    <img
                        src={slides[currentSlide].image}
                        alt="Hero"
                        className="w-full h-full object-cover grayscale-[0.3]"
                    />
                    {/* The Cinematic Gradient Map */}
                    <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-70" />
                </motion.div>
            </AnimatePresence>

            {/* The Orchestrated Content Frame */}
            <div className="container-wide h-full relative z-20 flex flex-col justify-end pb-12 md:pb-32 lg:pb-40 px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="relative"
                        >
                            <motion.div className="flex items-center gap-2 md:gap-6 mb-4 md:mb-10 overflow-hidden">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="h-[1px] w-6 md:w-12 bg-accent/40"
                                />
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-accent/70"
                                >
                                    {slides[currentSlide].tag}
                                </motion.span>
                            </motion.div>

                            <h1 className="text-white text-[2rem] xs:text-[2.8rem] sm:text-[4rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] leading-[0.85] tracking-tight md:tracking-[[-0.05em]] mb-6 md:mb-12 flex flex-wrap gap-x-2 md:gap-x-8 gpu blur-optimize" style={{ hyphens: 'none' }}>
                                <motion.span
                                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.5 }}
                                    className="block"
                                >
                                    {slides[currentSlide].title}
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.7 }}
                                    className="text-serif italic text-white/90 block"
                                >
                                    {slides[currentSlide].styledtitle}
                                </motion.span>
                            </h1>

                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-16 border-l border-white/5 pl-3 md:pl-16">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 1.5 }}
                                    className="max-w-md text-white/40 text-xs sm:text-sm md:text-lg lg:text-2xl font-light leading-relaxed gpu"
                                >
                                    {slides[currentSlide].desc}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.2, duration: 1 }}
                                    className="gpu w-full md:w-auto"
                                >
                                    <Link to="/admission" className="btn-authority !py-3 md:!py-7 !px-6 md:!px-16 !text-xs md:!text-sm group md:scale-110 w-full md:w-auto inline-flex justify-center">
                                        {t.hero.view_admissions}
                                        <ArrowRight size={16} className="transition-transform duration-700 group-hover:translate-x-3" />
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Cinematic Sequencer (Bottom Right) */}
            <div className="absolute bottom-0 right-0 z-40 p-4 md:p-16 bg-dark/20 backdrop-blur-3xl border-l border-t border-white/5">
                <div className="flex items-center gap-4 md:gap-16">
                    <div className="hidden md:flex items-center gap-8">
                        <span className="text-[11px] font-black text-white/20 tracking-[0.5em]">0{currentSlide + 1}</span>
                        <div className="w-40 h-[1px] bg-white/5 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-accent origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                key={currentSlide}
                                transition={{ duration: 12, ease: "linear" }}
                            />
                        </div>
                        <span className="text-[11px] font-black text-white/20 tracking-[0.5em]">0{slides.length}</span>
                    </div>

                    <div className="flex gap-2 md:gap-4">
                        <button
                            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
                            className="w-12 h-12 md:w-16 md:h-16 border border-white/5 text-white/40 flex items-center justify-center hover:bg-white hover:text-dark transition-all duration-1000 group touch-manipulation"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={20} className="group-active:scale-90" />
                        </button>
                        <button
                            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                            className="w-12 h-12 md:w-16 md:h-16 border border-white/5 text-white/40 flex items-center justify-center hover:bg-white hover:text-dark transition-all duration-1000 group touch-manipulation"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={20} className="group-active:scale-90" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Parallax Vertical Brand Label */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
                className="absolute top-1/2 right-16 -translate-y-1/2 vertical-text pointer-events-none hidden xl:block"
            >
                <div className="flex items-center gap-8">
                    <div className="h-32 w-[1px] bg-gradient-to-t from-white/10 to-transparent" />
                    <span className="text-[10px] font-black uppercase tracking-[1.5em] text-white/5">{t.hero.pride_discipline}</span>
                </div>
            </motion.div>

            {/* Ambient Movie Grain Overlay */}
            <div className="absolute inset-0 noise pointer-events-none z-[100] opacity-[0.05]" />
        </section>
    );
};

export default Hero;
