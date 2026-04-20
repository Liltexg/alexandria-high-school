import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, Calendar, FileText, Type, Image, CheckCircle, Eye, EyeOff, Sparkles, BookOpen, Shield, AlertCircle, Trophy, Trash2 } from 'lucide-react';
import NewsPreview from './NewsPreview';

const TEMPLATES = {
    breaking: {
        label: 'Breaking News',
        content: `FOR IMMEDIATE RELEASE\n\n[HEADLINE IN ALL CAPS]\n\nALEXANDRIA, [DATE] — Alexandria High School is proud to announce [Core Event]. This development marks a significant milestone in our school's history.\n\n"We are absolutely thrilled with this outcome," said [Name], [Role] at AHS. "This reflects the hard work and dedication of നമ്മുടെ entire community."\n\nKey Highlights:\n- Highlight 1\n- Highlight 2\n- Highlight 3\n\nFurther updates will be shared as they become available via the official school portal.`
    },
    academic: {
        label: 'Academic Excellence',
        content: `[The Title of the Achievement]\n\nAlexandria High School continues to set the benchmark for academic excellence in the region. Our recent [Exam/Competition] results have once again proven that our students are among the brightest minds of their generation.\n\nIn the latest [Subject/Field] assessment, AHS achieved a 100% pass rate, with [Number] students obtaining distinctions.\n\nDepartment Head [Name] attributed the success to the implementation of the new [Program Name] which focuses on holistic learning and critical thinking.\n\nWe congratulate our students, faculty, and parents for this monumental success.`
    },
    sports: {
        label: 'Sporting Report',
        content: `[Match/Tournament Name]: AHS [Team Name] Victory\n\nIn a display of pure athleticism and sportsmanship, the Alexandria High School [Team] secured a [Score] victory against [Opponent] this past weekend.\n\nThe atmosphere at the [Venue] was electric as [Student Name] scored the winning [Goal/Point] in the final minutes of the game.\n\nCoach [Name] praised the team's resilience: "They played with heart and discipline. This is a win for every student who shows up to practice at 5 AM."\n\nUpcoming Fixtures:\n1. [Date] vs [Opponent]\n2. [Date] vs [Opponent]`
    }
};

const NewsForm = ({ article = null, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({
        title: article?.title || '',
        summary: article?.summary || '',
        content: article?.content || '',
        published_at: article?.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        is_published: article?.is_published || false,
        category: article?.category || 'news'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                published_at: new Date(formData.published_at).toISOString(),
                updated_at: new Date().toISOString()
            };

            let error;
            if (article?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('news')
                    .update(payload)
                    .eq('id', article.id);
                error = updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('news')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            // School News Protocol Audit
            try {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from('audit_logs').insert([{
                    actor_id: user?.id,
                    action: article?.id ? 'NEWS_UPDATE' : 'NEWS_PUBLISH',
                    resource_type: 'NEWS',
                    details: { title: formData.title }
                }]);
            } catch (err) {}

            onSuccess();
        } catch (err) {
            console.error('Error saving news:', err);
            alert(`Failed to save news article: ${err.message || 'Check your permissions.'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this article? This cannot be undone.')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', article.id);
            if (error) throw error;

            // School News Protocol Audit
            try {
                const { data: { user } } = await supabase.auth.getUser();
                await supabase.from('audit_logs').insert([{
                    actor_id: user?.id,
                    action: 'NEWS_REMOVE',
                    resource_type: 'NEWS',
                    details: { title: article?.title }
                }]);
            } catch (err) {}

            onSuccess();
        } catch (err) {
            console.error('Error deleting news:', err);
            alert('Failed to delete article.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Headline</label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="text"
                            required
                            maxLength={120}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-display font-bold text-lg"
                            placeholder="e.g., Annual Sports Day Results 2024"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Executive Summary</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-slate-300" size={16} />
                        <textarea
                            required
                            rows={2}
                            maxLength={250}
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                            placeholder="Brief overview for the card preview (Max 250 chars)"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                            Full Content (Markdown Supported)
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${showPreview
                                ? 'bg-primary text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {showPreview ? <BookOpen size={12} /> : <Eye size={12} />}
                            {showPreview ? 'Editing Mode' : 'Live Preview'}
                        </button>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-2">Quick Templates:</span>
                        {Object.entries(TEMPLATES).map(([key, template]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Overwrite current content with this template?')) {
                                        setFormData({ ...formData, content: template.content });
                                    }
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-1.5"
                            >
                                <Sparkles size={10} />
                                {template.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        {showPreview ? (
                            <div className="min-h-[400px]">
                                <NewsPreview
                                    title={formData.title}
                                    summary={formData.summary}
                                    content={formData.content}
                                    publishedAt={formData.published_at}
                                    category={formData.category}
                                />
                            </div>
                        ) : (
                            <textarea
                                required
                                rows={12}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm leading-relaxed"
                                placeholder="# Subheading&#10;&#10;Write your article content here. Use standard whitespace for paragraphs."
                            />
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Edition Type & Category</label>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: 'news', label: 'General News', icon: Shield },
                            { id: 'breaking', label: 'Breaking News', icon: AlertCircle },
                            { id: 'academic', label: 'Academic Excellence', icon: BookOpen },
                            { id: 'sports', label: 'Athletics/Sports', icon: Trophy }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all ${formData.category === cat.id
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                <cat.icon size={14} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Publish Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="datetime-local"
                                required
                                value={formData.published_at}
                                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Visibility Status</label>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                            className={`w-full py-2 px-4 rounded-lg flex items-center justify-between transition-all border ${formData.is_published
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-slate-200 border-slate-300 text-slate-500'
                                }`}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                {formData.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                                {formData.is_published ? 'Published (Visible)' : 'Draft (Hidden)'}
                            </span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.is_published ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_published ? 'left-6' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-6 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {article ? 'Update Article' : 'Publish Article'}
                </button>
            </div>

            {article && (
                <div className="flex justify-center pt-8">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 text-red-500 hover:text-white border border-red-500/20 hover:bg-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        <Trash2 size={16} />
                        Delete Article Permanently
                    </button>
                </div>
            )}
        </form>
    );
};

export default NewsForm;
