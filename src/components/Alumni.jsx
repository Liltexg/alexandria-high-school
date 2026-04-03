import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from './PageHero';
import { motion } from 'framer-motion';
import { Heart, Users, Landmark, Globe, ArrowUpRight } from 'lucide-react';

const Alumni = () => {
    return (
        <div className="bg-white">
            <PageHero
                title="Alumni & Legacy"
                subtitle="A network of leadership spanning decades of Alexandria history."
                image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            />

            <section className="section-padding">
                <div className="container-wide">
                    <div className="max-w-4xl mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="label-meta mb-6 block">The Alexandria Fund</span>
                            <h2 className="text-dark leading-[0.85] tracking-tighter mb-12">
                                Sustaining <br />
                                <span className="text-serif italic text-primary">Common Duty.</span>
                            </h2>
                            <p className="text-xl text-dark/40 font-light leading-relaxed max-w-2xl">
                                Your support ensures that Alexandria High School remains a lighthouse of no-fee excellence in the Eastern Cape. We leverage alumni generosity to maintain ICT infrastructure and foundational literacy programs.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-black/5 mb-48">
                        {[
                            { icon: <Heart size={24} />, title: "Support R-12", desc: "Targeted subventions for learner supplies and daily nutrition protocols." },
                            { icon: <Landmark size={24} />, title: "Infrastructure", desc: "Maintaining our CBD facilities and ICT laboratories for the digital generation." },
                            { icon: <Users size={24} />, title: "Mentorship", desc: "Connecting current senior learners with professionals from the Alexandria diaspora." }
                        ].map((item, i) => (
                            <div key={i} className="group p-12 border-r last:border-r-0 border-black/5 hover:bg-soft transition-all duration-500">
                                <div className="text-primary mb-12 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                                <h3 className="text-xl font-display font-bold text-dark mb-6 uppercase tracking-widest">{item.title}</h3>
                                <p className="text-sm text-dark/40 leading-relaxed font-light font-sans group-hover:text-dark/60 transition-colors">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                        <Link to="/contact" className="btn-studio bg-dark text-white flex items-center justify-center gap-6 group">
                            Coordinate a Gift <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                        <Link to="/contact" className="btn-studio border border-black/10 text-dark/40 hover:bg-soft hover:text-dark flex items-center justify-center transition-all duration-500">
                            Update Registry Info
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-dark py-40 noise relative overflow-hidden">
                <div className="container-wide relative z-10">
                    <h3 className="text-4xl font-display font-bold text-white mb-20 tracking-tighter uppercase">Quarterly Impact Events</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            { date: "APR 20", title: "SGB Community Consultation", desc: "Join us in the CBD for our annual governance and budget review." },
                            { date: "JUL 15", title: "Founders' Legacy Day", desc: "A celebration of history and the R-12 combined school vision." },
                            { date: "DEC 02", title: "Year-End Achievement Gala", desc: "Honoring our top learners and departing matrics." }
                        ].map((event, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-12 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500">
                                <div className="text-[10px] font-bold text-primary mb-6 tracking-[0.4em] uppercase">{event.date}</div>
                                <h4 className="text-2xl font-display font-bold text-white mb-6 tracking-tight uppercase">{event.title}</h4>
                                <p className="text-white/40 text-sm font-light leading-relaxed group-hover:text-white/60 transition-colors">{event.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Massive Decorative Typography */}
                <div className="absolute -bottom-24 -right-24 opacity-[0.02] pointer-events-none select-none">
                    <span className="text-[30rem] font-display font-black leading-none text-white">ALU</span>
                </div>
            </section>
        </div>
    );
};

export default Alumni;
