import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, FileText, ChevronRight, AlertCircle, Edit, Save, X, Download, ShieldCheck, Activity, ClipboardList, MessageSquare, RefreshCw } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useLanguage } from '../context/LanguageContext';
import { generateApplicationPDF } from '../utils/generateApplicationPDF';

const TrackApplication = () => {
    const { t } = useLanguage();
    const [creds, setCreds] = useState({ ref: '', id: '' });
    const [application, setApplication] = useState(null);
    const [comms, setComms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('status');

    const STATUS_STEPS = [
        { key: 'pending', label: 'Submitted', desc: 'Application received' },
        { key: 'reviewing', label: 'Under Review', desc: 'Academic panel review' },
        { key: 'interview', label: 'Interview', desc: 'Parent/Learner meeting' },
        { key: 'finalizing', label: 'Finalizing', desc: 'Final documentation' },
        { key: 'approved', label: 'Accepted', desc: 'Admission granted' }
    ];

    const getStatusIndex = (status) => {
        const s = status?.toLowerCase();
        if (s === 'approved') return 4;
        if (s === 'declined') return 4;
        if (s === 'pending') return 0;
        return 1;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!creds.ref || !creds.id) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: rpcError } = await supabase
                .from('applications')
                .select('*')
                .eq('reference_number', creds.ref.trim())
                .eq('id_number', creds.id.trim())
                .limit(1);

            if (rpcError || !data || data.length === 0) {
                throw new Error('No match found. Please verify both Reference and ID Number.');
            }
            
            setApplication(data[0]);
            setEditedData(data[0]);

            const { data: commsData } = await supabase
                .from('application_comms')
                .select('*')
                .eq('application_id', data[0].id)
                .order('created_at', { ascending: false });
            
            setComms(commsData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error: updateError } = await supabase
                .from('applications')
                .update(editedData)
                .eq('id', application.id);

            if (updateError) throw updateError;
            
            setApplication(editedData);
            setIsEditing(false);
            alert('Application updated successfully.');
        } catch (err) (err) {
            alert('Failed to update: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const renderField = (label, value, key, type = "text") => {
        if (isEditing) {
            return (
                <div className="flex flex-col gap-2 p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm transition-all focus-within:border-primary">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{label}</label>
                    <input 
                        type={type}
                        value={editedData[key] || ''}
                        onChange={(e) => setEditedData({...editedData, [key]: e.target.value})}
                        className="text-lg font-bold text-dark outline-none w-full bg-transparent"
                    />
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-2 p-6 bg-white border border-slate-100 rounded-2xl group hover:border-primary/20 transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-primary transition-colors">{label}</span>
                <span className="text-lg font-bold text-dark tracking-tight">{value || '---'}</span>
            </div>
        )
    };

    return (
        <div className="bg-white min-h-screen font-body">
            <PageHero title="The Vault" subtitle="Institutional Admissions Portal" image="/school_wall.jpg" />

            <main className="section-padding pt-48 pb-32">
                <div className="container-wide max-w-5xl mx-auto">
                    
                    {!application ? (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-dark p-12 rounded-[3.5rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 blur-[100px] -mr-32 -mt-32" />
                            
                            <div className="flex items-center gap-4 mb-10 text-emerald-400">
                                <Lock size={20} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Biometric Access Required</span>
                            </div>
                            
                            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Identity Verification.</h2>
                            <p className="text-white/40 text-sm mb-12 leading-relaxed max-w-md">Access your institutional records via the secure Alexandria mainframe.</p>
                            
                            <form onSubmit={handleSearch} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/40 uppercase ml-1 tracking-widest">Reference Protocol</label>
                                        <input 
                                            type="text" required placeholder="ALX-2026-XXXXXX"
                                            value={creds.ref} onChange={e => setCreds({...creds, ref: e.target.value})}
                                            className="w-full h-18 px-8 bg-white/5 border-2 border-white/10 rounded-2xl text-xl font-bold text-white outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-white/40 uppercase ml-1 tracking-widest">Identification Sequence</label>
                                        <input 
                                            type="password" required placeholder="13-Digit ID"
                                            value={creds.id} onChange={e => setCreds({...creds, id: e.target.value})}
                                            className="w-full h-18 px-8 bg-white/5 border-2 border-white/10 rounded-2xl text-xl font-bold text-white outline-none focus:border-primary focus:bg-white/10 transition-all placeholder:text-white/10 tracking-[0.5em]"
                                        />
                                    </div>
                                </div>
                                
                                {error && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm font-bold">
                                        <AlertCircle size={18}/> {error}
                                    </motion.div>
                                )}
                                
                                <button type="submit" disabled={loading} className="w-full h-18 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,85,204,0.3)]">
                                    {loading ? <><RefreshCw size={24} className="animate-spin" /> Verifying...</> : <><ShieldCheck size={24} /> Initialize Access</>}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="space-y-12">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row items-center gap-10 p-12 bg-dark rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary" />
                                
                                <div className="w-40 h-40 rounded-[2.5rem] bg-white/5 border-4 border-white/10 flex items-center justify-center relative group">
                                    <span className="text-5xl font-black text-white/10 group-hover:text-primary transition-colors">
                                        {application.learner_first_name[0]}{application.learner_surname[0]}
                                    </span>
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            application.status?.toLowerCase() === 'approved' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                                            application.status?.toLowerCase() === 'declined' ? 'bg-rose-500/20 border-rose-500 text-rose-400' :
                                            'bg-primary/20 border-primary text-primary'
                                        }`}>
                                            {application.status}
                                        </span>
                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                            Ref: {application.reference_number}
                                        </span>
                                    </div>
                                    <h2 className="text-5xl font-bold mb-2 tracking-tight">
                                        {application.learner_first_name} <span className="text-primary">{application.learner_surname}</span>
                                    </h2>
                                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs underline underline-offset-8 decoration-primary/30">Admissions Node v1.0.4</p>
                                </div>

                                <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                                    <button onClick={() => generateApplicationPDF(application, application.reference_number)} className="h-14 bg-white/5 hover:bg-white/10 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-white/10 transition-all">
                                        <Download size={18} /> Download Dossier
                                    </button>
                                    <button onClick={() => setApplication(null)} className="h-14 hover:bg-rose-500/10 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-transparent hover:border-rose-500/20 text-white/30 hover:text-rose-400 transition-all">
                                        <X size={18} /> Terminate Session
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex justify-center gap-4 border-b-2 border-slate-100 pb-4">
                                {[
                                    { id: 'status', label: 'Timeline', icon: Activity },
                                    { id: 'details', label: 'Archive Data', icon: ClipboardList },
                                    { id: 'comms', label: 'Transmission Logs', icon: MessageSquare }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                                            activeTab === tab.id ? 'bg-dark text-white shadow-xl' : 'text-slate-400 hover:text-dark hover:bg-slate-50'
                                        }`}
                                    >
                                        <tab.icon size={18} /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'status' && (
                                    <motion.div key="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100">
                                        <div className="flex justify-between items-start mb-16 px-4">
                                            {STATUS_STEPS.map((step, idx) => {
                                                const currentIdx = getStatusIndex(application.status);
                                                const isCompleted = idx < currentIdx || application.status?.toLowerCase() === 'approved';
                                                const isActive = idx === currentIdx && application.status?.toLowerCase() !== 'approved';
                                                
                                                return (
                                                    <div key={idx} className="flex-1 relative last:flex-none">
                                                        <div className="flex flex-col items-center text-center gap-4">
                                                            <div className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center transition-all ${
                                                                isCompleted ? 'bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-200' :
                                                                isActive ? 'bg-primary border-primary/20 text-white shadow-lg shadow-primary/20' :
                                                                'bg-white border-slate-200 text-slate-300'
                                                            }`}>
                                                                {isCompleted ? <ShieldCheck size={24} /> : idx + 1}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className={`text-sm font-black uppercase tracking-widest ${isActive || isCompleted ? 'text-dark' : 'text-slate-400'}`}>
                                                                    {step.label}
                                                                </h4>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{step.desc}</p>
                                                            </div>
                                                        </div>
                                                        {idx < STATUS_STEPS.length - 1 && (
                                                            <div className="absolute top-7 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-1 bg-slate-200">
                                                                <div className={`h-full transition-all duration-1000 ${isCompleted ? 'w-full bg-emerald-500' : 'w-0'}`} />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-inner">
                                            <div className="flex items-center gap-4 mb-6">
                                                <AlertCircle className="text-primary" size={24} />
                                                <h3 className="text-xl font-bold text-dark uppercase tracking-tight">Institutional Update</h3>
                                            </div>
                                            <p className="text-slate-500 font-bold leading-relaxed italic text-lg text-center md:text-left">
                                                {application.status?.toLowerCase() === 'approved' ? 
                                                    "Congratulations. Your application has been successfully processed and accepted into Alexandria High School. Welcome to the legacy." :
                                                    application.status?.toLowerCase() === 'declined' ?
                                                    "We regret to inform you that your application has been unsuccessful at this time. We wish you the best in your academic journey." :
                                                    "Your application is currently being evaluated by the Academic Admissions Board. No further action is required at this time."
                                                }
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'details' && (
                                    <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <h3 className="text-[11px] font-black text-dark/40 uppercase tracking-[0.4em] ml-2">Learner Core Archive</h3>
                                                <div className="space-y-4">
                                                    {renderField("Full Names", application.learner_first_name, "learner_first_name")}
                                                    {renderField("Surname", application.learner_surname, "learner_surname")}
                                                    {renderField("Identification", application.id_number, "id_number")}
                                                    {renderField("Gender Node", application.gender, "gender")}
                                                    {renderField("Academic Grade", application.grade_applying_for, "grade_applying_for")}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-[11px] font-black text-dark/40 uppercase tracking-[0.4em] ml-2">Guardian Connectivity</h3>
                                                <div className="space-y-4">
                                                    {renderField("Primary Liaison", application.parent_primary_name, "parent_primary_name")}
                                                    {renderField("Digital Address", application.parent_primary_email, "parent_primary_email")}
                                                    {renderField("Voice Comm Link", application.parent_primary_contact, "parent_primary_contact")}
                                                    {renderField("Liaison Surname", application.parent_primary_surname, "parent_primary_surname")}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-200">
                                                    <Edit className="text-primary" size={24} />
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <h4 className="text-lg font-bold text-dark">Data Correction Required?</h4>
                                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Toggle edit mode to refine your archive.</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setIsEditing(!isEditing)} className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all w-full md:w-auto ${
                                                isEditing ? 'bg-primary text-white shadow-primary/20' : 'bg-white text-dark shadow-xl hover:bg-slate-50'
                                            }`}>
                                                {isEditing ? 'Exit Edit Protocol' : 'Initialize Correction'}
                                            </button>
                                        </div>

                                        {isEditing && (
                                            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={handleSave} disabled={saving} className="w-full h-18 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 shadow-2xl">
                                                <Save size={24} /> {saving ? 'Syncing Archive...' : 'Confirm System Update'}
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'comms' && (
                                    <motion.div key="comms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                        {comms.length === 0 ? (
                                            <div className="text-center py-24 bg-slate-50 rounded-[3.5rem] border border-dashed border-slate-200">
                                                <MessageSquare size={48} className="mx-auto text-slate-200 mb-6" />
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No transmission logs detected.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {comms.map((log, idx) => (
                                                    <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex gap-8 items-start hover:border-primary/20 transition-all">
                                                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                                            <Activity size={24} className="text-primary" />
                                                        </div>
                                                        <div className="space-y-3 flex-1">
                                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">{log.type || 'SYSTEM'} TRANSMISSION</span>
                                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</span>
                                                            </div>
                                                            <p className="text-lg text-slate-600 font-bold leading-relaxed">{log.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TrackApplication;
