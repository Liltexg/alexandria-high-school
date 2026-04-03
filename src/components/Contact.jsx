import React, { useState } from 'react';
import PageHero from './PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="bg-white">
            <PageHero
                title={t.contact.title}
                subtitle={t.contact.subtitle}
                image="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop"
            />

            <section className="section-padding">
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row gap-32 items-start">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-5/12"
                        >
                            <span className="label-meta mb-6 block">{t.contact.get_in_touch}</span>
                            <h2 className="text-huge text-dark mb-12 leading-[0.85] tracking-tighter" dangerouslySetInnerHTML={{ __html: t.contact.service_support }} />
                            <p className="text-xl text-dark/40 font-light leading-relaxed mb-16 font-sans">
                                {t.contact.desc}
                            </p>

                            <div className="grid grid-cols-1 gap-12">
                                <div className="group border-b border-black/5 pb-10">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">{t.contact.visit_campus}</span>
                                    <h4 className="text-2xl font-display font-bold text-dark mb-2">{t.contact.campus_location}</h4>
                                    <p className="text-sm text-dark/40 font-sans tracking-tight">{t.contact.campus_address}</p>
                                </div>
                                <div className="group border-b border-black/5 pb-10">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">{t.contact.call_office}</span>
                                    <h4 className="text-2xl font-display font-bold text-dark group-hover:text-primary transition-colors">{t.footer.phone}</h4>
                                </div>
                                <div className="group border-b border-black/5 pb-10">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">{t.contact.official_email}</span>
                                    <h4 className="text-2xl font-display font-bold text-dark group-hover:text-primary transition-colors">{t.footer.email}</h4>
                                </div>
                            </div>
                        </motion.div>

                        {/* Inquiry Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-7/12 relative bg-soft p-12 lg:p-20"
                        >
                            <AnimatePresence>
                                {submitted && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center p-12 text-center"
                                    >
                                        <div className="w-20 h-20 border border-primary/20 flex items-center justify-center mb-8 text-primary">
                                            <Send size={32} />
                                        </div>
                                        <h3 className="text-3xl font-display font-bold text-dark mb-4 tracking-tighter uppercase">{t.contact.message_sent}</h3>
                                        <p className="text-dark/40 mb-12 font-light">{t.contact.log_desc}</p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="btn-studio btn-studio-primary bg-primary text-white"
                                        >
                                            {t.contact.send_another}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <h3 className="text-3xl font-display font-bold mb-16 text-dark tracking-tighter uppercase">{t.contact.send_inquiry}</h3>
                            <form className="space-y-12" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="border-b border-black/10 flex flex-col gap-4 pb-4 focus-within:border-primary transition-colors">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-dark/30">{t.contact.first_name}</label>
                                        <input required type="text" className="bg-transparent text-xl font-light outline-none" placeholder={t.contact.first_name} />
                                    </div>
                                    <div className="border-b border-black/10 flex flex-col gap-4 pb-4 focus-within:border-primary transition-colors">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-dark/30">{t.contact.last_name}</label>
                                        <input required type="text" className="bg-transparent text-xl font-light outline-none" placeholder={t.contact.last_name} />
                                    </div>
                                </div>
                                <div className="border-b border-black/10 flex flex-col gap-4 pb-4 focus-within:border-primary transition-colors">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark/30">{t.contact.email_address}</label>
                                    <input required type="email" className="bg-transparent text-xl font-light outline-none" placeholder="email@address.com" />
                                </div>
                                <div className="border-b border-black/10 flex flex-col gap-4 pb-8 focus-within:border-primary transition-colors">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark/30">{t.contact.message}</label>
                                    <textarea required rows="4" className="bg-transparent text-xl font-light outline-none resize-none" placeholder={t.contact.placeholder_nature}></textarea>
                                </div>
                                <button disabled={loading} type="submit" className="btn-studio btn-studio-primary bg-dark text-white flex items-center justify-center gap-6 group disabled:opacity-70 w-full lg:w-auto">
                                    {loading ? 'Processing...' : (
                                        <>{t.contact.submit_button} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
