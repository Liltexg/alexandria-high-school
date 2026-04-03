import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Save, Image as ImageIcon, Loader2 } from 'lucide-react';

const WebsiteManagement = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        e.preventDefault();
        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .insert([newSlide])
                .select();

            if (error) throw error;

            setSlides([...slides, data[0]]);
            setSlides([...slides, data[0]]);
            setNewSlide({ image: '', tag: '', title: '', styledtitle: '', desc: '' });
        } catch (error) {
            console.error('Error adding slide:', error);
            alert('Failed to add slide');
        } finally {
            setSaving(false);
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
            setSlides(slides.filter(slide => slide.id !== id));
        } catch (error) {
            console.error('Error deleting slide:', error);
            alert('Failed to delete slide');
        }
    };


    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 size={32} className="animate-spin text-primary" />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">Website Management</h1>
                <p className="text-slate-500">Manage the Hero section content and visuals.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Add New Slide Form */}
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-fit">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-primary" />
                        Add New Slide
                    </h2>

                    <form onSubmit={handleAddSlide} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
                            <input
                                type="text"
                                value={newSlide.image}
                                onChange={e => setNewSlide({ ...newSlide, image: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="https://..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tag</label>
                                <input
                                    type="text"
                                    value={newSlide.tag}
                                    onChange={e => setNewSlide({ ...newSlide, tag: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="e.g. Admissions"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Main Title</label>
                                <input
                                    type="text"
                                    value={newSlide.title}
                                    onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="e.g. Dignity"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Styled Title</label>
                                <input
                                    type="text"
                                    value={newSlide.styledtitle}
                                    onChange={e => setNewSlide({ ...newSlide, styledtitle: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="e.g. Refined."
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                            <textarea
                                value={newSlide.desc}
                                onChange={e => setNewSlide({ ...newSlide, desc: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary/50 transition-colors h-24 resize-none"
                                placeholder="Short description..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-lg hover:bg-primary-bright transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Add Slide'}
                        </button>
                    </form>
                </div>

                {/* Existing Slides List */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ImageIcon size={20} className="text-slate-400" />
                        Active Slides
                    </h2>

                    {slides.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400">No slides configured yet.</p>
                        </div>
                    ) : (
                        slides.map((slide) => (
                            <div key={slide.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group">
                                <div className="flex gap-6">
                                    <div className="w-32 h-32 shrink-0 bg-slate-100 rounded-lg overflow-hidden relative">
                                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                                                    {slide.tag}
                                                </span>
                                                <h3 className="text-xl font-bold text-slate-800 truncate">
                                                    {slide.title} <span className="font-serif italic font-normal text-slate-400">{slide.styledtitle}</span>
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteSlide(slide.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2">
                                            {slide.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebsiteManagement;
