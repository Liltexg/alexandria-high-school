import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Search, Filter, Edit2, Trash2, FileText, CheckCircle, Clock, X, Newspaper, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsForm from '../../components/smt/NewsForm';
import CustomDialog from '../../components/CustomDialog';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [dialog, setDialog] = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });

    const fetchNews = async () => {
        setLoading(true);
        let query = supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (filterStatus === 'published') {
            query = query.eq('is_published', true);
        } else if (filterStatus === 'draft') {
            query = query.eq('is_published', false);
        }

        if (searchQuery) {
            query = query.ilike('title', `%${searchQuery}%`);
        }

        const { data, error } = await query;
        if (error) console.error('Error fetching news:', error);
        else setNews(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();

        const channel = supabase
            .channel('smt-news')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
                fetchNews();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [filterStatus, searchQuery]);

    const handleEdit = (article) => {
        setEditingNews(article);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingNews(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingNews(null);
    };

    const handleFormSuccess = () => {
        handleModalClose();
        fetchNews();
    };

    const handleDelete = async (id) => {
        setDialog({
            isOpen: true,
            type: 'error',
            title: 'Delete Article',
            message: 'Are you sure you want to delete this article? This cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                setDialog(prev => ({ ...prev, isOpen: false }));
                const { error } = await supabase
                    .from('news')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Error deleting article:', error);
                    setTimeout(() => {
                        setDialog({
                            isOpen: true,
                            type: 'error',
                            title: 'Selection Error',
                            message: 'Failed to delete record. Please check your system permissions.',
                            confirmText: 'OK',
                            onConfirm: null
                        });
                    }, 300);
                } else {
                    setNews(prev => prev.filter(n => n.id !== id));
                    fetchNews();
                    setTimeout(() => {
                        setDialog({
                            isOpen: true,
                            type: 'success',
                            title: 'Record Eliminated',
                            message: 'The article has been permanently removed from the mainframe.',
                            confirmText: 'OK',
                            onConfirm: null
                        });
                    }, 300);
                }
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto pb-10 font-win">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#b9d1ea] pb-4">
                <div>
                    <h1 className="text-[22px] font-semibold text-[#003399] tracking-tight mb-1 flex items-center gap-2 drop-shadow-sm">
                        <Newspaper className="text-[#0055cc]" size={22} /> Newsroom
                    </h1>
                    <p className="text-[12px] text-slate-600 font-medium tracking-tight">Manage permanent stories and press releases.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="win7-button flex items-center gap-2 border-[#7cc4ff] text-[#004e99]"
                >
                    <Plus size={14} />
                    New Article
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-b from-white to-[#f0f5fa] p-3 rounded-[4px] border border-[#a3c3e6] shadow-[inset_0_1px_0_rgba(255,255,255,1)] mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search headlines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#a0a0a0] rounded-[3px] text-[13px] focus:border-[#0078d7] focus:outline-none shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Filter size={14} className="text-slate-500 shrink-0 mr-1" />
                    {['all', 'published', 'draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-[3px] text-[12px] font-medium transition-all capitalize ${filterStatus === status
                                ? 'bg-[#cce8ff] border border-[#99d1ff] text-[#003399]'
                                : 'border border-transparent text-slate-600 hover:bg-[#e5f3ff] hover:border-[#cce8ff]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-slate-500 text-[12px] font-medium animate-pulse">
                        <Loader2 className="animate-spin text-[#0055cc] inline-block mb-3" size={24} />
                        <p>Syncing Newsroom...</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-[4px] border border-[#a3c3e6] border-dashed">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-[#003399] font-semibold mb-1">Newsroom Empty</h3>
                        <p className="text-slate-500 text-[12px]">Write your first article or promote a notice.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {news.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="win7-gadget group relative overflow-hidden flex flex-col md:flex-row gap-6"
                            >
                                <div className="flex-1 relative z-10">
                                    <div className="flex items-start gap-4 mb-3">
                                        {item.is_published ? (
                                            <span className="px-2 py-0.5 rounded-[2px] bg-[#e5fbe5] text-[#008040] text-[10px] font-bold border border-[#b3e6b3] flex items-center gap-1.5 uppercase tracking-wider">
                                                <CheckCircle size={12} /> Published
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-[2px] bg-[#f0f5fa] text-[#003399] text-[10px] font-bold border border-[#a3c3e6] flex items-center gap-1.5 uppercase tracking-wider">
                                                <Clock size={12} /> Draft
                                            </span>
                                        )}
                                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                                            {new Date(item.published_at || item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-[17px] font-semibold text-[#003399] mb-1.5 drop-shadow-sm">{item.title}</h3>
                                    <p className="text-slate-700 text-[13px] line-clamp-2 mb-4 leading-relaxed font-medium opacity-80">{item.summary}</p>
                                </div>

                                <div className="flex items-center gap-2 self-start md:self-center border-t md:border-t-0 md:border-l border-[#d8e6f3] pt-4 md:pt-0 md:pl-5 w-full md:w-auto justify-end relative z-10">
                                    <button onClick={() => handleEdit(item)} className="win7-button !px-2.5" title="Edit"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="win7-button !px-2.5 border-red-200 hover:border-red-400" title="Delete"><Trash2 size={14} className="text-red-600" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleModalClose}
                            className="absolute inset-0 bg-blue-900/10 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-4xl win7-window flex flex-col max-h-[90vh] z-10"
                        >
                            <div className="win7-title-bar shrink-0">
                                <div className="flex items-center gap-3">
                                    <Newspaper className="text-slate-700" size={16} />
                                    <span className="text-[12px] font-medium text-slate-800 drop-shadow-sm truncate">
                                        {editingNews ? 'Edit Story' : 'New Story'} - Alexandria High School
                                    </span>
                                </div>
                                <div className="flex items-center gap-px -mr-1">
                                    <button onClick={handleModalClose} className="w-[45px] h-[18px] bg-gradient-to-b from-[#e81123]/30 to-[#e81123]/80 hover:from-[#e81123] hover:to-[#e81123] border border-white/10 flex items-center justify-center text-white transition-colors">
                                        <X size={10} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto bg-white">
                                <NewsForm
                                    article={editingNews}
                                    onSuccess={handleFormSuccess}
                                    onCancel={handleModalClose}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CustomDialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog({ ...dialog, isOpen: false })}
                onConfirm={dialog.onConfirm}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
            />
        </div>
    );
};

export default News;
