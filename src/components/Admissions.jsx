import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from './PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, ArrowRight, Minus, Plus, ClipboardList, UserCheck } from 'lucide-react';
import { translations } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import farewell2 from '../assets/farewell_2.jpg';
import farewell3 from '../assets/farewell_3.jpg';

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-black/5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-10 flex items-center justify-between text-left group"
            >
                <span className="text-xl md:text-2xl font-display font-bold text-dark group-hover:text-primary transition-colors tracking-tight uppercase">{title}</span>
                <div className={`w-10 h-10 border border-black/5 flex items-center justify-center transition-all ${isOpen ? 'bg-primary border-primary text-white' : 'bg-white text-dark/20 group-hover:text-dark'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-10 text-dark/40 leading-relaxed max-w-2xl font-sans text-lg font-light">
                            {content}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Admissions = () => {
    const { lang, t, settings } = useLanguage();

    const icons = [ClipboardList, FileText, UserCheck];
    const steps = t.admissions.steps.map((s, i) => ({
        ...s,
        icon: icons[i],
        phase: `0${i + 1}`
    }));

    return (
        <div className="bg-white">
            <PageHero
                title={`${t.admissions.title} ${settings.intake_year || '2027'}`}
                subtitle={t.admissions.subtitle}
                image={farewell2}
            />

            {/* Policy: Immersive Section */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] overflow-hidden grayscale-[0.2]">
                                <img
                                    src={farewell3}
                                    alt="Academic Focus"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 border-[20px] border-white -m-10 pointer-events-none" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="label-meta block text-primary font-semibold tracking-wider">{t.admissions.our_approach}</span>
                                {settings.admissions_phase !== 'Open' && (
                                    <span className="bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                                        Phase: {settings.admissions_phase}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-8" dangerouslySetInnerHTML={{ __html: t.admissions.quality_education }}>
                            </h2>
                            <p className="text-lg text-dark/70 leading-relaxed mb-10 max-w-xl">
                                {t.admissions.approach_desc}
                            </p>

                            <div className="space-y-5 mb-12">
                                {t.admissions.features.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <CheckCircle size={20} className="text-primary flex-shrink-0" />
                                        <span className="text-base font-medium text-dark">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link 
                                    to="/apply" 
                                    className={`font-medium rounded-full py-4 px-10 transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto ${
                                        settings.admissions_phase === 'Closed' 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none' 
                                        : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                                >
                                    {settings.admissions_phase === 'Closed' ? 'Portal Suspended' : t.admissions.apply_online}
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/track-application" className="border-2 border-dark text-dark hover:bg-dark hover:text-white font-medium rounded-full py-4 px-10 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                    Track My Application
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-amber-900 ml-1">Beta</span>
                                    <ClipboardList size={18} />
                                </Link>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-gray-50 border-y border-black/5">
                <div className="container-wide">
                    <div className="max-w-3xl mb-20 text-center mx-auto">
                        <span className="text-primary font-semibold tracking-wider mb-4 block uppercase text-sm">{t.admissions.how_it_works}</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-dark" dangerouslySetInnerHTML={{ __html: t.admissions.application_process }}>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-10 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <span className="text-5xl font-black text-gray-100 group-hover:text-primary/10 transition-colors uppercase">{step.phase}</span>
                                </div>
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 relative z-10">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-4">{step.title}</h3>
                                <p className="text-base text-dark/60 leading-relaxed relative z-10">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ: Clean Layout */}
            <section className="section-padding bg-white">
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                        <div className="lg:w-1/3">
                            <span className="text-primary font-semibold tracking-wider mb-4 block uppercase text-sm">{t.admissions.need_help}</span>
                            <h2 className="text-4xl md:text-4xl font-bold text-dark mb-8" dangerouslySetInnerHTML={{ __html: t.admissions.we_are_here }}>
                            </h2>
                            <p className="text-dark/70 leading-relaxed mb-10 text-lg">
                                {t.admissions.help_desc}
                            </p>
                            <div className="p-8 md:p-10 border border-black/10 bg-gray-50 rounded-2xl">
                                <h4 className="font-semibold text-dark/50 uppercase tracking-widest text-xs mb-3">{t.admissions.contact_office}</h4>
                                <p className="text-primary text-2xl font-bold mb-2">063 652 0546</p>
                                <p className="text-dark font-medium text-sm">alexandriahigh6185@gmail.com</p>
                            </div>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="divide-y divide-black/10">
                                {t.admissions.faqs.map((faq, i) => (
                                    <AccordionItem
                                        key={i}
                                        title={faq.title}
                                        content={faq.content}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Admissions;
