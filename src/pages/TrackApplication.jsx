import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
    Download, 
    ShieldCheck, 
    MessageSquare, 
    RefreshCw, 
    X, 
    Activity,
    Search,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    FileText,
    CheckCircle,
    ChevronRight,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateApplicationPDF } from '../utils/generateApplicationPDF';

const SectionHeader = ({ text }) => (
  <div className="bg-[#8C1515] border-y-2 border-[#D4AF37]/30 py-3 px-6 mb-8 mt-12 first:mt-0 shadow-sm relative overflow-hidden">
    <div className="absolute left-0 top-0 w-1 h-full bg-[#D4AF37]" />
    <h3 className="text-[12px] font-black uppercase tracking-[0.25em] text-center text-white italic">
      {text}
    </h3>
  </div>
);

const DataBox = ({ label, value, icon: Icon }) => (
  <div className="border border-slate-100 p-6 bg-white hover:bg-[#8C1515]/5 transition-all group relative">
    <div className="flex items-center gap-4 mb-3">
      <div className="text-slate-200 group-hover:text-[#D4AF37] transition-colors"><Icon size={16} /></div>
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-tight group-hover:text-[#8C1515] transition-colors">{label}</p>
    </div>
    <p className="text-base font-bold text-slate-900 truncate uppercase tracking-tight">{value || 'N/A'}</p>
  </div>
);

const TrackApplication = () => {
    const [reference, setReference] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [application, setApplication] = useState(null);
    const [comms, setComms] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .eq('reference_number', reference.trim())
                .eq('id_number', idNumber.trim());

            if (error) throw error;
            if (data && data.length > 0) {
                setApplication(data[0]);
                const { data: commsData } = await supabase
                    .from('application_comms')
                    .select('*')
                    .eq('application_id', data[0].id)
                    .order('created_at', { ascending: false });
                setComms(commsData || []);
            } else {
                alert('Academic record mismatch. Verify Reference and ID.');
            }
        } catch (err) {
            alert('System Interruption: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!application) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 selection:bg-[#8C1515]/10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white border-t-8 border-[#8C1515] shadow-2xl p-12 text-center"
                >
                    <img src="/logo.png" alt="AHS Crest" className="h-20 mx-auto mb-10 grayscale" />
                    <h1 className="text-sm font-black text-[#D4AF37] uppercase tracking-[0.6em] mb-4">Alexandria High School</h1>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 italic tracking-tight mb-12">Official Tracker</h2>
                    
                    <form onSubmit={handleSearch} className="space-y-8 text-left">
                        <div className="space-y-6">
                            <div className="border border-slate-100 p-5 focus-within:ring-1 focus-within:ring-[#8C1515] transition-all">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Reference / Verwysingsnommer</label>
                                <div className="flex items-center gap-3">
                                    <Lock size={16} className="text-slate-200" />
                                    <input
                                        type="text"
                                        placeholder="ALX-2026-XXXXX"
                                        value={reference}
                                        onChange={(e) => setReference(e.target.value)}
                                        className="w-full text-base font-bold text-slate-900 outline-none uppercase placeholder:text-slate-100"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="border border-slate-100 p-5 focus-within:ring-1 focus-within:ring-[#8C1515] transition-all">
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Official Learner ID</label>
                                <div className="flex items-center gap-3">
                                    <User size={16} className="text-slate-200" />
                                    <input
                                        type="text"
                                        placeholder="ID NUMBER"
                                        value={idNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        className="w-full text-base font-bold text-slate-900 outline-none uppercase placeholder:text-slate-100"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#8C1515] text-white h-20 rounded-full font-black uppercase text-[11px] tracking-[0.4em] shadow-xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group"
                        >
                            {loading ? <RefreshCw size={24} className="animate-spin" /> : (
                                <>
                                    Access Record
                                    <ChevronRight size={18} className="text-[#D4AF37] group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] py-12 md:py-24 px-4 selection:bg-[#8C1515]/10">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Official Brand Dashboard Header */}
                <div className="bg-white border-x border-t-8 border-t-[#8C1515] border-slate-200 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-28 h-28 bg-[#020617] text-[#D4AF37] flex items-center justify-center text-5xl font-serif font-bold italic shadow-2xl border-4 border-white ring-1 ring-[#D4AF37]/30">
                            {application.learner_first_name[0]}{application.learner_surname[0]}
                        </div>
                        <div className="text-center md:text-left space-y-3">
                            <span className="text-[11px] font-black text-[#8C1515] tracking-[0.5em] uppercase">Academic Profile</span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold italic text-slate-900 tracking-tight">
                                {application.learner_first_name} <span className="text-slate-500">{application.learner_surname}</span>
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 items-center text-slate-400">
                                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-[#D4AF37]" /> Authenticated
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} className="text-[#8C1515]" /> GRADE {application.grade_applying_for}
                                </span>
                                <div className="px-4 py-1 bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                                    REF: {application.reference_number}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => generateApplicationPDF(application, application.reference_number)}
                            className="bg-[#8C1515] text-white px-10 py-4 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-3"
                        >
                            <Download size={16} /> PDF Dossier
                        </button>
                        <button onClick={() => setApplication(null)} className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-[#8C1515] transition-colors"><X size={24} /></button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-2xl p-10 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#8C1515]/5 rounded-bl-full -z-10" />

                    {/* DYNAMIC STATUS PULSE */}
                    <SectionHeader text="Official Enrolment Pulse / Status" />
                    <div className={`p-12 border-2 flex flex-col md:flex-row items-center gap-12 mb-16 relative overflow-hidden ${
                        ['Accepted', 'Approved'].includes(application.status) ? 'bg-emerald-50/20 border-emerald-100' :
                        ['Rejected', 'Declined'].includes(application.status) ? 'bg-rose-50/20 border-rose-100' : 'bg-[#FAF9F6] border-slate-100'
                    }`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${
                            ['Accepted', 'Approved'].includes(application.status) ? 'bg-emerald-700 text-white' :
                            ['Rejected', 'Declined'].includes(application.status) ? 'bg-rose-700 text-white' :
                            'bg-[#8C1515] text-white'
                        }`}>
                            {['Accepted', 'Approved'].includes(application.status) ? <CheckCircle size={40} /> :
                             ['Rejected', 'Declined'].includes(application.status) ? <X size={40} /> :
                             <Activity size={40} className="animate-pulse" />}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Official Decision</span>
                                <div className="h-[1px] w-8 bg-slate-200" />
                            </div>
                            <h3 className="text-4xl font-serif font-bold italic text-slate-900 tracking-tight uppercase">{application.status || 'Processing'}</h3>
                            <p className="text-slate-500 text-base mt-3 font-medium italic leading-relaxed max-w-2xl">
                                {['Accepted', 'Approved'].includes(application.status) ? 'Accession formalized. The scholar has been successfully admitted to the Alexandria High School conservatory.' :
                                 ['Rejected', 'Declined'].includes(application.status) ? 'Review complete. We are unable to proceed with formal enrolment at this academic junction.' :
                                 'Administrative evaluation in progress. Credentials are undergoing rigorous academic review.'}
                            </p>
                        </div>
                    </div>

                    {/* BRANDED DATA GRID */}
                    <SectionHeader text="Academic Record / Leerderbesonderhede" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-slate-100">
                        <DataBox label="Legal First Names" value={application.learner_first_name} icon={User} />
                        <DataBox label="Academy Surname" value={application.learner_surname} icon={User} />
                        <DataBox label="Identity Ref" value={application.id_number} icon={ShieldCheck} />
                        <DataBox label="Programme Cycle" value={application.grade_applying_for} icon={School} />
                        <DataBox label="Primary Language" value={application.home_language} icon={MessageSquare} />
                        <DataBox label="Cycle Date" value={application.date_of_birth} icon={Calendar} />
                    </div>

                    {/* REFINED COMMS LOG */}
                    <SectionHeader text="Official Correspondence / Korrespondensie" />
                    <div className="space-y-6">
                        {comms.length === 0 ? (
                            <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-[#FAF9F6]">
                                <MessageSquare size={40} className="mx-auto text-slate-100 mb-6" />
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">No transmissions from the committee</p>
                            </div>
                        ) : (
                            comms.map((log, idx) => (
                                <div key={idx} className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all flex gap-8 items-start border-l-8 border-l-[#8C1515] group">
                                    <div className="w-14 h-14 bg-[#020617] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform">
                                        <Mail size={24} />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-6">
                                            <span className="text-[10px] font-black text-[#8C1515] uppercase tracking-[0.4em]">Formal {log.method} Transmission</span>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(log.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xl font-medium text-slate-700 italic leading-relaxed group-hover:text-slate-900 transition-colors">"{log.note}"</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* AHS System Footer */}
                    <div className="mt-32 pt-16 border-t border-slate-100 text-center flex flex-col items-center opacity-60">
                        <div className="flex items-center gap-8 mb-6">
                            <div className="h-[1px] w-20 bg-slate-200" />
                            <img src="/logo.png" alt="AHS" className="h-12 grayscale" />
                            <div className="h-[1px] w-20 bg-slate-200" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.8em] mb-3 leading-loose">Alexandria High School Conservatory &bull; System Integrity Lock</p>
                        <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Official Administrative Access Portals</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrackApplication;
