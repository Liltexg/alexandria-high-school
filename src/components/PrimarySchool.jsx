import React from 'react';
import PageHero from './PageHero';
import { motion } from 'framer-motion';
import { Smile, Layout, Heart, Lightbulb, Compass, Shield, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import staffGroup from '../assets/staff_group.jpg';
import schoolWall from '../assets/school_wall.jpg';

const PrimarySchool = () => {
    return (
        <div className="bg-white">
            <PageHero
                title="The Primary Phase"
                subtitle="Grades R – 7: Nurturing foundational literacy and character in a secure, no-fee environment."
                image={staffGroup}
            />

            {/* Introduction: Immersive Section */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row gap-32 items-center mb-48">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <span className="label-meta mb-6 block">Foundation & Intermediate</span>
                            <h2 className="text-dark mb-12 leading-[0.85] tracking-tighter">
                                Infinite <br />
                                <span className="text-serif italic text-primary">Potential.</span>
                            </h2>
                            <p className="text-xl text-dark/60 font-light leading-relaxed mb-12 font-sans">
                                At Alexandria High School, our primary years are dedicated to building a secure academic harbor. We prioritize the #DignityFirst standard, ensuring every child transitions from early literacy to adolescent leadership with confidence.
                            </p>

                            <div className="space-y-12 border-t border-black/5 pt-12">
                                <div className="flex items-start gap-8 group">
                                    <div className="w-12 h-12 border border-black/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark text-xs uppercase tracking-widest mb-2">Secure Harbor</h4>
                                        <p className="text-dark/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">A disciplined and nurturing environment for holistic growth.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-8 group">
                                    <div className="w-12 h-12 border border-black/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Layout size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark text-xs uppercase tracking-widest mb-2">CAPS Readiness</h4>
                                        <p className="text-dark/40 text-[10px] uppercase font-bold tracking-widest leading-relaxed">Rigorous literacy and numeracy instruction aligned with national standards.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative aspect-[4/5] bg-soft overflow-hidden">
                                <img
                                    src={schoolWall}
                                    alt="Intermediate learners"
                                    className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-1000 hover:scale-105"
                                />
                                <div className="absolute inset-0 border-[20px] border-white -m-10 pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Discovery Pillars: Studio Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-black/5">
                        {[
                            { icon: <Lightbulb size={24} />, title: "Active Literacy", desc: "Using local context and ICT tools to breathe life into the foundations of reading and arithmetic." },
                            { icon: <Compass size={24} />, title: "Character Growth", desc: "Instilling values of respect and community service in our youngest Alexandria ambassadors." },
                            { icon: <Heart size={24} />, title: "Equity First", desc: "A no-fee commitment that ensures every learner from our farming roots to our CBD has equal access." }
                        ].map((pillar, i) => (
                            <div key={i} className="group p-12 border-r last:border-r-0 border-black/5 hover:bg-soft transition-all duration-500 text-center flex flex-col items-center">
                                <div className="text-primary mb-12 group-hover:scale-110 transition-transform duration-500">{pillar.icon}</div>
                                <h3 className="text-xl font-display font-bold text-dark mb-6 uppercase tracking-widest">{pillar.title}</h3>
                                <p className="text-sm text-dark/40 leading-relaxed font-light font-sans group-hover:text-dark/60 transition-colors">
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Atmosphere: High Contrast */}
            <section className="py-48 bg-dark noise overflow-hidden relative">
                <div className="container-wide relative z-10">
                    <div className="max-w-4xl mb-32">
                        <span className="label-meta text-white/40 mb-6 block">Atmosphere</span>
                        <h2 className="text-huge text-white tracking-tighter leading-[0.85]">
                            The Space <br />
                            <span className="text-serif italic">Between.</span>
                        </h2>
                        <p className="text-xl text-white/40 font-light font-sans mt-12 max-w-2xl">
                            We bridge the gap between rural resilience and modern aspiration. Our playgrounds and classrooms are spaces of mutual dignity and discipline.
                        </p>
                        <div className="mt-16">
                            <Link to="/apply" className="btn-studio bg-white text-dark hover:bg-primary hover:text-white inline-flex items-center gap-4 group">
                                Start Enrollment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                        {[
                            { title: "Harmony", icon: <Smile size={20} />, desc: "Structured play for physical and social development." },
                            { title: "ICT Literacy", icon: <Layout size={20} />, desc: "Early introduction to digital tools as a life skill." },
                            { title: "Community", icon: <Heart size={20} />, desc: "Fostering pride in our Alexandria heritage." },
                            { title: "Discipline", icon: <Shield size={20} />, desc: "High standards of conduct and mutual respect." }
                        ].map((item, i) => (
                            <div key={i} className="p-12 border-r last:border-r-0 border-white/5 hover:bg-white/5 transition-all duration-500 group">
                                <div className="text-primary mb-12 transition-transform duration-500 group-hover:-translate-y-2">{item.icon}</div>
                                <h4 className="text-white font-display font-bold uppercase tracking-[0.2em] text-xs mb-4">{item.title}</h4>
                                <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Massive Decorative Typography */}
                <div className="absolute -bottom-24 -right-24 opacity-[0.02] pointer-events-none select-none">
                    <span className="text-[30rem] font-display font-black leading-none text-white">R7</span>
                </div>
            </section>
        </div>
    );
};

export default PrimarySchool;
