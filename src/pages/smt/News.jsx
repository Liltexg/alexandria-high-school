import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Search, Filter, Edit2, Trash2, FileText, CheckCircle, Clock, X } from 'lucide-react';
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
                const { error } = await supabase
                    .from('news')
                    .delete()
                    .eq('id', id);

                if (error) {
                    console.error('Error deleting article:', error);
                    alert('Failed to delete article. Please try again.');
                } else {
                    fetchNews();
                }
            }
        });
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 uppercase tracking-widest">Newsroom</h1>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">Manage permanent stories and press releases.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Article
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search headlines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Filter size={16} className="text-slate-400 shrink-0" />
                    {['all', 'published', 'draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${filterStatus === status
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        Loading News...
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-slate-900 font-bold mb-1">Newsroom Empty</h3>
                        <p className="text-slate-500 text-sm">Write your first article or promote a notice.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {news.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-3">
                                            {item.is_published ? (
                                                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-200 flex items-center gap-1">
                                                    <CheckCircle size={10} /> Published
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200 flex items-center gap-1">
                                                    <Clock size={10} /> Draft
                                                </span>
                                            )}
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                {new Date(item.published_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-slate-600 text-sm line-clamp-2 mb-4 font-medium">{item.summary}</p>
                                    </div>

                                    <div className="flex items-center gap-2 self-start md:self-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-end">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                                            title="Edit Article"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Article"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
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
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-slate-900">
                                        {editingNews ? 'Edit Story' : 'New Story'}
                                    </h2>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                        {editingNews ? 'Update existing content' : 'Create a new permanent record'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleModalClose}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
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
