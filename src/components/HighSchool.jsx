import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from './PageHero';
import { motion } from 'framer-motion';
import { BookOpen, Users, Cpu, Zap, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

import staffGroup from '../assets/staff_group.jpg';
import schoolWall from '../assets/school_wall.jpg';

const HighSchool = () => {
    return (
        <div className="bg-white">
            <PageHero
                title="The Senior Phase"
                subtitle="Grades 8 – 12: A focus on academic rigor, vocational preparation, and leadership development."
                image={staffGroup}
            />

            {/* Academic Core: Immersive Section */}
            <section className="section-padding">
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row gap-32 items-center mb-48">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative aspect-square bg-soft">
                                <img
                                    src={schoolWall}
                                    alt="Academic Depth"
                                    className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-1000 hover:scale-105"
                                />
                                <div className="absolute inset-0 border-[20px] border-white -m-10 pointer-events-none" />

                                {/* Status Overlay */}
                                <div className="absolute -bottom-10 -right-10 bg-primary p-12 shadow-2xl">
                                    <div className="text-5xl font-display font-bold text-white mb-2 leading-none">75%</div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Official Matric Pass 2025</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <span className="label-meta mb-6 block">Secondary Standard</span>
                            <h2 className="text-dark mb-12 leading-[0.85] tracking-tighter">
                                Senior <br />
                                <span className="text-serif italic text-primary">High School.</span> <br />
                                Scholarly Dignity.
                            </h2>
                            <p className="text-xl text-dark/60 font-light leading-relaxed mb-12 font-sans">
                                At Alexandria High School, our Senior Phase is governed by the NSC (CAPS) curriculum. We prioritize a disciplined environment where academic curiosity is met with structural support and community trust.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-black/5 pt-12">
                                <div className="flex items-center gap-6">
                                    <ShieldCheck size={20} className="text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-dark">Academic Stewardship</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <Zap size={20} className="text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-dark">Technical Stream Focus</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Specialized Tracks: Studio Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-black/5">
                        {[
                            { icon: <Cpu size={24} />, title: "ICT Awareness", desc: "Equipping senior learners with digital literacy and Awareness ICT4E protocols in partnership with local foundations." },
                            { icon: <BookOpen size={24} />, title: "NSC Framework", desc: "Rigorous focus on core subjects for the National Senior Certificate, ensuring tertiary readiness." },
                            { icon: <Users size={24} />, title: "Vocational Path", desc: "Preparation for diverse professional futures including agriculture, commerce, and technical trades." }
                        ].map((track, i) => (
                            <div key={i} className="group p-12 border-r last:border-r-0 border-black/5 hover:bg-soft transition-all duration-500">
                                <div className="text-primary mb-12 group-hover:scale-110 transition-transform duration-500">{track.icon}</div>
                                <h3 className="text-xl font-display font-bold text-dark mb-6 uppercase tracking-widest">{track.title}</h3>
                                <p className="text-sm text-dark/40 leading-relaxed font-light font-sans group-hover:text-dark/60 transition-colors">
                                    {track.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Preparation Section: High Contrast */}
            <section className="bg-dark py-40 noise overflow-hidden relative">
                <div className="container-wide relative z-10">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-32">
                        <div className="max-w-2xl">
                            <span className="label-meta text-white/40 mb-6 block">Career Guidance</span>
                            <h2 className="text-huge text-white mb-16 leading-[0.85] tracking-tighter">
                                Transition & <br />
                                <span className="text-serif italic">Impact.</span>
                            </h2>
                            <p className="text-lg text-white/40 font-light leading-relaxed mb-16">
                                We facilitate formal tertiary applications and vocational mentorship, bridging the gap between a no-fee rural public school education and global opportunity.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-8">
                                <Link to="/apply" className="btn-studio bg-white text-dark hover:bg-primary hover:text-white flex items-center justify-center gap-4 group">
                                    Admissions Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/about" className="btn-studio border border-white/10 text-white hover:bg-white hover:text-dark flex items-center justify-center gap-4 transition-all duration-500">
                                    Our Heritage
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-[400px] border border-white/5 bg-white/5 p-12 backdrop-blur-xl">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-12">Academic Protocol</h4>
                            <div className="space-y-12">
                                {[
                                    { label: 'Matric Pass (Official)', val: '75%' },
                                    { label: 'No-Fee Status', val: 'Quintile 3' },
                                    { label: 'Assessment Policy', val: 'SBA 25%' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</span>
                                        <span className="text-2xl font-display font-bold text-primary tracking-tighter">{stat.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Massive Decorative Typography */}
                <div className="absolute -bottom-24 -right-24 opacity-[0.02] pointer-events-none select-none">
                    <span className="text-[30rem] font-display font-black leading-none text-white">G12</span>
                </div>
            </section>
        </div>
    );
};

export default HighSchool;
