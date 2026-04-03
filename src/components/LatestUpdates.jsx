import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Bookmark, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';

const LatestUpdates = () => {
    const { t, lang } = useLanguage();
    const defaultUpdates = t.latest_updates.default_updates.map(update => ({
        ...update,
        href: "/news"
    }));

    const [updates, setUpdates] = useState(defaultUpdates);

    useEffect(() => {
        setUpdates(defaultUpdates);
    }, [lang]); // Re-sync slides when language changes

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('is_published', true)
                    .order('published_at', { ascending: false })
                    .limit(2);

                if (!error && data && data.length > 0) {
                    const locale = lang === 'af' ? 'af-ZA' : 'en-GB';
                    const dynamicUpdates = data.map(item => ({
                        tag: item.category || (lang === 'af' ? "Hoogtepunt" : "Highlight"),
                        title: item.title,
                        desc: item.summary || item.content.substring(0, 100) + '...',
                        date: new Date(item.published_at).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ').toUpperCase(),
                        href: "/news"
                    }));

                    if (dynamicUpdates.length === 1) {
                        setUpdates([dynamicUpdates[0], defaultUpdates[1]]);
                    } else {
                        setUpdates(dynamicUpdates);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dynamic news:", err);
            }
        };
        fetchLatestNews();
    }, [lang]);

    return (
        <section className="bg-dark py-60 noise relative overflow-hidden group border-y border-white/5">
            {/* The Cinematic Scroll Label */}
            <div className="absolute top-1/2 left-12 -translate-y-1/2 vertical-text opacity-5 pointer-events-none">
                <span className="text-[120px] font-display font-bold text-white tracking-widest leading-none">{t.latest_updates.chronicles}</span>
            </div>

            <div className="container-wide relative z-10">
                <div className="flex flex-col lg:flex-row items-start justify-between mb-40">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="flex items-center gap-8 mb-12"
                        >
                            <div className="h-px w-16 bg-primary" />
                            <span className="text-[12px] font-black uppercase tracking-[0.8em] text-primary italic">{t.latest_updates.tag}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] tracking-tight md:tracking-[[-0.04em]] leading-[0.85] mb-6 md:mb-8"
                            style={{ hyphens: 'none' }}
                        >
                            {t.latest_updates.title} <br />
                            <span className="text-serif italic text-primary/80">{t.latest_updates.title_accent}</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 2 }}
                            className="text-white/30 text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-tight max-w-2xl"
                        >
                            {t.latest_updates.desc}
                        </motion.p>
                    </div>
                    <div className="hidden lg:block group/card relative bg-dark/50 backdrop-blur-sm p-12 xl:p-16 border border-white/10 hover:border-primary/20 transition-all duration-1000 shadow-[0_40px_100px_rgba(0,0,0,0.02)] hover:shadow-[0_80px_150px_rgba(0,0,0,0.05)] gpu">
                        <Link to="/news" className="group flex items-center gap-6 border-b border-primary/20 pb-4 hover:border-primary transition-all duration-1000">
                            <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/60 group-hover:text-white transition-colors">{t.latest_updates.view_all}</span>
                            <ArrowUpRight size={18} className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 mt-32 border border-white/5">
                    {updates.map((update, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="bg-dark p-8 sm:p-12 md:p-16 lg:p-24 group/card relative overflow-hidden gpu"
                        >
                            {/* Cinematic Hover Refraction */}
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/card:opacity-10 transition-opacity duration-[2000ms]" />

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-8 md:mb-16">
                                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">{update.tag}</span>
                                    <span className="text-[10px] md:text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">{update.date}</span>
                                </div>

                                <h3
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-medium text-white mb-6 md:mb-10 tracking-tight md:tracking-[[-0.02em]] leading-[1.1] md:leading-[0.95] group-hover/card:text-accent transition-colors duration-1000"
                                    style={{ hyphens: 'none', wordBreak: 'normal' }}
                                >
                                    {update.title}
                                </h3>

                                <p className="text-base sm:text-lg md:text-xl text-white/40 font-light leading-relaxed mb-12 md:mb-24 max-w-lg">
                                    {update.desc}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-16">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-none border border-white/10 flex items-center justify-center text-primary/60 group-hover/card:bg-primary group-hover/card:text-white group-hover/card:border-primary transition-all duration-1000">
                                            <Newspaper size={14} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover/card:text-white transition-colors">{t.latest_updates.read_story}</span>
                                    </div>
                                    <Link to={update.href} className="w-16 h-16 rounded-none bg-white/5 flex items-center justify-center text-white/20 group-hover/card:bg-white group-hover/card:text-dark transition-all duration-[1200ms] group-hover/card:rotate-[360deg]">
                                        <ArrowUpRight size={20} />
                                    </Link>
                                </div>
                            </div>

                            {/* Decorative Frame */}
                            <div className="absolute top-0 right-0 w-24 h-px bg-white/5" />
                            <div className="absolute top-0 right-0 w-px h-24 bg-white/5" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* The Parallax "Seal of Truth" */}
            <motion.div
                whileInView={{ rotate: 0, scale: 1.1 }}
                initial={{ rotate: 15, scale: 1 }}
                viewport={{ margin: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="absolute -bottom-48 -right-48 pointer-events-none opacity-[0.05] select-none"
            >
                <img
                    src={logo}
                    alt=""
                    className="w-[70vw] max-w-[1000px] h-auto grayscale"
                />
            </motion.div>
        </section>
    );
};

export default LatestUpdates;
