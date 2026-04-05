import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Users, Trophy, Star, ArrowRight, Shield, Mic2, PenTool, User as UserIcon, Medal, Award, Quote, Sparkles } from 'lucide-react';
import rdpLogo from '../assets/rdp-logo.png';
import schoolWall from '../assets/school_wall.jpg';
import enricoWilliams from '../assets/staff_enrico_williams.jpg';

const SportsAndCulture = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white font-sans text-dark overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex flex-col justify-center items-center overflow-hidden bg-dark pt-20">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={schoolWall} 
                        alt="Alexandria High" 
                        className="w-full h-full object-cover opacity-30 px-20 border-b-2 border-white/10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/95 via-dark/40 to-white" />
                </div>

                <div className="container-wide relative z-10 text-center mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="text-huge text-white mb-8">
                            Sports & <br /> 
                            <span className="text-serif italic text-primary">Culture.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-white/70 text-lg md:text-xl font-medium leading-relaxed">
                            Beyond the classroom, Alexandria High School is a crucible for talent, 
                            where intellectual vigor and athletic discipline forge tomorrow's leaders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cultural Leadership - Mr. E Breintjies & RDP */}
            <section className="section-padding bg-white relative">
                <div className="container-wide">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="label-authority mb-10">Cultural Pillar</div>
                            <h2 className="h2 mb-10 text-dark">
                                Reading, Debating <br /> 
                                <span className="text-serif italic text-primary">& Poetry Society (RDP)</span>
                            </h2>
                            <p className="text-lg text-dark/70 mb-12 leading-relaxed">
                                Under the strategic leadership of <span className="font-bold text-dark">Mr. E Breintjies</span>, 
                                the RDP Society serves as the intellectual heart of Alexandria High. We cultivate an environment 
                                where the power of speech and literature empower our learners to navigate 
                                complex global discourses with confidence.
                            </p>

                            {/* Professional Leader Profile: Mr. E Breintjies */}
                            <div className="flex items-center gap-8 p-8 border-2 border-slate-100 rounded-2xl mb-12 shadow-sm bg-white hover:border-primary/20 transition-all duration-500">
                                <div className="w-24 h-24 bg-dark rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group border border-dark/10">
                                    <span className="text-3xl font-black text-white/30 tracking-tighter">EB</span>
                                    <div className="absolute inset-x-0 bottom-0 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest text-center">PRINCIPAL</div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 italic">Cultural Protocol</h4>
                                    <h3 className="text-3xl font-bold text-dark tracking-tighter">Mr. E Breintjies</h3>
                                    <p className="text-xs text-dark/40 font-bold uppercase tracking-[0.3em] mt-1">Head of RDP Society</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-10 mb-12">
                                <div className="group/item">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500">
                                            <Mic2 size={20} />
                                        </div>
                                        <h4 className="font-bold text-dark uppercase text-[12px] tracking-widest">Public Speaking</h4>
                                    </div>
                                    <p className="text-sm text-dark/60 leading-snug">Speaking with power and confidence.</p>
                                </div>
                                <div className="group/item">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500">
                                            <BookOpen size={20} />
                                        </div>
                                        <h4 className="font-bold text-dark uppercase text-[12px] tracking-widest">Reading</h4>
                                    </div>
                                    <p className="text-sm text-dark/60 leading-snug">Exploring stories from around the world.</p>
                                </div>
                                <div className="group/item">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-dark border border-accent/20 group-hover/item:bg-accent transition-all duration-500">
                                            <PenTool size={20} />
                                        </div>
                                        <h4 className="font-bold text-dark uppercase text-[12px] tracking-widest">Creative Poetry</h4>
                                    </div>
                                    <p className="text-sm text-dark/60 leading-snug">Giving a face to our next generation.</p>
                                </div>
                                <div className="group/item">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-dark/5 flex items-center justify-center text-dark border border-dark/10 group-hover/item:bg-dark group-hover/item:text-white transition-all duration-500">
                                            <Users size={20} />
                                        </div>
                                        <h4 className="font-bold text-dark uppercase text-[12px] tracking-widest">Community</h4>
                                    </div>
                                    <p className="text-sm text-dark/60 leading-snug">Supporting each other every day.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[40px] overflow-hidden border border-dark/5 shadow-2xl relative p-16 bg-[#f8fbff] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50" />
                                <img 
                                    src={rdpLogo} 
                                    alt="RDP Society Logo" 
                                    className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Sports Leadership - Mr. E Williams */}
            <section className="section-padding bg-dark text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[150px] rounded-full opacity-30" />
                
                <div className="container-wide relative z-10">
                    <div className="max-w-6xl">
                        <div className="label-authority !text-accent mb-10">Athletic Governance</div>
                        <h2 className="h2 mb-10 text-white leading-tight underline decoration-accent/20 underline-offset-[12px]">
                            Physical Discipline & <br />
                            <span className="text-serif italic text-accent">Competitive Excellence.</span>
                        </h2>
                        
                        <p className="text-xl text-white/60 mb-16 leading-relaxed max-w-4xl font-light">
                            Under the professional command of <span className="font-bold text-white">Mr. E Williams</span>, 
                            sports at Alexandria High provide a laboratory for character testing and elite teamwork. 
                            The foundation for our 2026/2027 season is currently being fortified through disciplined restructuring.
                        </p>

                        {/* Professional Leader Profile: Mr. E Williams */}
                        <div className="flex flex-col md:flex-row md:items-center gap-10 p-10 bg-white/[0.03] border-2 border-white/5 rounded-[32px] mb-20 backdrop-blur-sm group hover:border-accent/40 transition-all duration-700">
                            <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl relative shrink-0">
                                <img src={enricoWilliams} alt="Mr. E Williams" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                                <div className="absolute inset-x-0 bottom-0 py-2 bg-accent text-dark text-[10px] font-black uppercase tracking-[0.2em] text-center">SPORTS HEAD</div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h4 className="text-[11px] font-black text-accent uppercase tracking-[0.4em] italic leading-none">Athletic Protocol</h4>
                                    <div className="h-[1px] flex-1 bg-white/10" />
                                </div>
                                <h3 className="text-5xl font-bold text-white mb-4 tracking-tighter">Mr. E Williams</h3>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_#cc9900]" />
                                        <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em]">Head of Athletics</span>
                                    </div>
                                    <div className="flex items-center gap-6 opacity-30">
                                        <Award size={20} />
                                        <Medal size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
                            {[
                                { title: "Rugby", status: "Season: 2026/2027", icon: Award, desc: "Building power, teamwork, and tactical grit on the Alexandria fields." },
                                { title: "Netball", status: "Season: 2026/2027", icon: Trophy, desc: "Precision, agility, and court vision for our competitive squads." }
                            ].map((sport) => (
                                <div key={sport.title} className="p-12 border-2 border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-sm group/card hover:bg-white/[0.05] hover:border-accent transition-all duration-700 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="text-4xl font-bold mb-4 tracking-tighter uppercase">{sport.title}</h4>
                                        <div className="inline-flex items-center gap-4 py-2 px-4 bg-white/5 rounded-xl border border-white/5 mb-8">
                                            <div className="w-2 h-2 rounded-full bg-accent" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{sport.status}</span>
                                        </div>
                                        <p className="text-white/40 text-sm leading-relaxed border-l-2 border-accent/20 pl-6 italic">"{sport.desc}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-40 border-t border-white/5 pt-12 text-center pb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20">Alexandria High Institutional Registry // 1960 - 2026</p>
                </div>
            </section>
        </div>
    );
};

export default SportsAndCulture;
