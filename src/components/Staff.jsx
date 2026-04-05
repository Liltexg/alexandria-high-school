import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, BookOpen, Calculator, Laptop, Heart, Palette, Target, CheckCircle2 } from 'lucide-react';
import { facultyData } from '../data/faculties';
import PageHero from './PageHero';
import staffGroup from '../assets/staff_group.jpg';
import { LOGO_URI as logo } from '../utils/logo';
import { useLanguage } from '../context/LanguageContext';
import dannyWilliams from '../assets/staff_danny_williams.jpg';
import franklinDennis from '../assets/staff_franklin_dennis.jpg';
import enricoWilliams from '../assets/staff_enrico_williams.jpg';
import bukekaJonas from '../assets/staff_bukeka_jonas.jpg';

const StaffMember = ({ member, onClick }) => (
    <motion.div
        layoutId={`member-${member.id}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={() => onClick(member)}
        className="group cursor-pointer"
    >
        <div className="aspect-[3/4] overflow-hidden bg-dark relative mb-12">
            <img
                src={member.image}
                alt={member.name}
                className={`w-full h-full transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 ${member.image === logo ? 'object-contain p-12 grayscale-0' : 'object-cover grayscale group-hover:grayscale-0'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-1000" />
        </div>
        <div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary block mb-3">{member.department}</span>
            <h3 className="text-4xl font-display font-medium text-dark group-hover:text-primary transition-all duration-700 tracking-tighter leading-none mb-4">
                {member.name}
            </h3>
            <p className="text-dark/40 text-[10px] font-black uppercase tracking-[0.4em]">
                {member.role}
            </p>
        </div>
    </motion.div>
);

const StaffModal = ({ member, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/95 backdrop-blur-3xl"
        />

        <motion.div
            layoutId={`member-${member.id}`}
            className="relative w-full max-w-7xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden rounded-none"
        >
            <button
                onClick={onClose}
                className="absolute top-10 right-10 z-10 p-5 bg-dark text-white hover:bg-primary transition-all duration-700 rounded-none shadow-2xl"
            >
                <X size={24} />
            </button>

            <div className="w-full md:w-1/2 h-[40vh] md:h-auto bg-dark overflow-hidden">
                <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full transition-all duration-1000 ${member.image === logo ? 'object-contain p-24' : 'object-cover grayscale contrast-125'}`}
                />
            </div>

            <div className="w-full md:w-1/2 p-12 md:p-24 overflow-y-auto">
                <div className="mb-20">
                    <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary/40 mb-6 block">
                        {member.role}
                    </span>
                    <h2 className="text-5xl md:text-8xl font-display font-bold text-dark tracking-tighter leading-[0.85]">
                        {member.name}
                    </h2>
                    <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-dark/30 mt-8">
                        {member.department} — Alexandria High School
                    </p>
                </div>

                <div className="space-y-20">
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-dark/20 mb-8 pb-4 border-b border-dark/5">{member.philosophyLabel}</h4>
                        <p className="text-2xl text-dark/60 font-light leading-relaxed italic font-serif">
                            "{member.commitment}"
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-dark/20 mb-8 pb-4 border-b border-dark/5">{member.pedigreeLabel}</h4>
                        <p className="text-dark/60 leading-relaxed font-light text-xl">
                            {member.bio}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
);

const Staff = () => {
    const { lang, t } = useLanguage();
    const [selectedMember, setSelectedMember] = useState(null);
    const [filter, setFilter] = useState(t.all_departments);

    const faculties = [
        { name: t.all_departments, icon: Shield },
        ...facultyData.map(f => {
            let translatedName = f.name;
            if (f.name.includes('Math')) translatedName = t.faculties.math_sciences;
            else if (f.name.includes('Languages')) translatedName = t.faculties.languages_humanities;
            else if (f.name.includes('Commerce')) translatedName = t.faculties.commerce_tech;
            else if (f.name.includes('Life')) translatedName = t.faculties.life_orientation;
            else if (f.name.includes('Arts')) translatedName = t.faculties.arts_sport;

            return {
                ...f,
                name: translatedName,
                icon: f.name.includes('Math') ? Calculator :
                    f.name.includes('Languages') ? BookOpen :
                        f.name.includes('Commerce') ? Laptop :
                            f.name.includes('Life') ? Heart : Palette
            };
        })
    ];

    const staffData = [
        {
            id: 2,
            name: "Mrs Jayshree Rajkaran",
            role: "Principal",
            school: "Alexandria High School",
            department: "Leadership",
            image: logo,
            commitment: "Dedicated to maintaining high standards of discipline and academics while fostering a nurturing environment for all learners.",
            expertise: "Strategic Management, Curriculum Planning",
            bio: "Serving as Principal, Mrs Rajkaran plays a pivotal role in the daily management and strategic direction of the school, ensuring that our academic pillars remain strong and inclusive.",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 3,
            name: "Mr Enrico Williams",
            role: "Post Level 2 (Departmental Head)",
            school: "Alexandria High School",
            department: "Leadership",
            image: enricoWilliams,
            commitment: "Never let your circumstances dictate where you going to end up in life.",
            expertise: "History, FET Management, Sport Coordination",
            bio: "Departmental Head of FET and History educator for Grades 11-12. Mr Williams also leads our sports program as Coordinator, heads the Disciplinary Committee (DC), and serves as Vice Chairman of EP High Schools.",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 4,
            name: "Mrs Hannelie Greeff",
            role: "Departmental Head (Foundation Phase)",
            school: "Alexandria High School",
            department: "Leadership",
            image: logo,
            commitment: "To do my best every day.",
            expertise: "Foundation Phase Management, Holistic Child Development",
            bio: "Serving as the Departmental Head for the Junior Primary/Foundation Phase. Mrs Greeff ensures academic excellence across all foundation subjects, nurturing our youngest learners with dedication and care.",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 5,
            name: "Mr E. Breintjies",
            role: "Grade 11 Head & Educator",
            school: "Alexandria High School",
            department: "Mathematics & Sciences",
            image: logo,
            commitment: "Empowering learners through leadership and literacy.",
            expertise: "Life Sciences, Mathematical Literacy",
            bio: "Serving as the Grade 11 Head and educator for Life Sciences and Mathematical Literacy. Mr Breintjies is also the President of the RDP (Reading, Debating & Poetry society) and Chairman of the RCL.",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 6,
            name: "Mr Danny Williams",
            role: "Post Level 1 Educator",
            school: "Alexandria High School",
            department: "Commerce & Technology",
            image: dannyWilliams,
            commitment: "To lead with resilience, ethics, and a relentless focus on the economic empowerment of our future leaders.",
            expertise: "Business Studies, CAT, Marketing",
            bio: "Focusing on Business Studies (Gr 10-12), CAT (Gr 11-12), and Tourism (Gr 10). A specialist in preparing learners for the complexities of the global market.",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 7,
            name: "Mrs Hermoine Lillah",
            role: "Post Level 1 Educator",
            school: "Alexandria High School",
            department: "Languages & Humanities",
            image: logo,
            commitment: "To inspire a love for language and scientific inquiry, empowering learners to communicate effectively and understand the world around them.",
            expertise: "Afrikaans EAT, Natural Sciences",
            bio: "Specializing in Afrikaans First Additional Language for the FET Phase (Gr 10-12) and Natural Sciences for the Senior Phase (Gr 8-9). Dedicated to academic excellence in both linguistic and scientific disciplines.",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 8,
            name: "Mr Franklin Dennis",
            role: "Post Level 1 Educator",
            school: "Alexandria High School",
            department: "Languages & Humanities",
            image: franklinDennis,
            commitment: "If you do something, do it right the first time.",
            expertise: "History, Social Sciences, Natural Sciences",
            bio: "A degreed educator with a broad specialization across the Senior and FET phases. Creating a strong foundation in Natural Science and Social Science (Gr 7-8), while guiding learners through Afrikaans (Gr 8-9) and History (Gr 10).",
            email: "alexandriahigh6185@gmail.com"
        },
        {
            id: 9,
            name: "Mrs Bukeka Jonas",
            role: "Post Level 1 Educator",
            school: "Alexandria High School",
            department: "Languages & Humanities",
            image: bukekaJonas,
            commitment: "Whatever you are, be a good one.",
            expertise: "English HL, English FAL",
            bio: "With a BAEd qualification, Mrs Jonas is dedicated to linguistic excellence. She teaches English Home Language (Gr 12) and guides learners through English First Additional Language across the entire FET Phase (Gr 10-12).",
            email: "alexandriahigh6185@gmail.com"
        }
    ].map(m => ({
        ...m,
        philosophyLabel: t.philosophy_stewardship,
        pedigreeLabel: t.pedigree_objective
    }));

    const filteredStaff = filter === t.all_departments
        ? staffData
        : staffData.filter(m => m.department === filter);

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                title={t.staff_hero_title}
                subtitle={t.staff_hero_subtitle}
                image={staffGroup}
            />

            <div className="container-wide section-padding">
                <div className="max-w-5xl mb-40">
                    <span className="label-authority mb-10 block">{t.mentors_distinction}</span>
                    <h2 className="text-dark leading-[0.9] tracking-tighter mb-16" dangerouslySetInnerHTML={{ __html: t.faculty_governance }}>
                    </h2>
                    <p className="max-w-3xl text-dark/40 text-2xl font-light leading-relaxed">
                        {t.teaching_vocation}
                    </p>
                </div>

                <div className="mb-40">
                    <div className="flex flex-wrap gap-6 mb-24">
                        {faculties.map((f) => (
                            <button
                                key={f.name}
                                onClick={() => setFilter(f.name)}
                                className={`px-6 py-4 sm:px-10 sm:py-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 flex items-center gap-4 ${filter === f.name
                                    ? 'bg-dark text-white border-dark'
                                    : 'bg-white text-dark/30 border border-dark/5 hover:text-dark hover:border-dark/20'
                                    }`}
                            >
                                <f.icon size={16} className={filter === f.name ? 'text-accent' : 'text-primary'} />
                                {f.name}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredStaff.map((member) => (
                                <StaffMember
                                    key={member.id}
                                    member={member}
                                    onClick={setSelectedMember}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {selectedMember && (
                        <StaffModal
                            member={selectedMember}
                            onClose={() => setSelectedMember(null)}
                        />
                    )}
                </AnimatePresence>

                <div className="mt-40 md:mt-80 pt-20 md:pt-40 border-t border-dark/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-20 opacity-30">
                    {[
                        { val: "75%", label: t.stats_labels.pass_rate },
                        { val: "Quintile 3", label: t.stats_labels.status },
                        { val: "Gr R - 12", label: t.stats_labels.phases },
                        { val: "Academic", label: t.stats_labels.specialization }
                    ].map((stat, i) => (
                        <div key={i} className="group">
                            <div className="text-7xl font-display font-medium text-dark mb-4 tracking-tighter group-hover:text-primary transition-colors duration-700">{stat.val}</div>
                            <div className="text-[11px] font-black text-dark uppercase tracking-[0.5em]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Staff;
