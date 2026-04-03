import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Shield, ArrowUpRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LOGO_URI as logo } from '../utils/logo';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const [activeDocument, setActiveDocument] = React.useState(null);
    const { lang, t } = useLanguage();

    const documents = {
        popi: {
            title: "POPIA Act Compliance",
            url: "https://www.education.gov.za/Portals/0/Documents/Manuals/Guidelines%20for%20DBE%20POPIA.pdf"
        },
        bela: {
            title: "BELA Act Compliance",
            url: "https://www.education.gov.za/Portals/0/Documents/Legislation/Bills/BELA%20Bill/BELA%20Bill.pdf"
        }
    };

    const navGroups = [
        {
            title: t.footer.philosophy,
            links: [
                { name: t.footer.academic_story, href: "/about" },
                { name: t.footer.faculty_governance, href: "/staff" },
                { name: t.footer.academic_pillars, href: "/high-school" }
            ]
        },
        {
            title: t.footer.engagement,
            links: [
                { name: t.footer.bulletin, href: "/news" },
                { name: t.footer.calendar, href: "/calendar" },
                { name: t.footer.admissions_portal, href: "/admission" }
            ]
        },
        {
            title: t.footer.social_ecosystem,
            links: [
                { name: t.footer.smt_portal, href: "/smt/login" },
                { name: t.footer.heritage, href: "/alumni" },
                { name: t.footer.registry, href: "/contact" }
            ]
        }
    ];

    return (
        <footer className="bg-dark text-white pt-60 pb-16 noise overflow-hidden relative transition-all duration-1000">
            <div className="container-wide relative z-10">

                {/* Top Section: Organized Directory */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-48">
                    {navGroups.map((group) => (
                        <div key={group.title} className="border-t border-white/5 pt-12">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-12">{group.title}</h4>
                            <ul className="space-y-6">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-[12px] font-medium text-white/40 hover:text-white transition-all duration-500 flex items-center gap-4 group"
                                        >
                                            {link.name}
                                            <div className="h-[1px] w-0 bg-primary group-hover:w-8 transition-all duration-700" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* The Major Brand Anchor (Studio Layout) */}
                <div className="flex flex-col items-center justify-center text-center mb-60 border-y border-white/5 py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="relative mb-16"
                    >
                        <img src={logo} alt="Crest" className="h-24 md:h-32 w-auto opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-[1500ms]" />
                    </motion.div>
                    <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-display font-bold leading-[0.8] tracking-tighter text-white px-4" style={{ hyphens: 'none', wordBreak: 'normal' }}>
                        ALEXANDRIA <br />
                        <span className="text-serif italic text-primary">HIGH SCHOOL.</span>
                    </h2>
                    <p className="mt-12 text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] md:tracking-[1em] text-white/20">{t.footer.established}</p>
                </div>

                {/* Contact Structured Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-32 border border-white/5">
                    <div className="flex flex-col gap-4 bg-dark p-8 md:p-12 hover:bg-white/5 transition-colors duration-700">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{t.footer.liaison}</span>
                        <span className="text-lg font-light text-white/80">+27 {t.footer.phone}</span>
                    </div>
                    <div className="flex flex-col gap-4 bg-dark p-8 md:p-12 hover:bg-white/5 transition-colors duration-700">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{t.footer.location}</span>
                        <span className="text-lg font-light text-white/80">{t.footer.address_street}</span>
                        <span className="text-sm font-light text-white/40">{t.footer.address_city}</span>
                    </div>
                    <div className="flex flex-col gap-4 bg-dark p-8 md:p-12 hover:bg-white/5 transition-colors duration-700">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{t.footer.mail}</span>
                        <a href={`mailto:${t.footer.email}`} className="text-lg font-light text-white/80 hover:text-accent transition-colors">{t.footer.email}</a>
                    </div>
                </div>

                {/* Bottom Bar: Ultra Minimalist */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 pt-20 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
                        {t.footer.tagline}
                    </p>
                    <div className="flex flex-wrap items-center gap-10">
                        <button onClick={() => setActiveDocument('popi')} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white">POPIA</button>
                        <button onClick={() => setActiveDocument('bela')} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white">BELA Act</button>
                        <span className="text-white/5 text-xl">|</span>
                        <div className="flex gap-6">
                            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                                <Icon key={i} size={16} className="text-white/20 hover:text-accent transition-colors cursor-pointer" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Modal */}
            <AnimatePresence>
                {activeDocument && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveDocument(null)}
                            className="absolute inset-0 bg-dark/95 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col relative"
                        >
                            <div className="flex items-center justify-between p-12 border-b border-dark/5">
                                <h3 className="text-dark font-display font-medium text-3xl tracking-tighter uppercase">{documents[activeDocument].title}</h3>
                                <button
                                    onClick={() => setActiveDocument(null)}
                                    className="w-16 h-16 bg-dark text-white flex items-center justify-center hover:bg-primary transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-grow">
                                <iframe src={documents[activeDocument].url} className="w-full h-full grayscale opacity-80" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;
