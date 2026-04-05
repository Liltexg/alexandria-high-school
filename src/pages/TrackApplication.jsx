import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, FileText, ChevronRight, AlertCircle, Edit, Save, X, Download, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useLanguage } from '../context/LanguageContext';
import { generateApplicationPDF } from '../utils/generateApplicationPDF';

const TrackApplication = () => {
    const { t } = useLanguage();
    const [creds, setCreds] = useState({ ref: '', id: '' });
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!creds.ref || !creds.id) return;

        setLoading(true);
        setError(null);

        try {
            // Direct secure query: match on both reference + ID number
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
        } catch (err) {
            alert('Failed to update: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const renderField = (label, value, key, type = "text") => {
        if (isEditing) {
            return (
                <div className="flex flex-col gap-2 p-4 bg-white border border-slate-200 rounded-xl">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
                    <input 
                        type={type}
                        value={editedData[key] || ''}
                        onChange={(e) => setEditedData({...editedData, [key]: e.target.value})}
                        className="text-lg font-semibold text-dark outline-none w-full"
                    />
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-1 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <span className="text-lg font-semibold text-dark">{value || '---'}</span>
            </div>
        )
    };

    return (
        <div className="bg-white min-h-screen">
            <PageHero title="Application Portal" subtitle="Secure track and update system" image="/school_wall.jpg" />

            <main className="section-padding pt-48 pb-32">
                <div className="container-wide max-w-4xl mx-auto">
                    
                    {!application ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 shadow-xl">
                            <div className="flex items-center gap-4 mb-8 text-primary">
                                <Lock size={24} />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">Identity Verification Required</span>
                            </div>
                            <h2 className="text-3xl font-bold text-dark mb-8">Access Your Application</h2>
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Reference Number</label>
                                        <input 
                                            type="text" required placeholder="e.g. ALX-2026-0001"
                                            value={creds.ref} onChange={e => setCreds({...creds, ref: e.target.value})}
                                            className="w-full h-16 px-6 bg-white border-2 border-slate-200 rounded-2xl text-lg font-semibold outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-2">Student ID Number</label>
                                        <input 
                                            type="text" required placeholder="13-digit ID"
                                            value={creds.id} onChange={e => setCreds({...creds, id: e.target.value})}
                                            className="w-full h-16 px-6 bg-white border-2 border-slate-200 rounded-2xl text-lg font-semibold outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-rose-500 font-medium flex items-center gap-2 px-2"><AlertCircle size={16}/> {error}</p>}
                                <button type="submit" disabled={loading} className="w-full h-16 bg-dark text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-3">
                                    {loading ? 'Verifying...' : 'Unlock Application'} <ChevronRight size={20} />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="space-y-12">
                            {/* Header & Controls */}
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-between p-10 bg-dark rounded-3xl text-white shadow-2xl">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <ShieldCheck className="text-emerald-400" size={20} />
                                        <span className="text-xs font-black uppercase tracking-widest opacity-60">Verified Access</span>
                                    </div>
                                    <h2 className="text-3xl font-bold">{application.learner_first_name} {application.learner_surname}</h2>
                                    <p className="text-white/40 font-mono text-sm">{application.reference_number} • {application.status}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setIsEditing(!isEditing)} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                                        {isEditing ? <><X size={18}/> Cancel</> : <><Edit size={18}/> Edit Profile</>}
                                    </button>
                                    {!isEditing && (
                                        <button onClick={() => generateApplicationPDF(application, application.reference_number)} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                                            <Download size={18}/> PDF
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-dark px-2 uppercase text-sm tracking-widest opacity-40">Learner Data</h3>
                                    {renderField("First Name", application.learner_first_name, "learner_first_name")}
                                    {renderField("Surname", application.learner_surname, "learner_surname")}
                                    {renderField("ID Number", application.id_number, "id_number")}
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold text-dark px-2 uppercase text-sm tracking-widest opacity-40">Parent Data</h3>
                                    {renderField("Contact Person", application.parent_primary_name, "parent_primary_name")}
                                    {renderField("Email Address", application.parent_primary_email, "parent_primary_email")}
                                    {renderField("Phone Number", application.parent_primary_contact, "parent_primary_contact")}
                                </div>
                            </div>

                            {isEditing && (
                                <button onClick={handleSave} disabled={saving} className="w-full h-16 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                                    <Save size={20} /> {saving ? 'Updating...' : 'Save All Changes'}
                                </button>
                            )}

                            <button onClick={() => setApplication(null)} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-dark transition-colors">
                                Logout & Close Vault
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TrackApplication;
