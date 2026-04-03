import React from 'react';
import PageHero from './PageHero';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Summer = () => {
    return (
        <div className="bg-white">
            <PageHero
                title="Academic Enrichment"
                subtitle="Bridging gaps and accelerating potential during the inter-cycle periods."
                image="https://images.unsplash.com/photo-1549488330-9eb412f5a60c?q=80&w=2072&auto=format&fit=crop"
            />

            <section className="section-padding">
                <div className="container-wide">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="label-meta mb-6 block">Enrichment Scope</span>
                            <h2 className="text-huge text-dark leading-[0.85] tracking-tighter mb-12">
                                Bridging the <br />
                                <span className="text-serif italic">Future.</span>
                            </h2>
                            <p className="text-xl text-dark/60 font-light leading-relaxed mb-16 max-w-xl">
                                Our enrichment programs are designed for learners who seek to transcend the standard curriculum. From intensive matrical support to early-foundation bridging, we ensure the Alexandria spirit of diligence continues year-round.
                            </p>

                            <div className="space-y-12 border-t border-black/5 pt-12">
                                {[
                                    { icon: <Award size={20} />, title: "Matric Accelerator", desc: "Intensive weekend and holiday revision cycles for Grade 12 learners." },
                                    { icon: <Cpu size={20} />, title: "ICT Bootcamps", desc: "Digital literacy sprints focused on practical vocational technology skills." },
                                    { icon: <BookOpen size={20} />, title: "Literacy Bridging", desc: "Foundational support for learners transitioning between educational phases." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-8 group">
                                        <div className="w-12 h-12 border border-black/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-dark text-xs uppercase tracking-widest mb-2">{item.title}</h4>
                                            <p className="text-dark/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="relative">
                            <div className="bg-dark p-12 lg:p-20 noise relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="text-white font-display font-bold text-3xl uppercase tracking-tighter mb-8 leading-none">
                                        Registration & <br /> <span className="text-primary italic">Inquiry</span>
                                    </h4>
                                    <p className="text-white/40 text-sm font-light leading-relaxed mb-12 max-w-sm">
                                        Programs are scheduled according to the official Eastern Cape school calendar. Spots are prioritized for current Alexandria learners.
                                    </p>
                                    <div className="space-y-6 mb-12">
                                        {['No-Fee Subsidies Available', 'Official Department Alignment', 'Certified Lead Educators'].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                                <CheckCircle2 size={12} className="text-primary" /> {feat}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn-studio bg-white text-dark hover:bg-primary hover:text-white w-full flex items-center justify-center gap-4 transition-all duration-500">
                                        Inquire for Next Cycle <ArrowRight size={14} />
                                    </button>
                                </div>
                                {/* Massive Background Icon */}
                                <Zap size={300} className="absolute -bottom-20 -right-20 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Summer;
