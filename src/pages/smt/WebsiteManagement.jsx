import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Save, Image as ImageIcon, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80',
        tag: 'Admissions',
        title: 'The Pursuit of',
        styledtitle: 'Knowledge.',
        desc: 'Join Alexandria High School, where academic excellence meets traditional values in a modern learning environment.'
    },
    {
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
        tag: 'Excellence',
        title: 'Heritage and',
        styledtitle: 'Legacy.',
        desc: 'Building future leaders through a comprehensive curriculum and diverse extracurricular activities since 1960.'
    },
    {
        image: 'https://images.unsplash.com/photo-1524384261446-d131a99f7a77?auto=format&fit=crop&q=80',
        tag: 'Tradition',
        title: 'Character and',
        styledtitle: 'Dignity.',
        desc: 'Fostering an environment where every student is empowered to achieve their full potential and contribute to society.'
    }
];

const WebsiteManagement = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [importing, setImporting] = useState(false);
    const [newSlide, setNewSlide] = useState({
        image: '',
        tag: '',
        title: '',
        styledtitle: '',
        desc: ''
    });

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setSlides(data || []);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlide = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .insert([newSlide])
                .select();

            if (error) throw error;

            setSlides([...slides, data[0]]);
            setNewSlide({ image: '', tag: '', title: '', styledtitle: '', desc: '' });

            // Institutional Digital Audit
            try {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from('audit_logs').insert([{
                    actor_id: user?.id,
                    action: 'WEBSITE_UPDATE',
                    resource_type: 'HERO_SLIDE',
                    details: { 
                        title: data[0].title,
                        tag: data[0].tag 
                    }
                }]);
            } catch (err) {}
        } catch (error) {
            console.error('Error adding slide:', error);
            alert('Failed to add slide');
        } finally {
            setSaving(false);
        }
    };

    const handleImportDefaults = async () => {
        if (!confirm('This will import the 3 default institutional slides into the database. Proceed?')) return;
        setImporting(true);
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .insert(DEFAULT_SLIDES)
                .select();

            if (error) throw error;
            setSlides([...slides, ...data]);
            
            // Audit
            try {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from('audit_logs').insert([{
                    actor_id: user?.id,
                    action: 'WEBSITE_IMPORT',
                    resource_type: 'HERO_SLIDES',
                    details: { count: DEFAULT_SLIDES.length }
                }]);
            } catch (err) {}
        } catch (error) {
            console.error('Error importing defaults:', error);
            alert('Failed to import defaults');
        } finally {
            setImporting(false);
        }
    };

    const handleDeleteSlide = async (id) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;

        try {
            const { error } = await supabase
                .from('hero_slides')
                .delete()
                .eq('id', id);

            if (error) throw error;
            const removedSlide = slides.find(s => s.id === id);
            setSlides(slides.filter(slide => slide.id !== id));

            // Audit
            try {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from('audit_logs').insert([{
                    actor_id: user?.id,
                    action: 'WEBSITE_REMOVE',
                    resource_type: 'HERO_SLIDE',
                    details: { 
                        title: removedSlide?.title 
                    }
                }]);
            } catch (err) {}
        } catch (error) {
            console.error('Error deleting slide:', error);
            alert('Failed to delete slide');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <RefreshCw size={32} className="animate-spin text-[#0055cc] opacity-40" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Loading Slides...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-10 font-win">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-2 border-[#b9d1ea] pb-8 relative">
                <div>
                    <h1 className="text-[28px] font-black text-[#003399] tracking-tight mb-2 flex items-center gap-3 drop-shadow-sm uppercase">
                        <ImageIcon className="text-[#0055cc]" size={32} /> Front Page Manager
                    </h1>
                    <p className="text-[11px] text-slate-500 font-black tracking-[0.2em] uppercase">Customize your main website banners and slides</p>
                </div>
                
                {slides.length === 0 && (
                    <button
                        onClick={handleImportDefaults}
                        disabled={importing}
                        className="win7-button !bg-blue-50 !border-blue-200 !text-blue-700 hover:!bg-blue-100 flex items-center gap-2"
                    >
                        {importing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                        Load Original School Slides
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Add New Slide Form */}
                <div className="bg-white rounded-[6px] border-2 border-[#d8e6f3] shadow-2xl h-fit overflow-hidden group hover:border-blue-200 transition-all">
                    <div className="bg-gradient-to-r from-[#f8fbff] to-[#e4eff8] px-6 py-4 border-b-2 border-[#d8e6f3] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-[2px] flex items-center justify-center shadow-lg">
                                <Plus size={18} className="text-white" />
                            </div>
                            <span className="text-[11px] font-black text-[#003399] uppercase tracking-widest">Add New Slide</span>
                        </div>
                    </div>

                    <form onSubmit={handleAddSlide} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] italic font-win">Image Link (High Quality)</label>
                                <input
                                    type="text"
                                    value={newSlide.image}
                                    onChange={e => setNewSlide({ ...newSlide, image: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#f8fbff] border-2 border-[#d8e6f3] rounded-[4px] text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:bg-white transition-all shadow-inner"
                                    placeholder="https://"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] italic font-win">Label (e.g. ADMISSIONS)</label>
                                    <input
                                        type="text"
                                        value={newSlide.tag}
                                        onChange={e => setNewSlide({ ...newSlide, tag: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#f8fbff] border-2 border-[#d8e6f3] rounded-[4px] text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:bg-white transition-all shadow-inner"
                                        placeholder="ADMISSIONS"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] italic font-win">Main Heading</label>
                                    <input
                                        type="text"
                                        value={newSlide.title}
                                        onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#f8fbff] border-2 border-[#d8e6f3] rounded-[4px] text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:bg-white transition-all shadow-inner"
                                        placeholder="THE PURSUIT OF"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] italic font-win">Sub-heading (Highlighted)</label>
                                <input
                                    type="text"
                                    value={newSlide.styledtitle}
                                    onChange={e => setNewSlide({ ...newSlide, styledtitle: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#f8fbff] border-2 border-[#d8e6f3] rounded-[4px] text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:bg-white transition-all shadow-inner uppercase"
                                    placeholder="KNOWLEDGE."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] italic font-win">Short Description</label>
                                <textarea
                                    value={newSlide.desc}
                                    onChange={e => setNewSlide({ ...newSlide, desc: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8fbff] border-2 border-[#d8e6f3] rounded-[4px] text-[13px] font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-400 focus:outline-none focus:bg-white transition-all shadow-inner h-24 resize-none leading-relaxed"
                                    placeholder="Tell the story..."
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-gradient-to-b from-blue-500 to-blue-700 text-white border-2 border-blue-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_20px_rgba(0,0,0,0.1)] hover:brightness-110 active:scale-95 transition-all rounded-[4px] text-[12px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                        >
                            {saving ? (
                                <><Loader2 size={18} className="animate-spin" /> SAVING...</>
                            ) : (
                                <><Save size={18} /> ADD SLIDE TO WEBSITE</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Existing Slides List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[12px] font-black text-[#003399] uppercase tracking-[0.3em] flex items-center gap-3">
                            <ImageIcon size={18} strokeWidth={3} /> CURRENT LIVE SLIDES 
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-black">{slides.length}</span>
                        </h2>
                    </div>

                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {slides.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-16 bg-[#f8fbff] border-2 border-dashed border-[#d8e6f3] rounded-[6px] text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-2 border-blue-100">
                                    <AlertCircle size={32} className="text-blue-300" />
                                </div>
                                <h3 className="text-[14px] font-black text-slate-700 uppercase tracking-widest mb-2 font-win">No Custom Slides</h3>
                                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px]">
                                    You haven't added any custom slides. The school's default images are currently showing.
                                </p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {slides.map((slide) => (
                                    <motion.div 
                                        key={slide.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[6px] border-2 border-[#d8e6f3] p-5 shadow-xl hover:border-blue-300 transition-all group flex gap-6 relative"
                                    >
                                        <div className="w-28 h-28 shrink-0 bg-white border-2 border-[#d8e6f3] p-1.5 rounded-[4px] shadow-lg group-hover:border-blue-400 transition-all overflow-hidden">
                                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded-[2px]" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="min-w-0">
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1 block italic font-win">
                                                        {slide.tag}
                                                    </span>
                                                    <h3 className="text-[18px] font-black text-[#003399] tracking-tight truncate leading-none uppercase font-win drop-shadow-sm">
                                                        {slide.title} <span className="text-slate-400 italic lowercase font-medium">{slide.styledtitle}</span>
                                                    </h3>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteSlide(slide.id)}
                                                    className="w-10 h-10 bg-slate-50 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full flex items-center justify-center transition-all border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[12px] text-slate-500 font-bold leading-relaxed line-clamp-2 italic font-win">
                                                "{slide.desc}"
                                            </p>
                                        </div>

                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>

                    {slides.length > 0 && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border-2 border-emerald-100 rounded-[6px]">
                            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest font-win italic">
                                Your custom slides are now live on the website.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebsiteManagement;
