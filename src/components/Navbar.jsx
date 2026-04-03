import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Globe, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LOGO_URI as logo } from '../utils/logo';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [forceSolid, setForceSolid] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { lang, t, changeLanguage } = useLanguage();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        const handleForceSolid = (e) => setForceSolid(e.detail);
        window.addEventListener('navbar-solid', handleForceSolid);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('navbar-solid', handleForceSolid);
        };
    }, []);

    const isApplyPage = location.pathname === '/apply';
    const isSolidByDefault = ['/news', '/notices'].includes(location.pathname) || isApplyPage;
    const showSolidBg = isScrolled || forceSolid || isSolidByDefault;

    const navLinks = [
        { name: t.nav.our_school, href: "/about", side: "left" },
        { name: t.nav.noticeboard, href: "/news", side: "left" },
        { name: t.nav.staff_list, href: "/staff", side: "right" },
        { name: t.nav.staff_portal, href: "/smt/login", side: "right" }
    ];

    return (
        <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${showSolidBg ? 'py-4' : 'py-8'
            }`}>
            {/* The Structural Glass Bar */}
            <div className={`absolute inset-0 transition-all duration-1000 ${showSolidBg ? 'bg-dark/95 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-100' : 'opacity-0'
                }`} />

            <div className="container-wide relative">
                <nav className="flex items-center justify-between">

                    {/* Left Links (Desktop) */}
                    {!isApplyPage ? (
                        <div className="hidden lg:flex items-center gap-16 flex-1">
                            {navLinks.filter(l => l.side === "left").map(link => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all duration-500 relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-3 left-0 w-0 h-[1px] bg-accent transition-all duration-[800ms] group-hover:w-full ease-out" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="hidden lg:flex flex-1" />
                    )}

                    {/* Central Brand Anchor (The Studio Prestige Move) */}
                    <Link to="/" className="flex flex-col items-center gap-3 group px-12 relative">
                        {/* Decorative structural lines */}
                        <div className="absolute top-1/2 left-full w-24 h-[1px] bg-white/5 hidden lg:block" />
                        <div className="absolute top-1/2 right-full w-24 h-[1px] bg-white/5 hidden lg:block" />

                        <img
                            src={logo}
                            alt="Alexandria Crest"
                            className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${showSolidBg ? 'h-10 opacity-90' : 'h-16 opacity-100'
                                } group-hover:scale-105`}
                        />
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] md:text-[13px] font-display font-black tracking-[0.3em] md:tracking-[0.5em] text-white leading-none">ALEXANDRIA</span>
                            <span className="text-[7px] md:text-[8px] font-bold tracking-[0.4em] md:tracking-[0.6em] text-accent leading-none mt-1.5 opacity-80">HIGH SCHOOL</span>
                        </div>
                    </Link>

                    {/* Right Links (Desktop) */}
                    {!isApplyPage ? (
                        <div className="hidden lg:flex items-center justify-end gap-16 flex-1">
                            {navLinks.filter(l => l.side === "right").map(link => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white transition-all duration-500 relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-3 left-0 w-0 h-[1px] bg-accent transition-all duration-[800ms] group-hover:w-full ease-out" />
                                </Link>
                            ))}
                            <div className="flex items-center gap-4 px-4 py-1.5 border border-white/5 rounded-full bg-white/5">
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${lang === 'en' ? 'text-accent' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    EN
                                </button>
                                <span className="w-[1px] h-3 bg-white/10" />
                                <button
                                    onClick={() => changeLanguage('af')}
                                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${lang === 'af' ? 'text-accent' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    AF
                                </button>
                            </div>
                            <Link to="/admission" className="btn-authority !py-3 !px-8 !text-[10px] hover:-translate-y-0.5 whitespace-nowrap">
                                {t.nav.apply}
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden lg:flex flex-1 justify-end" />
                    )}

                    {/* Mobile Toggle */}
                    {!isApplyPage && (
                        <button
                            className="lg:hidden text-white p-4 h-12 w-12 border border-white/10 flex items-center justify-center"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    )}
                </nav>
            </div>

            {/* Studio Mobile Menu (Minimalist Full-Screen) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-dark z-[200] flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center mb-20">
                            <img src={logo} className="h-12 brightness-0 invert" alt="" />
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-4 h-12 w-12 border border-white/10 flex items-center justify-center">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-12 mt-12">
                            {[
                                { name: t.nav.our_school, href: "/about" },
                                { name: t.nav.noticeboard, href: "/news" },
                                { name: t.nav.staff_list, href: "/staff" },
                                { name: t.nav.staff_portal, href: "/smt/login" },
                                { name: t.nav.admissions, href: "/admission" }
                            ].map((item, i) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-5xl font-display font-medium text-white tracking-tighter hover:text-accent transition-colors duration-500"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex gap-8 mt-12 mb-8">
                                <button onClick={() => changeLanguage('en')} className={`text-2xl font-black ${lang === 'en' ? 'text-accent' : 'text-white/20'}`}>{t.nav.en}</button>
                                <button onClick={() => changeLanguage('af')} className={`text-2xl font-black ${lang === 'af' ? 'text-accent' : 'text-white/20'}`}>{t.nav.af}</button>
                            </div>
                        </div>

                        <div className="mt-auto border-t border-white/5 pt-12">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">{t.nav.established_abbr}</p>
                            <div className="flex items-center gap-6">
                                <Link to="/contact" className="text-accent text-[11px] font-black tracking-[0.3em] uppercase underline">Contact Us</Link>
                                <span className="text-white/10 text-xl font-light">|</span>
                                <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">+27 {t.footer.phone}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
