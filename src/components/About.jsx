import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Compass, Users, MapPin } from 'lucide-react';
import PageHero from './PageHero';
import { useLanguage } from '../context/LanguageContext';

import schoolWall from '../assets/school_wall.jpg';

const About = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-white">
            <PageHero
                title={t.about.legacy_title}
                subtitle={t.about.legacy_subtitle}
                image={schoolWall}
            />

            <section className="section-padding bg-white border-b border-dark/5">
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <span className="label-authority mb-10 block">{t.about.ethos_tag}</span>
                            <h2 className="text-dark mb-12 leading-[0.9] tracking-tighter" dangerouslySetInnerHTML={{ __html: t.about.integrity_title }} />
                            <p className="text-3xl text-dark/40 font-light leading-relaxed mb-16 italic">
                                {t.about.quote}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <p className="text-xl text-dark/60 leading-relaxed mb-12 font-light">
                                {t.about.school_desc}
                            </p>
                            <div className="flex flex-wrap gap-12">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-dark text-white rounded-none">
                                        <Shield size={24} />
                                    </div>
                                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-dark">Alexandria High School</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-primary text-white rounded-none">
                                        <MapPin size={24} />
                                    </div>
                                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-dark">{t.about.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-dark text-white">
                <div className="container-wide">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
                        {t.about.pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="group"
                            >
                                <div className="w-16 h-16 bg-white/5 text-accent mb-10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-700">
                                    {[Shield, Target, Compass, Users][i] && React.createElement([Shield, Target, Compass, Users][i], { size: 28 })}
                                </div>
                                <h3 className="text-[12px] font-black uppercase tracking-[0.5em] mb-6 text-white">{pillar.title}</h3>
                                <p className="text-white/40 text-lg font-light leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
