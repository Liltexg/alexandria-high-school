import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, Calendar, Target, Type, FileText, Eye, EyeOff, Languages } from 'lucide-react';
import NoticePreview from './NoticePreview';

const NoticeForm = ({ notice = null, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [formData, setFormData] = useState({
        title: notice?.title || '',
        body: notice?.body || '',
        body_afrikaans: notice?.body_afrikaans || '',
        target_group: notice?.target_group || 'Learners',
        publish_at: notice?.publish_at ? new Date(notice.publish_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        expire_at: notice?.expire_at ? new Date(notice.expire_at).toISOString().slice(0, 16) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        status: notice?.status || 'active'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                publish_at: new Date(formData.publish_at).toISOString(),
                expire_at: new Date(formData.expire_at).toISOString(),
                updated_at: new Date().toISOString()
            };

            let error;
            if (notice?.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('notices')
                    .update(payload)
                    .eq('id', notice.id);
                error = updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('notices')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;
            onSuccess();
        } catch (err) {
            console.error('Error saving notice:', err);
            alert('Failed to save notice. Please check your permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title</label>
                <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., Grade 12 Math Extra Lessons"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Notice Content (English)</label>
                    <button
                        type="button"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isPreviewMode ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        {isPreviewMode ? <EyeOff size={12} /> : <Eye size={12} />}
                        {isPreviewMode ? 'Edit Content' : 'Preview Document'}
                    </button>
                </div>

                {!isPreviewMode ? (
                    <div className="space-y-6">
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-slate-300" size={16} />
                            <textarea
                                required
                                rows={4}
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                placeholder="Enter the English text of the notice here..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                                <Languages size={14} className="text-slate-400" />
                                Content (Afrikaans - Optional)
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-slate-300" size={16} />
                                <textarea
                                    rows={4}
                                    value={formData.body_afrikaans}
                                    onChange={(e) => setFormData({ ...formData, body_afrikaans: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none italic"
                                    placeholder="Skryf die Afrikaanse teks van die kennisgewing hier..."
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <NoticePreview
                            title={formData.title}
                            body={formData.body}
                            bodyAfrikaans={formData.body_afrikaans}
                            publishAt={formData.publish_at}
                            targetGroup={formData.target_group}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Target Group</label>
                    <div className="relative">
                        <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <select
                            value={formData.target_group}
                            onChange={(e) => setFormData({ ...formData, target_group: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="Learners">Learners</option>
                            <option value="Parents">Parents</option>
                            <option value="Staff">Staff</option>
                            <option value="Public">Public</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                    >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="active">Active (Visible)</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Publish Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="datetime-local"
                            required
                            value={formData.publish_at}
                            onChange={(e) => setFormData({ ...formData, publish_at: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Auto-Expiry</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="datetime-local"
                            required
                            value={formData.expire_at}
                            onChange={(e) => setFormData({ ...formData, expire_at: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
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
                    className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {notice ? 'Update Notice' : 'Create Notice'}
                </button>
            </div>
        </form>
    );
};

export default NoticeForm;
